/**
 * Login Rate Limiting Middleware
 * 
 * Specialized rate limiting for authentication endpoints to prevent
 * brute force attacks, credential stuffing, and account enumeration.
 * 
 * Security Features:
 * - Progressive delays for repeated failures
 * - Account-specific lockout tracking
 * - IP-based rate limiting
 * - Detailed security logging
 * - Captcha integration support
 * 
 * Usage:
 *   app.use('/api/auth/login', loginRateLimit);
 *   app.use('/api/auth/register', registerRateLimit);
 */

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { createRateLimitMiddleware, RATE_LIMITS, SLOW_DOWN_CONFIGS } = require('../config/rateLimits');

/**
 * Memory store for tracking login attempts by IP and username
 * In production, replace with Redis for scalability
 */
class LoginAttemptStore {
  constructor() {
    this.attempts = new Map(); // IP-based attempts
    this.userAttempts = new Map(); // Username-based attempts
    this.blockedIPs = new Map(); // Temporarily blocked IPs
    this.blockedUsers = new Map(); // Temporarily blocked usernames
    
    // Clean up old entries every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  /**
   * Record a login attempt
   * @param {string} ip - Client IP address
   * @param {string} username - Attempted username
   * @param {boolean} success - Whether login was successful
   */
  recordAttempt(ip, username, success) {
    const now = Date.now();
    
    // Record IP-based attempt
    if (!this.attempts.has(ip)) {
      this.attempts.set(ip, []);
    }
    this.attempts.get(ip).push({ timestamp: now, username, success });
    
    // Record username-based attempt
    if (username) {
      if (!this.userAttempts.has(username)) {
        this.userAttempts.set(username, []);
      }
      this.userAttempts.get(username).push({ timestamp: now, ip, success });
    }
    
    // Check if IP or user should be blocked
    this.updateBlockStatus(ip, username);
  }

  /**
   * Update block status for IP and username
   * @param {string} ip - Client IP address
   * @param {string} username - Username
   */
  updateBlockStatus(ip, username) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    
    // Check IP-based blocking
    const ipAttempts = this.attempts.get(ip) || [];
    const recentIpAttempts = ipAttempts.filter(attempt => 
      now - attempt.timestamp < windowMs && !attempt.success
    );
    
    if (recentIpAttempts.length >= 5) {
      this.blockedIPs.set(ip, now + windowMs); // Block for 15 minutes
    }
    
    // Check username-based blocking
    if (username) {
      const userAttempts = this.userAttempts.get(username) || [];
      const recentUserAttempts = userAttempts.filter(attempt => 
        now - attempt.timestamp < windowMs && !attempt.success
      );
      
      if (recentUserAttempts.length >= 3) {
        this.blockedUsers.set(username, now + (30 * 60 * 1000)); // Block for 30 minutes
      }
    }
  }

  /**
   * Check if IP is currently blocked
   * @param {string} ip - Client IP address
   * @returns {boolean}
   */
  isIPBlocked(ip) {
    const blockUntil = this.blockedIPs.get(ip);
    if (blockUntil && Date.now() < blockUntil) {
      return true;
    }
    if (blockUntil) {
      this.blockedIPs.delete(ip); // Clean up expired block
    }
    return false;
  }

  /**
   * Check if username is currently blocked
   * @param {string} username - Username
   * @returns {boolean}
   */
  isUserBlocked(username) {
    const blockUntil = this.blockedUsers.get(username);
    if (blockUntil && Date.now() < blockUntil) {
      return true;
    }
    if (blockUntil) {
      this.blockedUsers.delete(username); // Clean up expired block
    }
    return false;
  }

  /**
   * Get remaining attempts for IP
   * @param {string} ip - Client IP address
   * @returns {number}
   */
  getRemainingAttempts(ip) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const attempts = this.attempts.get(ip) || [];
    const recentFailures = attempts.filter(attempt => 
      now - attempt.timestamp < windowMs && !attempt.success
    ).length;
    
    return Math.max(0, 5 - recentFailures);
  }

  /**
   * Cleanup old entries
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    // Clean up attempts
    for (const [key, attempts] of this.attempts.entries()) {
      const validAttempts = attempts.filter(attempt => 
        now - attempt.timestamp < maxAge
      );
      if (validAttempts.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, validAttempts);
      }
    }
    
    // Clean up user attempts
    for (const [key, attempts] of this.userAttempts.entries()) {
      const validAttempts = attempts.filter(attempt => 
        now - attempt.timestamp < maxAge
      );
      if (validAttempts.length === 0) {
        this.userAttempts.delete(key);
      } else {
        this.userAttempts.set(key, validAttempts);
      }
    }
    
    // Clean up expired blocks
    for (const [ip, blockUntil] of this.blockedIPs.entries()) {
      if (now >= blockUntil) {
        this.blockedIPs.delete(ip);
      }
    }
    
    for (const [username, blockUntil] of this.blockedUsers.entries()) {
      if (now >= blockUntil) {
        this.blockedUsers.delete(username);
      }
    }
  }
}

// Global instance
const loginStore = new LoginAttemptStore();

/**
 * Extract client IP address considering proxies
 * @param {object} req - Express request object
 * @returns {string} - Client IP address
 */
function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
}

/**
 * Login attempt tracking middleware
 * Must be used after authentication attempt
 */
function trackLoginAttempt(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Parse response to determine if login was successful
    let success = false;
    try {
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      success = response && (response.success === true || response.token);
    } catch (e) {
      // If we can't parse response, assume failure for security
      success = false;
    }
    
    // Record the attempt
    const ip = getClientIP(req);
    const username = req.body?.email || req.body?.username;
    loginStore.recordAttempt(ip, username, success);
    
    // Log security event
    console.log(`Login attempt: IP=${ip}, Username=${username}, Success=${success}`);
    
    // Continue with original response
    originalSend.call(this, data);
  };
  
  next();
}

/**
 * Block check middleware - must run before authentication
 */
function checkLoginBlocks(req, res, next) {
  const ip = getClientIP(req);
  const username = req.body?.email || req.body?.username;
  
  // Check if IP is blocked
  if (loginStore.isIPBlocked(ip)) {
    return res.status(429).json({
      error: 'IPアドレスが一時的にブロックされています。後でもう一度お試しください。',
      code: 'IP_BLOCKED',
      retryAfter: 15 * 60, // 15 minutes
      details: 'セキュリティのため、複数回のログイン失敗によりIPアドレスがブロックされました。'
    });
  }
  
  // Check if username is blocked
  if (username && loginStore.isUserBlocked(username)) {
    return res.status(429).json({
      error: 'このアカウントは一時的にロックされています。30分後に再度お試しください。',
      code: 'ACCOUNT_LOCKED',
      retryAfter: 30 * 60, // 30 minutes
      details: 'セキュリティのため、複数回のログイン失敗によりアカウントが一時的にロックされました。'
    });
  }
  
  // Add remaining attempts to response headers
  const remainingAttempts = loginStore.getRemainingAttempts(ip);
  res.set('X-Login-Attempts-Remaining', remainingAttempts.toString());
  
  next();
}

/**
 * Progressive slowdown for authentication endpoints
 */
const authSlowDown = slowDown({
  windowMs: SLOW_DOWN_CONFIGS.AUTH_SLOWDOWN.windowMs,
  delayAfter: SLOW_DOWN_CONFIGS.AUTH_SLOWDOWN.delayAfter,
  delayMs: SLOW_DOWN_CONFIGS.AUTH_SLOWDOWN.delayMs,
  maxDelayMs: SLOW_DOWN_CONFIGS.AUTH_SLOWDOWN.maxDelayMs,
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  keyGenerator: getClientIP,
  onLimitReached: (req, res, options) => {
    console.warn(`Auth slowdown triggered for IP: ${getClientIP(req)}`);
  }
});

/**
 * Strict rate limiting for login endpoints
 */
const loginRateLimit = rateLimit({
  ...RATE_LIMITS.AUTH_STRICT,
  keyGenerator: getClientIP,
  handler: (req, res) => {
    const ip = getClientIP(req);
    console.warn(`Login rate limit exceeded for IP: ${ip}`);
    
    res.status(429).json(RATE_LIMITS.AUTH_STRICT.message);
  }
});

/**
 * Rate limiting for password recovery endpoints
 */
const passwordRecoveryRateLimit = rateLimit({
  ...RATE_LIMITS.PASSWORD_RECOVERY,
  keyGenerator: getClientIP,
  handler: (req, res) => {
    const ip = getClientIP(req);
    console.warn(`Password recovery rate limit exceeded for IP: ${ip}`);
    
    res.status(429).json(RATE_LIMITS.PASSWORD_RECOVERY.message);
  }
});

/**
 * Combined login protection middleware
 * Applies all security measures in correct order
 */
const loginProtection = [
  authSlowDown,           // Progressive delay
  loginRateLimit,         // Rate limiting
  checkLoginBlocks,       // Custom blocking logic
  trackLoginAttempt       // Track attempts (use after auth logic)
];

/**
 * Registration protection (less strict than login)
 */
const registrationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 registrations per IP per 15 minutes
  keyGenerator: getClientIP,
  message: {
    error: '登録試行回数が制限を超えました。15分後に再度お試しください。',
    code: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
    retryAfter: 15 * 60
  },
  handler: (req, res) => {
    const ip = getClientIP(req);
    console.warn(`Registration rate limit exceeded for IP: ${ip}`);
    
    res.status(429).json({
      error: '登録試行回数が制限を超えました。15分後に再度お試しください。',
      code: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
      retryAfter: 15 * 60
    });
  }
});

/**
 * Get login statistics for monitoring
 * @returns {object} - Login attempt statistics
 */
function getLoginStats() {
  return {
    totalAttempts: Array.from(loginStore.attempts.values()).reduce((sum, attempts) => sum + attempts.length, 0),
    blockedIPs: loginStore.blockedIPs.size,
    blockedUsers: loginStore.blockedUsers.size,
    activeIPs: loginStore.attempts.size
  };
}

module.exports = {
  loginProtection,
  loginRateLimit,
  passwordRecoveryRateLimit,
  registrationRateLimit,
  trackLoginAttempt,
  checkLoginBlocks,
  authSlowDown,
  getClientIP,
  getLoginStats,
  
  // For testing and monitoring
  loginStore
};
