/**
 * CSRF (Cross-Site Request Forgery) Protection Module
 * 
 * Comprehensive CSRF protection system that prevents unauthorized
 * cross-site requests by implementing secure token validation.
 * Supports both synchronizer token pattern and double-submit cookies.
 * 
 * Security Features:
 * - Cryptographically secure token generation
 * - Multiple CSRF protection patterns
 * - Token expiration and rotation
 * - SameSite cookie configuration
 * - Referrer validation
 * - Custom token embedding for forms
 * 
 * Usage:
 *   const csrf = require('./csrfProtection');
 *   app.use(csrf.middleware());
 *   const token = csrf.generateToken(req);
 */

const crypto = require('crypto');

/**
 * CSRF configuration constants
 */
const CSRF_CONFIG = {
  // Token configuration
  TOKEN_LENGTH: 32,
  TOKEN_LIFETIME: 60 * 60 * 1000, // 1 hour in milliseconds
  MAX_TOKENS_PER_SESSION: 10,
  
  // Cookie configuration
  COOKIE_NAME: '__csrf_token',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour
  },
  
  // Header names
  HEADER_NAMES: [
    'x-csrf-token',
    'x-xsrf-token',
    'csrf-token'
  ],
  
  // Form field name
  FORM_FIELD_NAME: '_csrf',
  
  // Methods that require CSRF protection
  PROTECTED_METHODS: ['POST', 'PUT', 'PATCH', 'DELETE'],
  
  // Safe methods that don't require CSRF protection
  SAFE_METHODS: ['GET', 'HEAD', 'OPTIONS']
};

/**
 * In-memory token store (in production, use Redis or database)
 */
class CSRFTokenStore {
  constructor() {
    this.tokens = new Map(); // sessionId -> { tokens: Map, lastCleanup: Date }
    this.cleanup();
  }

  /**
   * Store a token for a session
   * @param {string} sessionId - Session identifier
   * @param {string} token - CSRF token
   * @param {Date} expiry - Token expiry date
   */
  storeToken(sessionId, token, expiry) {
    if (!this.tokens.has(sessionId)) {
      this.tokens.set(sessionId, {
        tokens: new Map(),
        lastCleanup: new Date()
      });
    }

    const sessionData = this.tokens.get(sessionId);
    sessionData.tokens.set(token, expiry);

    // Limit number of tokens per session
    if (sessionData.tokens.size > CSRF_CONFIG.MAX_TOKENS_PER_SESSION) {
      // Remove oldest token
      const oldestToken = sessionData.tokens.keys().next().value;
      sessionData.tokens.delete(oldestToken);
    }
  }

  /**
   * Verify if a token is valid for a session
   * @param {string} sessionId - Session identifier
   * @param {string} token - CSRF token to verify
   * @returns {boolean} - True if token is valid and not expired
   */
  verifyToken(sessionId, token) {
    const sessionData = this.tokens.get(sessionId);
    if (!sessionData) {
      return false;
    }

    const expiry = sessionData.tokens.get(token);
    if (!expiry) {
      return false;
    }

    // Check if token is expired
    if (new Date() > expiry) {
      sessionData.tokens.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Invalidate a token after use (optional - depends on strategy)
   * @param {string} sessionId - Session identifier
   * @param {string} token - CSRF token to invalidate
   */
  invalidateToken(sessionId, token) {
    const sessionData = this.tokens.get(sessionId);
    if (sessionData) {
      sessionData.tokens.delete(token);
    }
  }

  /**
   * Clean up expired tokens
   */
  cleanup() {
    setInterval(() => {
      const now = new Date();
      
      for (const [sessionId, sessionData] of this.tokens.entries()) {
        // Remove expired tokens
        for (const [token, expiry] of sessionData.tokens.entries()) {
          if (now > expiry) {
            sessionData.tokens.delete(token);
          }
        }
        
        // Remove empty sessions
        if (sessionData.tokens.size === 0) {
          this.tokens.delete(sessionId);
        }
      }
    }, 5 * 60 * 1000); // Clean up every 5 minutes
  }

  /**
   * Get statistics about token store
   * @returns {object} - Token store statistics
   */
  getStats() {
    let totalTokens = 0;
    for (const sessionData of this.tokens.values()) {
      totalTokens += sessionData.tokens.size;
    }
    
    return {
      activeSessions: this.tokens.size,
      totalTokens,
      averageTokensPerSession: this.tokens.size > 0 ? totalTokens / this.tokens.size : 0
    };
  }
}

const tokenStore = new CSRFTokenStore();

/**
 * CSRF Protection utilities
 */
const CSRFProtection = {
  /**
   * Generate a cryptographically secure CSRF token
   * @returns {string} - Base64 encoded token
   */
  generateSecureToken() {
    return crypto.randomBytes(CSRF_CONFIG.TOKEN_LENGTH).toString('base64url');
  },

  /**
   * Get session ID from request (customize based on your session implementation)
   * @param {object} req - Express request object
   * @returns {string} - Session ID
   */
  getSessionId(req) {
    // Try multiple methods to get session ID
    if (req.session && req.session.id) {
      return req.session.id;
    }
    
    if (req.sessionID) {
      return req.sessionID;
    }
    
    // Fallback to IP + User-Agent hash for stateless sessions
    const identifier = req.ip + req.get('User-Agent');
    return crypto.createHash('sha256').update(identifier).digest('hex');
  },

  /**
   * Generate CSRF token for a request
   * @param {object} req - Express request object
   * @returns {string} - CSRF token
   */
  generateToken(req) {
    const token = this.generateSecureToken();
    const sessionId = this.getSessionId(req);
    const expiry = new Date(Date.now() + CSRF_CONFIG.TOKEN_LIFETIME);
    
    // Store token
    tokenStore.storeToken(sessionId, token, expiry);
    
    // Set token in cookie for double-submit pattern
    if (req.res) {
      req.res.cookie(CSRF_CONFIG.COOKIE_NAME, token, CSRF_CONFIG.COOKIE_OPTIONS);
    }
    
    return token;
  },

  /**
   * Extract CSRF token from request
   * @param {object} req - Express request object
   * @returns {string|null} - CSRF token or null if not found
   */
  extractToken(req) {
    // Check headers first
    for (const headerName of CSRF_CONFIG.HEADER_NAMES) {
      const token = req.get(headerName);
      if (token) {
        return token;
      }
    }
    
    // Check form body
    if (req.body && req.body[CSRF_CONFIG.FORM_FIELD_NAME]) {
      return req.body[CSRF_CONFIG.FORM_FIELD_NAME];
    }
    
    // Check query parameters (less secure, but sometimes necessary)
    if (req.query && req.query[CSRF_CONFIG.FORM_FIELD_NAME]) {
      return req.query[CSRF_CONFIG.FORM_FIELD_NAME];
    }
    
    return null;
  },

  /**
   * Verify CSRF token for a request
   * @param {object} req - Express request object
   * @returns {boolean} - True if token is valid
   */
  verifyToken(req) {
    const token = this.extractToken(req);
    if (!token) {
      return false;
    }
    
    const sessionId = this.getSessionId(req);
    
    // Verify token in store (synchronizer token pattern)
    const isValidInStore = tokenStore.verifyToken(sessionId, token);
    
    // Double-submit cookie verification
    const cookieToken = req.cookies && req.cookies[CSRF_CONFIG.COOKIE_NAME];
    const isValidCookie = cookieToken && cookieToken === token;
    
    // Token is valid if either verification method passes
    return isValidInStore || isValidCookie;
  },

  /**
   * Validate request origin/referrer
   * @param {object} req - Express request object
   * @returns {boolean} - True if origin is valid
   */
  validateOrigin(req) {
    const origin = req.get('Origin') || req.get('Referer');
    if (!origin) {
      return false; // Reject requests without origin/referrer
    }
    
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []
    ].flat();
    
    // Check if origin matches allowed origins
    return allowedOrigins.some(allowedOrigin => {
      try {
        const originUrl = new URL(origin);
        const allowedUrl = new URL(allowedOrigin);
        
        return originUrl.origin === allowedUrl.origin;
      } catch (error) {
        return false;
      }
    });
  },

  /**
   * Create CSRF protection middleware
   * @param {object} options - Middleware options
   * @returns {Function} - Express middleware
   */
  createMiddleware(options = {}) {
    const {
      skipRoutes = [],
      skipMethods = CSRF_CONFIG.SAFE_METHODS,
      requireOrigin = true,
      onError = null
    } = options;

    return (req, res, next) => {
      // Skip if method doesn't require CSRF protection
      if (skipMethods.includes(req.method)) {
        return next();
      }
      
      // Skip specific routes
      if (skipRoutes.some(route => {
        if (typeof route === 'string') {
          return req.path === route;
        } else if (route instanceof RegExp) {
          return route.test(req.path);
        }
        return false;
      })) {
        return next();
      }
      
      // Validate origin/referrer if required
      if (requireOrigin && !this.validateOrigin(req)) {
        const error = new Error('Invalid request origin');
        error.statusCode = 403;
        error.code = 'CSRF_INVALID_ORIGIN';
        
        if (onError) {
          return onError(error, req, res, next);
        }
        
        return res.status(403).json({
          error: '不正なリクエスト元です',
          code: 'CSRF_INVALID_ORIGIN'
        });
      }
      
      // Verify CSRF token
      if (!this.verifyToken(req)) {
        const error = new Error('Invalid CSRF token');
        error.statusCode = 403;
        error.code = 'CSRF_TOKEN_INVALID';
        
        // Log security event
        console.warn('CSRF token validation failed:', {
          ip: req.ip,
          method: req.method,
          path: req.path,
          userAgent: req.get('User-Agent'),
          origin: req.get('Origin') || req.get('Referer')
        });
        
        if (onError) {
          return onError(error, req, res, next);
        }
        
        return res.status(403).json({
          error: 'CSRFトークンが無効です',
          code: 'CSRF_TOKEN_INVALID'
        });
      }
      
      next();
    };
  },

  /**
   * Middleware to provide CSRF token to views
   * @returns {Function} - Express middleware
   */
  provideToken() {
    return (req, res, next) => {
      // Generate token if not exists
      if (!req.csrfToken) {
        req.csrfToken = () => this.generateToken(req);
      }
      
      // Make token available to templates
      res.locals.csrfToken = req.csrfToken();
      
      next();
    };
  },

  /**
   * Generate HTML form field for CSRF token
   * @param {string} token - CSRF token
   * @returns {string} - HTML input field
   */
  generateFormField(token) {
    return `<input type="hidden" name="${CSRF_CONFIG.FORM_FIELD_NAME}" value="${token}">`;
  },

  /**
   * Generate meta tag for CSRF token (for AJAX requests)
   * @param {string} token - CSRF token
   * @returns {string} - HTML meta tag
   */
  generateMetaTag(token) {
    return `<meta name="csrf-token" content="${token}">`;
  },

  /**
   * Get CSRF protection statistics
   * @returns {object} - CSRF statistics
   */
  getStats() {
    return {
      config: {
        tokenLength: CSRF_CONFIG.TOKEN_LENGTH,
        tokenLifetime: CSRF_CONFIG.TOKEN_LIFETIME,
        maxTokensPerSession: CSRF_CONFIG.MAX_TOKENS_PER_SESSION
      },
      store: tokenStore.getStats()
    };
  },

  /**
   * Invalidate all tokens for a session (logout scenario)
   * @param {string} sessionId - Session ID
   */
  invalidateSession(sessionId) {
    tokenStore.tokens.delete(sessionId);
  },

  /**
   * Double-submit cookie helper for API responses
   * @param {object} res - Express response object
   * @param {string} token - CSRF token
   */
  setCsrfCookie(res, token) {
    res.cookie(CSRF_CONFIG.COOKIE_NAME, token, CSRF_CONFIG.COOKIE_OPTIONS);
  },

  /**
   * Clear CSRF cookie (logout scenario)
   * @param {object} res - Express response object
   */
  clearCsrfCookie(res) {
    res.clearCookie(CSRF_CONFIG.COOKIE_NAME);
  }
};

// Export both the main object and individual methods for convenience
module.exports = CSRFProtection;
module.exports.middleware = CSRFProtection.createMiddleware.bind(CSRFProtection);
module.exports.generateToken = CSRFProtection.generateToken.bind(CSRFProtection);
module.exports.verifyToken = CSRFProtection.verifyToken.bind(CSRFProtection);
