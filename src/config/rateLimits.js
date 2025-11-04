/**
 * Rate Limiting Configuration
 * 
 * Centralized configuration for all rate limiting rules across the application.
 * This module defines security parameters for different types of requests
 * to prevent abuse, brute force attacks, and DDoS attempts.
 * 
 * Security Strategy:
 * - Progressive rate limiting (stricter for sensitive endpoints)
 * - IP-based tracking with memory store (Redis for production)
 * - Detailed logging and monitoring integration
 * - Environment-specific configurations
 */

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Base rate limit configurations for different endpoint types
 */
const RATE_LIMITS = {
  // General API rate limiting
  API_GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? 1000 : 100, // Requests per window
    message: {
      error: 'リクエストが多すぎます。15分後に再度お試しください。',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: 15 * 60 // seconds
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests to static resources
    skip: (req) => {
      return req.url?.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/);
    }
  },

  // Authentication endpoints (login, register, password reset)
  AUTH_STRICT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isDevelopment ? 20 : 5, // Very strict for auth attempts
    message: {
      error: 'ログイン試行回数が制限を超えました。15分後に再度お試しください。',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: 15 * 60,
      details: 'セキュリティのため、ログイン試行は15分間に5回までに制限されています。'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Always apply to auth endpoints
    skip: () => false
  },

  // File upload endpoints
  UPLOAD_MODERATE: {
    windowMs: 10 * 60 * 1000, // 10 minutes  
    max: isDevelopment ? 50 : 10, // Limited uploads per window
    message: {
      error: 'ファイルアップロードの制限を超えました。10分後に再度お試しください。',
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      retryAfter: 10 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip if not a file upload
    skip: (req) => {
      return !req.headers['content-type']?.includes('multipart/form-data');
    }
  },

  // Admin panel endpoints
  ADMIN_STRICT: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: isDevelopment ? 100 : 20, // Moderate limit for admin operations
    message: {
      error: '管理操作の制限を超えました。5分後に再度お試しください。',
      code: 'ADMIN_RATE_LIMIT_EXCEEDED',
      retryAfter: 5 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => false
  },

  // Search and query endpoints
  SEARCH_MODERATE: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: isDevelopment ? 200 : 50, // Allow reasonable search activity
    message: {
      error: '検索リクエストが多すぎます。5分後に再度お試しください。',
      code: 'SEARCH_RATE_LIMIT_EXCEEDED',
      retryAfter: 5 * 60
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => false
  },

  // Password reset/recovery (even stricter than login)
  PASSWORD_RECOVERY: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: isDevelopment ? 10 : 3, // Maximum 3 password reset attempts per hour
    message: {
      error: 'パスワードリセット試行回数の制限を超えました。1時間後に再度お試しください。',
      code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED',
      retryAfter: 60 * 60,
      details: 'セキュリティのため、パスワードリセットは1時間に3回までに制限されています。'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => false
  }
};

/**
 * Slow-down configurations (gradually increase response time)
 */
const SLOW_DOWN_CONFIGS = {
  // Progressive slowdown for general API
  API_SLOWDOWN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: isDevelopment ? 100 : 25, // Allow first 25 requests at normal speed
    delayMs: 500, // Add 500ms delay after delayAfter is reached
    maxDelayMs: 10000, // Maximum delay of 10 seconds
    skipFailedRequests: true, // Don't slow down on failed requests
    skipSuccessfulRequests: false
  },

  // Aggressive slowdown for auth endpoints
  AUTH_SLOWDOWN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: isDevelopment ? 5 : 2, // Start slowing down after 2 requests
    delayMs: 1000, // Add 1 second delay
    maxDelayMs: 30000, // Maximum delay of 30 seconds
    skipFailedRequests: false, // Apply delay even on failed auth attempts
    skipSuccessfulRequests: false
  }
};

/**
 * Custom store configuration for production
 * In production, you should use Redis or another external store
 */
const STORE_CONFIG = {
  // Memory store configuration (for development)
  MEMORY: {
    type: 'memory',
    max: 10000, // Maximum number of records to keep
    resetTime: 24 * 60 * 60 * 1000 // Reset after 24 hours
  },

  // Redis store configuration (for production)
  REDIS: {
    type: 'redis',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB) || 0,
    keyPrefix: 'rl:', // Rate limit key prefix
    connectTimeout: 5000,
    lazyConnect: true
  }
};

/**
 * Trusted proxy configuration
 * Configure based on your deployment environment
 */
const PROXY_CONFIG = {
  // Number of trusted proxy hops
  trust: isProduction ? 1 : 0, // Trust first proxy in production (e.g., CloudFlare, nginx)
  
  // Custom key generator to handle proxies correctly
  keyGenerator: (req) => {
    // Get real IP address considering proxies
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = forwarded ? forwarded.split(',')[0].trim() : req.connection.remoteAddress;
    
    // In development, use connection IP
    if (isDevelopment) {
      return req.connection.remoteAddress || 'unknown';
    }
    
    return realIp || req.connection.remoteAddress || 'unknown';
  }
};

/**
 * Logging configuration for rate limiting events
 */
const LOGGING_CONFIG = {
  // Log all rate limit hits
  logHits: true,
  
  // Log configuration
  logLevel: isProduction ? 'warn' : 'info',
  
  // Custom log format
  logFormat: (req, limit, current, remaining) => ({
    timestamp: new Date().toISOString(),
    ip: PROXY_CONFIG.keyGenerator(req),
    userAgent: req.headers['user-agent'],
    url: req.url,
    method: req.method,
    limit,
    current,
    remaining,
    blocked: current > limit
  })
};

/**
 * Endpoint-specific rate limit mapping
 * Maps URL patterns to rate limit configurations
 */
const ENDPOINT_MAPPINGS = {
  // Authentication endpoints
  '/api/auth/login': 'AUTH_STRICT',
  '/api/auth/register': 'AUTH_STRICT', 
  '/api/auth/logout': 'AUTH_MODERATE',
  
  // Password recovery
  '/api/auth/forgot-password': 'PASSWORD_RECOVERY',
  '/api/auth/reset-password': 'PASSWORD_RECOVERY',
  
  // File uploads
  '/api/upload': 'UPLOAD_MODERATE',
  '/api/files/upload': 'UPLOAD_MODERATE',
  
  // Admin endpoints
  '/api/admin/*': 'ADMIN_STRICT',
  
  // Search endpoints
  '/api/search': 'SEARCH_MODERATE',
  '/api/content/search': 'SEARCH_MODERATE',
  
  // Default for all other API endpoints
  '/api/*': 'API_GENERAL'
};

/**
 * Get rate limit configuration for a specific endpoint
 * @param {string} path - Request path
 * @returns {object} - Rate limit configuration
 */
function getRateLimitConfig(path) {
  // Find matching endpoint pattern
  for (const [pattern, configName] of Object.entries(ENDPOINT_MAPPINGS)) {
    if (pattern.includes('*')) {
      // Handle wildcard patterns
      const regexPattern = pattern.replace('*', '.*');
      if (new RegExp(`^${regexPattern}`).test(path)) {
        return RATE_LIMITS[configName];
      }
    } else if (path === pattern) {
      // Exact match
      return RATE_LIMITS[configName];
    }
  }
  
  // Default to general API rate limiting
  return RATE_LIMITS.API_GENERAL;
}

/**
 * Create rate limit middleware with specified configuration
 * @param {string} configName - Configuration name from RATE_LIMITS
 * @returns {Function} - Express rate limit middleware
 */
function createRateLimitMiddleware(configName) {
  const config = RATE_LIMITS[configName];
  if (!config) {
    throw new Error(`Rate limit configuration '${configName}' not found`);
  }

  return {
    ...config,
    keyGenerator: PROXY_CONFIG.keyGenerator,
    // Add logging
    onLimitReached: (req, res, options) => {
      const logData = LOGGING_CONFIG.logFormat(req, options.max, req.rateLimit?.current || 0, 0);
      console.warn('Rate limit exceeded:', logData);
      
      // You can integrate with external logging service here
      // logger.warn('Rate limit exceeded', logData);
    }
  };
}

module.exports = {
  RATE_LIMITS,
  SLOW_DOWN_CONFIGS,
  STORE_CONFIG,
  PROXY_CONFIG,
  LOGGING_CONFIG,
  ENDPOINT_MAPPINGS,
  getRateLimitConfig,
  createRateLimitMiddleware,
  
  // Export environment flags for conditional logic
  isDevelopment,
  isProduction
};
