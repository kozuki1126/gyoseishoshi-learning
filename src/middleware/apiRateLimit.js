/**
 * API Rate Limiting Middleware
 * 
 * General-purpose rate limiting middleware for API endpoints to prevent
 * abuse, DDoS attacks, and ensure fair resource usage across all users.
 * 
 * Security Features:
 * - Dynamic rate limiting based on endpoint type
 * - User-specific rate limiting for authenticated requests
 * - IP-based fallback for anonymous requests
 * - Request prioritization for different user tiers
 * - Comprehensive monitoring and alerting
 * 
 * Usage:
 *   app.use('/api', createAPIRateLimit('API_GENERAL'));
 *   app.use('/api/admin', createAPIRateLimit('ADMIN_STRICT'));
 */

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { 
  getRateLimitConfig, 
  RATE_LIMITS, 
  SLOW_DOWN_CONFIGS,
  PROXY_CONFIG,
  isDevelopment,
  isProduction 
} = require('../config/rateLimits');

/**
 * Enhanced key generator that considers authentication status
 * @param {object} req - Express request object
 * @returns {string} - Unique key for rate limiting
 */
function generateRateLimitKey(req) {
  // Get base IP address
  const baseIP = PROXY_CONFIG.keyGenerator(req);
  
  // Check for authenticated user
  const userId = req.user?.id || req.userId;
  const userEmail = req.user?.email;
  
  // If user is authenticated, use user-based key for better tracking
  if (userId) {
    return `user:${userId}`;
  } else if (userEmail) {
    return `email:${userEmail}`;
  }
  
  // Fallback to IP-based key for anonymous requests
  return `ip:${baseIP}`;
}

/**
 * Skip function to bypass rate limiting for certain conditions
 * @param {object} req - Express request object
 * @returns {boolean} - True to skip rate limiting
 */
function shouldSkipRateLimit(req) {
  // Skip for static assets
  if (req.url?.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
    return true;
  }
  
  // Skip for health checks
  if (req.url === '/api/health' || req.url === '/api/status') {
    return true;
  }
  
  // Skip for development environment if specifically configured
  if (isDevelopment && process.env.SKIP_RATE_LIMIT === 'true') {
    return true;
  }
  
  // Skip for trusted IPs (if configured)
  const trustedIPs = (process.env.TRUSTED_IPS || '').split(',').filter(Boolean);
  if (trustedIPs.length > 0) {
    const clientIP = PROXY_CONFIG.keyGenerator(req);
    if (trustedIPs.includes(clientIP)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Custom handler for rate limit exceeded
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {object} next - Express next function
 * @param {object} options - Rate limit options
 */
function rateLimitExceededHandler(req, res, next, options) {
  const clientIP = PROXY_CONFIG.keyGenerator(req);
  const userAgent = req.get('User-Agent') || 'unknown';
  const endpoint = req.originalUrl || req.url;
  
  // Log rate limit event
  const logData = {
    timestamp: new Date().toISOString(),
    ip: clientIP,
    userAgent,
    endpoint,
    method: req.method,
    userId: req.user?.id || null,
    limit: options.max,
    windowMs: options.windowMs
  };
  
  console.warn('API Rate limit exceeded:', logData);
  
  // Send structured error response
  const errorResponse = {
    error: 'リクエストが多すぎます。しばらく時間をおいて再度お試しください。',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: Math.ceil(options.windowMs / 1000),
    limit: options.max,
    window: `${options.windowMs / (1000 * 60)} minutes`,
    message: options.message?.error || 'Rate limit exceeded'
  };
  
  res.status(429).json(errorResponse);
}

/**
 * Create API rate limiting middleware with specific configuration
 * @param {string} configType - Type of rate limit configuration
 * @param {object} customOptions - Optional custom options to override defaults
 * @returns {Function} - Express middleware function
 */
function createAPIRateLimit(configType = 'API_GENERAL', customOptions = {}) {
  const baseConfig = RATE_LIMITS[configType];
  
  if (!baseConfig) {
    throw new Error(`Rate limit configuration '${configType}' not found`);
  }
  
  const config = {
    ...baseConfig,
    ...customOptions,
    keyGenerator: generateRateLimitKey,
    skip: shouldSkipRateLimit,
    handler: rateLimitExceededHandler,
    onLimitReached: (req, res, options) => {
      console.warn(`Rate limit threshold reached for ${configType}:`, {
        key: generateRateLimitKey(req),
        endpoint: req.originalUrl,
        remaining: 0
      });
    }
  };
  
  return rateLimit(config);
}

/**
 * Dynamic API rate limiter that selects configuration based on request path
 * @param {object} req - Express request object
 * @param {object} res - Express response object  
 * @param {Function} next - Express next function
 */
function dynamicAPIRateLimit(req, res, next) {
  const path = req.originalUrl || req.url;
  const config = getRateLimitConfig(path);
  
  if (!config) {
    return next(); // No rate limiting for this endpoint
  }
  
  // Create rate limiter with dynamic configuration
  const limiter = rateLimit({
    ...config,
    keyGenerator: generateRateLimitKey,
    skip: shouldSkipRateLimit,
    handler: rateLimitExceededHandler
  });
  
  limiter(req, res, next);
}

/**
 * API slowdown middleware for progressive request delays
 */
const apiSlowDown = slowDown({
  ...SLOW_DOWN_CONFIGS.API_SLOWDOWN,
  keyGenerator: generateRateLimitKey,
  skip: shouldSkipRateLimit,
  onLimitReached: (req, res, options) => {
    console.log('API slowdown triggered:', {
      key: generateRateLimitKey(req),
      endpoint: req.originalUrl,
      delay: options.delay
    });
  }
});

/**
 * Burst protection middleware for handling traffic spikes
 */
const burstProtection = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: isDevelopment ? 200 : 60, // Allow 60 requests per minute normally
  keyGenerator: generateRateLimitKey,
  skip: shouldSkipRateLimit,
  message: {
    error: '短時間に多すぎるリクエストが検出されました。1分後に再度お試しください。',
    code: 'BURST_LIMIT_EXCEEDED',
    retryAfter: 60
  },
  handler: rateLimitExceededHandler
});

/**
 * File upload rate limiter (stricter limits)
 */
const uploadRateLimit = createAPIRateLimit('UPLOAD_MODERATE', {
  skipFailedRequests: true, // Don't count failed uploads towards limit
  skipSuccessfulRequests: false,
  // Custom skip logic for uploads
  skip: (req) => {
    if (shouldSkipRateLimit(req)) return true;
    
    // Only apply to actual file upload requests
    const contentType = req.headers['content-type'] || '';
    return !contentType.includes('multipart/form-data');
  }
});

/**
 * Search endpoint rate limiter
 */
const searchRateLimit = createAPIRateLimit('SEARCH_MODERATE', {
  // Skip empty search queries
  skip: (req) => {
    if (shouldSkipRateLimit(req)) return true;
    
    const query = req.query.q || req.body.query;
    return !query || query.trim().length === 0;
  }
});

/**
 * Admin endpoint rate limiter
 */
const adminRateLimit = createAPIRateLimit('ADMIN_STRICT', {
  // Stricter validation for admin endpoints
  skip: (req) => {
    if (shouldSkipRateLimit(req)) return true;
    
    // Always apply rate limiting to admin endpoints
    return false;
  }
});

/**
 * Monitoring middleware to track API usage statistics
 */
const usageStats = {
  requests: new Map(),
  rateLimitHits: new Map(),
  
  record(key, endpoint, limited = false) {
    const now = Date.now();
    const hour = Math.floor(now / (60 * 60 * 1000));
    const statsKey = `${hour}:${endpoint}`;
    
    if (!this.requests.has(statsKey)) {
      this.requests.set(statsKey, { count: 0, limited: 0 });
    }
    
    const stats = this.requests.get(statsKey);
    stats.count++;
    if (limited) stats.limited++;
    
    // Clean up old statistics (keep only last 24 hours)
    const cutoff = hour - 24;
    for (const [key] of this.requests) {
      const [keyHour] = key.split(':');
      if (parseInt(keyHour) < cutoff) {
        this.requests.delete(key);
      }
    }
  },
  
  getStats() {
    return {
      totalRequests: Array.from(this.requests.values()).reduce((sum, stats) => sum + stats.count, 0),
      totalLimited: Array.from(this.requests.values()).reduce((sum, stats) => sum + stats.limited, 0),
      endpointStats: Object.fromEntries(this.requests.entries())
    };
  }
};

/**
 * Usage tracking middleware
 */
function trackAPIUsage(req, res, next) {
  const key = generateRateLimitKey(req);
  const endpoint = req.originalUrl || req.url;
  
  // Track request
  usageStats.record(key, endpoint, false);
  
  // Override rate limit handler to track limited requests
  const originalHandler = rateLimitExceededHandler;
  res.rateLimitHandler = (options) => {
    usageStats.record(key, endpoint, true);
    return originalHandler(req, res, next, options);
  };
  
  next();
}

/**
 * Get comprehensive API usage statistics
 * @returns {object} - Usage statistics
 */
function getAPIStats() {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    usage: usageStats.getStats(),
    config: {
      development: isDevelopment,
      production: isProduction,
      skipRateLimit: process.env.SKIP_RATE_LIMIT === 'true'
    }
  };
}

/**
 * Health check middleware that bypasses rate limiting
 */
function healthCheck(req, res, next) {
  if (req.url === '/api/health') {
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      rateLimit: {
        enabled: true,
        stats: getAPIStats()
      }
    });
  }
  next();
}

module.exports = {
  // Main middleware functions
  createAPIRateLimit,
  dynamicAPIRateLimit,
  apiSlowDown,
  burstProtection,
  trackAPIUsage,
  healthCheck,
  
  // Specialized rate limiters
  uploadRateLimit,
  searchRateLimit,
  adminRateLimit,
  
  // Utility functions
  generateRateLimitKey,
  shouldSkipRateLimit,
  rateLimitExceededHandler,
  getAPIStats,
  
  // For monitoring and testing
  usageStats
};
