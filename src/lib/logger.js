/**
 * Security Logger Module
 * 
 * Advanced logging system for security events, rate limiting,
 * and suspicious activities. Integrates with Winston for 
 * structured logging with daily rotation and monitoring.
 * 
 * Features:
 * - Structured JSON logging
 * - Daily log rotation
 * - Severity-based filtering
 * - Real-time alerting for critical events
 * - Production-ready monitoring integration
 * 
 * Usage:
 *   const logger = require('./lib/logger');
 *   logger.security('rate_limit_exceeded', { ip, endpoint });
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Custom log format for structured logging
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, event, ...metadata }) => {
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      service: service || 'gyoseishoshi-learning',
      event: event || 'general',
      message,
      ...metadata
    };
    
    return JSON.stringify(logEntry);
  })
);

/**
 * Console format for development
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, event, ...metadata }) => {
    const metaStr = Object.keys(metadata).length > 0 ? 
      `\n  ${JSON.stringify(metadata, null, 2)}` : '';
    return `${timestamp} ${level} [${event || 'general'}] ${message}${metaStr}`;
  })
);

/**
 * Security events daily rotation transport
 */
const securityTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'security-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'info',
  format: logFormat,
  auditFile: path.join(logsDir, 'security-audit.json')
});

/**
 * Error logs daily rotation transport
 */
const errorTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: logFormat,
  auditFile: path.join(logsDir, 'error-audit.json')
});

/**
 * General application logs
 */
const appTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '14d',
  level: 'info',
  format: logFormat,
  auditFile: path.join(logsDir, 'app-audit.json')
});

/**
 * Rate limiting specific logs
 */
const rateLimitTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'rate-limit-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '10m',
  maxFiles: '7d',
  level: 'info',
  format: logFormat,
  auditFile: path.join(logsDir, 'rate-limit-audit.json')
});

/**
 * Main logger instance
 */
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'gyoseishoshi-learning',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    securityTransport,
    errorTransport,
    appTransport,
    rateLimitTransport
  ],
  exitOnError: false
});

// Add console transport for development
if (isDevelopment) {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

// Add console transport for production errors
if (isProduction) {
  logger.add(new winston.transports.Console({
    format: logFormat,
    level: 'error'
  }));
}

/**
 * Security event types and their severity levels
 */
const SECURITY_EVENTS = {
  // Authentication events
  LOGIN_SUCCESS: { level: 'info', alert: false },
  LOGIN_FAILURE: { level: 'warn', alert: false },
  LOGIN_BLOCKED: { level: 'error', alert: true },
  ACCOUNT_LOCKED: { level: 'error', alert: true },
  PASSWORD_RESET_REQUEST: { level: 'info', alert: false },
  PASSWORD_RESET_SUCCESS: { level: 'info', alert: false },
  
  // Rate limiting events
  RATE_LIMIT_EXCEEDED: { level: 'warn', alert: false },
  RATE_LIMIT_BLOCKED: { level: 'error', alert: true },
  BURST_LIMIT_EXCEEDED: { level: 'error', alert: true },
  API_ABUSE_DETECTED: { level: 'error', alert: true },
  
  // File upload events
  UPLOAD_SUCCESS: { level: 'info', alert: false },
  UPLOAD_BLOCKED: { level: 'warn', alert: false },
  MALICIOUS_FILE_DETECTED: { level: 'error', alert: true },
  UPLOAD_SIZE_EXCEEDED: { level: 'warn', alert: false },
  
  // Admin events  
  ADMIN_LOGIN: { level: 'info', alert: true },
  ADMIN_ACTION: { level: 'info', alert: false },
  UNAUTHORIZED_ADMIN_ACCESS: { level: 'error', alert: true },
  
  // System events
  ENVIRONMENT_VALIDATION_FAILED: { level: 'error', alert: true },
  JWT_SECRET_WEAK: { level: 'error', alert: true },
  SYSTEM_ERROR: { level: 'error', alert: true }
};

/**
 * Alert thresholds for rate limiting
 */
const ALERT_THRESHOLDS = {
  RATE_LIMIT_HITS_PER_MINUTE: 100,
  UNIQUE_IPS_BLOCKED_PER_HOUR: 50,
  FAILED_LOGINS_PER_HOUR: 500,
  MALICIOUS_REQUESTS_PER_HOUR: 10
};

/**
 * Rate limiting statistics tracker
 */
class SecurityStatsTracker {
  constructor() {
    this.stats = {
      rateLimitHits: new Map(),
      blockedIPs: new Set(),
      failedLogins: new Map(),
      maliciousRequests: new Map()
    };
    
    // Clean up stats every hour
    setInterval(() => this.cleanupStats(), 60 * 60 * 1000);
  }
  
  recordEvent(eventType, data) {
    const now = Date.now();
    const hour = Math.floor(now / (60 * 60 * 1000));
    
    switch (eventType) {
      case 'RATE_LIMIT_EXCEEDED':
        this.incrementHourlyCount(this.stats.rateLimitHits, hour);
        break;
      case 'LOGIN_BLOCKED':
        this.stats.blockedIPs.add(data.ip);
        break;
      case 'LOGIN_FAILURE':
        this.incrementHourlyCount(this.stats.failedLogins, hour);
        break;
      case 'MALICIOUS_FILE_DETECTED':
        this.incrementHourlyCount(this.stats.maliciousRequests, hour);
        break;
    }
    
    this.checkAlertThresholds(eventType, hour);
  }
  
  incrementHourlyCount(map, hour) {
    map.set(hour, (map.get(hour) || 0) + 1);
  }
  
  checkAlertThresholds(eventType, hour) {
    const rateLimitHits = this.stats.rateLimitHits.get(hour) || 0;
    const failedLogins = this.stats.failedLogins.get(hour) || 0;
    const maliciousRequests = this.stats.maliciousRequests.get(hour) || 0;
    
    if (rateLimitHits > ALERT_THRESHOLDS.RATE_LIMIT_HITS_PER_MINUTE * 60) {
      this.triggerAlert('HIGH_RATE_LIMIT_ACTIVITY', { 
        count: rateLimitHits, 
        threshold: ALERT_THRESHOLDS.RATE_LIMIT_HITS_PER_MINUTE * 60 
      });
    }
    
    if (failedLogins > ALERT_THRESHOLDS.FAILED_LOGINS_PER_HOUR) {
      this.triggerAlert('HIGH_FAILED_LOGIN_ACTIVITY', { 
        count: failedLogins, 
        threshold: ALERT_THRESHOLDS.FAILED_LOGINS_PER_HOUR 
      });
    }
    
    if (maliciousRequests > ALERT_THRESHOLDS.MALICIOUS_REQUESTS_PER_HOUR) {
      this.triggerAlert('HIGH_MALICIOUS_ACTIVITY', { 
        count: maliciousRequests, 
        threshold: ALERT_THRESHOLDS.MALICIOUS_REQUESTS_PER_HOUR 
      });
    }
  }
  
  triggerAlert(alertType, data) {
    logger.error('Security Alert Triggered', {
      event: 'SECURITY_ALERT',
      alertType,
      ...data,
      timestamp: new Date().toISOString()
    });
    
    // In production, integrate with alerting service (e.g., Slack, email, PagerDuty)
    if (isProduction) {
      // this.sendToAlertingService(alertType, data);
    }
  }
  
  cleanupStats() {
    const now = Date.now();
    const cutoffHour = Math.floor(now / (60 * 60 * 1000)) - 24; // Keep last 24 hours
    
    for (const [hour] of this.stats.rateLimitHits) {
      if (hour < cutoffHour) {
        this.stats.rateLimitHits.delete(hour);
      }
    }
    
    for (const [hour] of this.stats.failedLogins) {
      if (hour < cutoffHour) {
        this.stats.failedLogins.delete(hour);
      }
    }
    
    for (const [hour] of this.stats.maliciousRequests) {
      if (hour < cutoffHour) {
        this.stats.maliciousRequests.delete(hour);
      }
    }
    
    // Clear blocked IPs set (it gets rebuilt as events occur)
    this.stats.blockedIPs.clear();
  }
  
  getStats() {
    return {
      rateLimitHits: Object.fromEntries(this.stats.rateLimitHits),
      blockedIPsCount: this.stats.blockedIPs.size,
      failedLogins: Object.fromEntries(this.stats.failedLogins),
      maliciousRequests: Object.fromEntries(this.stats.maliciousRequests)
    };
  }
}

const statsTracker = new SecurityStatsTracker();

/**
 * Enhanced security logging methods
 */
const securityLogger = {
  /**
   * Log security events with automatic alert detection
   * @param {string} eventType - Security event type
   * @param {object} data - Event data
   */
  security(eventType, data = {}) {
    const eventConfig = SECURITY_EVENTS[eventType];
    if (!eventConfig) {
      logger.warn('Unknown security event type', { eventType, data });
      return;
    }
    
    const logData = {
      event: eventType,
      level: eventConfig.level,
      ...data,
      timestamp: new Date().toISOString()
    };
    
    // Record in stats tracker
    statsTracker.recordEvent(eventType, data);
    
    // Log with appropriate level
    logger[eventConfig.level](`Security Event: ${eventType}`, logData);
    
    // Trigger alert if configured
    if (eventConfig.alert && isProduction) {
      logger.error(`ALERT: ${eventType}`, logData);
    }
  },
  
  /**
   * Log rate limiting events
   * @param {string} type - Rate limit type (exceeded, blocked, etc.)
   * @param {object} data - Rate limit data
   */
  rateLimit(type, data = {}) {
    const eventTypes = {
      exceeded: 'RATE_LIMIT_EXCEEDED',
      blocked: 'RATE_LIMIT_BLOCKED',
      burst: 'BURST_LIMIT_EXCEEDED'
    };
    
    const eventType = eventTypes[type] || 'RATE_LIMIT_EXCEEDED';
    this.security(eventType, data);
  },
  
  /**
   * Log authentication events
   * @param {string} type - Auth event type
   * @param {object} data - Auth data
   */
  auth(type, data = {}) {
    const eventTypes = {
      success: 'LOGIN_SUCCESS',
      failure: 'LOGIN_FAILURE',
      blocked: 'LOGIN_BLOCKED',
      locked: 'ACCOUNT_LOCKED'
    };
    
    const eventType = eventTypes[type] || 'LOGIN_FAILURE';
    this.security(eventType, data);
  },
  
  /**
   * Log file upload events
   * @param {string} type - Upload event type
   * @param {object} data - Upload data
   */
  upload(type, data = {}) {
    const eventTypes = {
      success: 'UPLOAD_SUCCESS',
      blocked: 'UPLOAD_BLOCKED',
      malicious: 'MALICIOUS_FILE_DETECTED',
      size_exceeded: 'UPLOAD_SIZE_EXCEEDED'
    };
    
    const eventType = eventTypes[type] || 'UPLOAD_BLOCKED';
    this.security(eventType, data);
  },
  
  /**
   * Get security statistics
   * @returns {object} - Security stats
   */
  getStats() {
    return statsTracker.getStats();
  }
};

// Extend main logger with security methods
Object.assign(logger, securityLogger);

// Handle uncaught exceptions and promise rejections
logger.exceptions.handle(
  new winston.transports.File({ 
    filename: path.join(logsDir, 'exceptions.log'),
    format: logFormat
  })
);

logger.rejections.handle(
  new winston.transports.File({ 
    filename: path.join(logsDir, 'rejections.log'),
    format: logFormat
  })
);

// Graceful shutdown handling
process.on('SIGINT', () => {
  logger.info('Graceful shutdown initiated');
  logger.end();
});

process.on('SIGTERM', () => {
  logger.info('Graceful shutdown initiated (SIGTERM)');
  logger.end();
});

module.exports = logger;
