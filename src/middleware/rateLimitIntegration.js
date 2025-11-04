/**
 * Rate Limiting Integration Middleware
 * 
 * Central integration point for all rate limiting functionality.
 * This module combines login protection, API rate limiting, and
 * logging to provide comprehensive request protection.
 * 
 * Features:
 * - Automatic middleware application based on routes
 * - Integrated logging and monitoring
 * - Dynamic configuration per endpoint
 * - Development/Production environment handling
 * 
 * Usage in Next.js API routes:
 *   import { withRateLimit } from '@/middleware/rateLimitIntegration';
 *   export default withRateLimit(handler, 'AUTH_STRICT');
 */

const { loginProtection } = require('./loginRateLimit');
const { 
  dynamicAPIRateLimit, 
  createAPIRateLimit,
  burstProtection,
  trackAPIUsage,
  healthCheck
} = require('./apiRateLimit');
const logger = require('../lib/logger');

/**
 * Route-based rate limiting configuration
 * Maps API routes to appropriate rate limiting strategies
 */
const ROUTE_CONFIGURATIONS = {
  // Authentication routes - strictest protection
  '/api/auth/login': {
    middleware: loginProtection,
    config: 'AUTH_STRICT',
    logEvent: 'auth_attempt'
  },
  '/api/auth/register': {
    middleware: loginProtection,
    config: 'AUTH_STRICT', 
    logEvent: 'registration_attempt'
  },
  '/api/auth/forgot-password': {
    middleware: [createAPIRateLimit('PASSWORD_RECOVERY')],
    config: 'PASSWORD_RECOVERY',
    logEvent: 'password_reset_request'
  },
  '/api/auth/logout': {
    middleware: [createAPIRateLimit('API_GENERAL')],
    config: 'API_GENERAL',
    logEvent: 'logout_attempt'
  },

  // File upload routes
  '/api/upload': {
    middleware: [createAPIRateLimit('UPLOAD_MODERATE'), burstProtection],
    config: 'UPLOAD_MODERATE',
    logEvent: 'file_upload_attempt'
  },
  '/api/files/upload': {
    middleware: [createAPIRateLimit('UPLOAD_MODERATE'), burstProtection],
    config: 'UPLOAD_MODERATE',
    logEvent: 'file_upload_attempt'
  },

  // Admin routes - strict protection
  '/api/admin': {
    middleware: [createAPIRateLimit('ADMIN_STRICT')],
    config: 'ADMIN_STRICT',
    logEvent: 'admin_access'
  },

  // Search routes
  '/api/search': {
    middleware: [createAPIRateLimit('SEARCH_MODERATE')],
    config: 'SEARCH_MODERATE',
    logEvent: 'search_request'
  },
  '/api/content/search': {
    middleware: [createAPIRateLimit('SEARCH_MODERATE')],
    config: 'SEARCH_MODERATE',
    logEvent: 'content_search'
  },

  // General API routes - default protection
  '/api': {
    middleware: [dynamicAPIRateLimit, burstProtection],
    config: 'API_GENERAL',
    logEvent: 'api_request'
  }
};

/**
 * Get the most specific route configuration for a given path
 * @param {string} path - Request path
 * @returns {object|null} - Route configuration
 */
function getRouteConfig(path) {
  // Try exact match first
  if (ROUTE_CONFIGURATIONS[path]) {
    return ROUTE_CONFIGURATIONS[path];
  }

  // Try pattern matching (most specific first)
  const sortedRoutes = Object.keys(ROUTE_CONFIGURATIONS)
    .filter(route => route !== '/api') // Handle /api last as fallback
    .sort((a, b) => b.length - a.length);

  for (const route of sortedRoutes) {
    if (path.startsWith(route)) {
      return ROUTE_CONFIGURATIONS[route];
    }
  }

  // Fallback to general API config if starts with /api
  if (path.startsWith('/api')) {
    return ROUTE_CONFIGURATIONS['/api'];
  }

  return null;
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 * @param {Function} handler - Next.js API handler function
 * @param {string} configType - Optional specific rate limit config
 * @returns {Function} - Wrapped handler with rate limiting
 */
function withRateLimit(handler, configType = null) {
  return async (req, res) => {
    try {
      // Health check bypass
      if (req.url === '/api/health') {
        return healthCheck(req, res, () => handler(req, res));
      }

      const path = req.url || '';
      const routeConfig = getRouteConfig(path);

      // If no rate limiting configured for this route, proceed normally
      if (!routeConfig && !configType) {
        return handler(req, res);
      }

      // Determine which middleware to apply
      let middleware;
      let logEvent;

      if (configType) {
        // Explicit configuration provided
        middleware = [createAPIRateLimit(configType)];
        logEvent = `api_${configType.toLowerCase()}`;
      } else if (routeConfig) {
        // Use route-based configuration
        middleware = Array.isArray(routeConfig.middleware) 
          ? routeConfig.middleware 
          : [routeConfig.middleware];
        logEvent = routeConfig.logEvent;
      }

      // Apply usage tracking
      trackAPIUsage(req, res, () => {});

      // Apply rate limiting middleware
      const applyMiddleware = (middlewareArray, index = 0) => {
        if (index >= middlewareArray.length) {
          // All middleware applied, proceed to handler
          return handler(req, res);
        }

        const currentMiddleware = middlewareArray[index];
        
        if (Array.isArray(currentMiddleware)) {
          // Handle nested middleware arrays (like loginProtection)
          return applyMiddleware(currentMiddleware, 0);
        }

        return currentMiddleware(req, res, (error) => {
          if (error) {
            logger.error('Rate limit middleware error', {
              error: error.message,
              path,
              method: req.method,
              ip: req.connection.remoteAddress
            });
            return res.status(500).json({
              error: 'Internal server error',
              code: 'MIDDLEWARE_ERROR'
            });
          }
          
          // Continue to next middleware
          return applyMiddleware(middlewareArray, index + 1);
        });
      };

      // Log the request attempt
      if (logEvent) {
        logger.info(`API Request: ${logEvent}`, {
          path,
          method: req.method,
          ip: req.connection.remoteAddress,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        });
      }

      return applyMiddleware(middleware);

    } catch (error) {
      logger.error('Rate limiting integration error', {
        error: error.message,
        stack: error.stack,
        path: req.url,
        method: req.method
      });

      return res.status(500).json({
        error: 'Internal server error',
        code: 'RATE_LIMIT_INTEGRATION_ERROR'
      });
    }
  };
}

/**
 * Express-style middleware for non-Next.js applications
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function
 */
function rateLimitMiddleware(req, res, next) {
  const path = req.originalUrl || req.url || '';
  const routeConfig = getRouteConfig(path);

  if (!routeConfig) {
    return next();
  }

  // Apply usage tracking
  trackAPIUsage(req, res, () => {});

  // Get middleware array
  const middleware = Array.isArray(routeConfig.middleware) 
    ? routeConfig.middleware 
    : [routeConfig.middleware];

  // Apply middleware sequentially
  let currentIndex = 0;
  
  const applyNext = (error) => {
    if (error) {
      logger.error('Rate limit middleware error', {
        error: error.message,
        path,
        method: req.method
      });
      return next(error);
    }

    if (currentIndex >= middleware.length) {
      return next(); // All middleware applied
    }

    const currentMiddleware = middleware[currentIndex++];
    
    if (Array.isArray(currentMiddleware)) {
      // Handle login protection array
      let subIndex = 0;
      const applySubMiddleware = (subError) => {
        if (subError) return next(subError);
        if (subIndex >= currentMiddleware.length) return applyNext();
        
        const subMiddleware = currentMiddleware[subIndex++];
        subMiddleware(req, res, applySubMiddleware);
      };
      applySubMiddleware();
    } else {
      currentMiddleware(req, res, applyNext);
    }
  };

  applyNext();
}

/**
 * Initialize rate limiting for the entire application
 * @param {object} app - Express app instance
 */
function initializeRateLimiting(app) {
  logger.info('Initializing rate limiting system');

  // Apply health check first (bypasses rate limiting)
  app.use('/api/health', healthCheck);

  // Apply general tracking to all API routes
  app.use('/api', trackAPIUsage);

  // Apply burst protection to all API routes
  app.use('/api', burstProtection);

  // Apply dynamic rate limiting
  app.use('/api', rateLimitMiddleware);

  logger.info('Rate limiting system initialized successfully');
}

/**
 * Get comprehensive rate limiting statistics
 * @returns {object} - Rate limiting stats
 */
function getRateLimitingStats() {
  const stats = logger.getStats();
  
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    security: stats,
    routes: {
      configured: Object.keys(ROUTE_CONFIGURATIONS).length,
      patterns: ROUTE_CONFIGURATIONS
    }
  };
}

/**
 * Middleware to add rate limiting headers to responses
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function
 */
function addRateLimitHeaders(req, res, next) {
  // Add security headers
  res.setHeader('X-RateLimit-System', 'active');
  res.setHeader('X-Security-Level', 'high');
  
  // Add rate limit information if available
  if (req.rateLimit) {
    res.setHeader('X-RateLimit-Limit', req.rateLimit.limit);
    res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', req.rateLimit.reset);
  }
  
  next();
}

module.exports = {
  withRateLimit,
  rateLimitMiddleware,
  initializeRateLimiting,
  getRateLimitingStats,
  addRateLimitHeaders,
  getRouteConfig,
  
  // Export configurations for testing
  ROUTE_CONFIGURATIONS
};
