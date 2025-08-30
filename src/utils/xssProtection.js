/**
 * XSS Protection Utility Functions
 * 
 * Comprehensive Cross-Site Scripting (XSS) protection utilities that provide
 * multiple layers of defense against various XSS attack vectors including
 * stored, reflected, and DOM-based XSS attacks.
 * 
 * Security Features:
 * - HTML sanitization with customizable whitelists
 * - CSS injection prevention
 * - JavaScript event handler removal
 * - URL validation and sanitization
 * - Content Security Policy helpers
 * - Input validation and output encoding
 * 
 * Usage:
 *   const { sanitizeHtml, validateUrl, encodeOutput } = require('./xssProtection');
 *   const safeContent = sanitizeHtml(userInput, 'strict');
 */

const xss = require('xss');
const validator = require('validator');

/**
 * XSS protection configuration profiles
 */
const XSS_PROFILES = {
  // Ultra-strict: No HTML allowed (for usernames, titles, etc.)
  strict: {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'applet'],
    allowCommentTag: false,
    css: false
  },
  
  // Basic: Allow minimal formatting (for comments, descriptions)
  basic: {
    whiteList: {
      'p': [],
      'br': [],
      'strong': [],
      'b': [],
      'em': [],
      'i': [],
      'u': [],
      'span': ['class']
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'applet'],
    allowCommentTag: false,
    css: false
  },
  
  // Educational: Allow educational content formatting
  educational: {
    whiteList: {
      'p': [],
      'br': [],
      'div': ['class'],
      'span': ['class'],
      'h1': [], 'h2': [], 'h3': [], 'h4': [], 'h5': [], 'h6': [],
      'ul': [], 'ol': [], 'li': [],
      'strong': [], 'b': [], 'em': [], 'i': [], 'u': [],
      'code': ['class'],
      'pre': ['class'],
      'blockquote': [],
      'a': ['href', 'title', 'target', 'rel'],
      'table': [], 'thead': [], 'tbody': [], 'tr': [], 'td': [], 'th': [],
      'mark': [],
      'del': [], 's': [],
      'ins': [],
      'sup': [], 'sub': []
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'applet', 'form', 'input', 'button'],
    allowCommentTag: false,
    css: {
      // Allow only safe CSS properties
      whiteList: {
        'color': true,
        'background-color': true,
        'font-weight': true,
        'font-style': true,
        'text-decoration': true,
        'text-align': true
      }
    },
    onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
      // Allow data-* attributes for educational content
      if (name.substr(0, 5) === 'data-') {
        return name + '="' + xss.escapeAttrValue(value) + '"';
      }
      return '';
    },
    onTag: function (tag, html, options) {
      // Additional validation for links
      if (tag === 'a') {
        const hrefMatch = html.match(/href="([^"]+)"/);
        if (hrefMatch) {
          const url = hrefMatch[1];
          // Only allow safe protocols
          if (!url.match(/^(https?:\/\/|\/|#|mailto:)/)) {
            return ''; // Remove unsafe links
          }
        }
      }
      return html;
    }
  }
};

/**
 * Common XSS attack patterns for detection
 */
const XSS_ATTACK_PATTERNS = [
  // Script tags and variations
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<script[\s\S]*?>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /data:application\/javascript/gi,
  
  // Event handlers
  /\bon\w+\s*=/gi,
  /onclick/gi,
  /onload/gi,
  /onerror/gi,
  /onmouseover/gi,
  /onfocus/gi,
  /onblur/gi,
  
  // Expression and evaluation
  /expression\s*\(/gi,
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /setTimeout/gi,
  /setInterval/gi,
  
  // Style injection
  /style\s*=.*expression/gi,
  /style\s*=.*javascript/gi,
  /style\s*=.*vbscript/gi,
  
  // Meta refresh
  /<meta[\s\S]*?http-equiv[\s\S]*?refresh/gi,
  
  // Object and embed tags
  /<(object|embed|applet|iframe)[\s\S]*?>/gi,
  
  // Form injection
  /<form[\s\S]*?>/gi,
  /<input[\s\S]*?>/gi,
  
  // Import and link injection
  /@import/gi,
  /link[\s\S]*?href/gi
];

/**
 * URL validation patterns
 */
const SAFE_URL_PATTERNS = {
  // Allow only safe protocols
  SAFE_PROTOCOLS: /^(https?:\/\/|\/|#|mailto:)/,
  
  // Block dangerous protocols
  DANGEROUS_PROTOCOLS: /^(javascript:|vbscript:|data:|file:|ftp:)/i,
  
  // Common XSS in URLs
  URL_XSS_PATTERNS: [
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /data:application\/javascript/gi,
    /%3cscript/gi,
    /%3c%2fscript/gi,
    /&lt;script/gi,
    /&lt;/script/gi
  ]
};

/**
 * XSS Protection utility functions
 */
const XSSProtection = {
  /**
   * Sanitize HTML content based on protection profile
   * @param {string} input - Raw HTML input
   * @param {string} profile - Protection profile (strict, basic, educational)
   * @param {object} customOptions - Custom XSS options to override profile
   * @returns {string} - Sanitized HTML
   */
  sanitizeHtml(input, profile = 'basic', customOptions = {}) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    const options = XSS_PROFILES[profile];
    if (!options) {
      throw new Error(`Unknown XSS protection profile: ${profile}`);
    }
    
    // Merge custom options
    const finalOptions = { ...options, ...customOptions };
    
    // Pre-processing: normalize input
    let processed = input
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\r\n/g, '\n') // Normalize line endings
      .trim();
    
    // Apply XSS filtering
    const sanitized = xss(processed, finalOptions);
    
    // Post-processing validation
    this.validateSanitizedContent(sanitized);
    
    return sanitized;
  },

  /**
   * Validate that sanitized content doesn't contain XSS patterns
   * @param {string} content - Sanitized content
   * @throws {Error} - If malicious patterns detected
   */
  validateSanitizedContent(content) {
    // Double-check that no obvious XSS patterns remain
    for (const pattern of XSS_ATTACK_PATTERNS.slice(0, 5)) { // Check most dangerous patterns
      if (pattern.test(content)) {
        throw new Error('コンテンツに危険な要素が残っています');
      }
    }
  },

  /**
   * Detect potential XSS attacks in input
   * @param {string} input - Raw input
   * @returns {Array} - Array of detected attack patterns
   */
  detectXSSAttempts(input) {
    if (!input || typeof input !== 'string') {
      return [];
    }
    
    const detectedPatterns = [];
    
    XSS_ATTACK_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(input)) {
        detectedPatterns.push({
          pattern: pattern.toString(),
          index,
          type: this.getPatternType(index)
        });
      }
    });
    
    return detectedPatterns;
  },

  /**
   * Get pattern type based on index
   * @param {number} index - Pattern index
   * @returns {string} - Pattern type description
   */
  getPatternType(index) {
    if (index <= 5) return 'script injection';
    if (index <= 12) return 'event handler injection';
    if (index <= 17) return 'expression evaluation';
    if (index <= 20) return 'style injection';
    if (index <= 22) return 'meta refresh';
    if (index <= 24) return 'object/embed injection';
    if (index <= 26) return 'form injection';
    return 'import/link injection';
  },

  /**
   * Validate and sanitize URLs
   * @param {string} url - URL to validate
   * @param {boolean} allowRelative - Allow relative URLs
   * @returns {string|null} - Sanitized URL or null if invalid
   */
  validateUrl(url, allowRelative = true) {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    // Trim and normalize
    url = url.trim();
    
    if (url.length === 0) {
      return null;
    }
    
    // Check for dangerous protocols first
    if (SAFE_URL_PATTERNS.DANGEROUS_PROTOCOLS.test(url)) {
      return null;
    }
    
    // Check for URL-based XSS
    for (const pattern of SAFE_URL_PATTERNS.URL_XSS_PATTERNS) {
      if (pattern.test(url)) {
        return null;
      }
    }
    
    // Validate with validator library
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (!validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false
      })) {
        return null;
      }
    } else if (url.startsWith('mailto:')) {
      const email = url.substring(7);
      if (!validator.isEmail(email)) {
        return null;
      }
    } else if (allowRelative && (url.startsWith('/') || url.startsWith('#'))) {
      // Relative URLs - basic validation
      if (url.includes('..') || url.includes('//')) {
        return null; // Prevent path traversal
      }
    } else {
      return null; // Reject unrecognized URL format
    }
    
    return url;
  },

  /**
   * Encode output for safe display in HTML
   * @param {string} input - Input to encode
   * @param {string} context - Context (html, attribute, javascript, css)
   * @returns {string} - Encoded output
   */
  encodeOutput(input, context = 'html') {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    switch (context) {
      case 'html':
        return input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
          
      case 'attribute':
        return input
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
          
      case 'javascript':
        return input
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
          .replace(/\f/g, '\\f')
          .replace(/\v/g, '\\v')
          .replace(/\0/g, '\\0')
          .replace(/</g, '\\u003c')
          .replace(/>/g, '\\u003e');
          
      case 'css':
        return input.replace(/[<>"'&\\/]/g, '\\$&');
        
      default:
        throw new Error(`Unknown encoding context: ${context}`);
    }
  },

  /**
   * Generate Content Security Policy header value
   * @param {object} options - CSP configuration options
   * @returns {string} - CSP header value
   */
  generateCSP(options = {}) {
    const defaultCSP = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline in production
      'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'fonts.gstatic.com'],
      'connect-src': ["'self'"],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': []
    };
    
    const csp = { ...defaultCSP, ...options };
    
    return Object.entries(csp)
      .map(([directive, sources]) => {
        if (sources.length === 0) {
          return directive;
        }
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');
  },

  /**
   * Validate user input against XSS patterns
   * @param {string} input - User input
   * @param {string} fieldName - Field name for error messages
   * @returns {object} - Validation result
   */
  validateInput(input, fieldName = '入力') {
    const result = {
      isValid: true,
      sanitized: '',
      errors: [],
      warnings: []
    };
    
    if (!input || typeof input !== 'string') {
      result.errors.push(`${fieldName}は文字列である必要があります`);
      result.isValid = false;
      return result;
    }
    
    // Detect XSS attempts
    const xssAttempts = this.detectXSSAttempts(input);
    
    if (xssAttempts.length > 0) {
      result.isValid = false;
      result.errors.push(`${fieldName}に不正なコンテンツが含まれています`);
      
      // Log security event (in real implementation, use proper logger)
      console.warn('XSS attempt detected:', {
        field: fieldName,
        patterns: xssAttempts.map(a => a.type),
        input: input.substring(0, 100) + '...' // Log only first 100 chars
      });
      
      return result;
    }
    
    // Sanitize with basic profile
    try {
      result.sanitized = this.sanitizeHtml(input, 'basic');
      
      // Check if sanitization removed content
      if (result.sanitized.length < input.length * 0.8) {
        result.warnings.push(`${fieldName}の一部のコンテンツが安全性のため削除されました`);
      }
      
    } catch (error) {
      result.isValid = false;
      result.errors.push(`${fieldName}の処理中にエラーが発生しました`);
    }
    
    return result;
  },

  /**
   * Create middleware for automatic XSS protection
   * @param {object} options - Middleware options
   * @returns {Function} - Express middleware function
   */
  createMiddleware(options = {}) {
    return (req, res, next) => {
      const { profile = 'basic', fields = [] } = options;
      
      // Sanitize specified fields in request body
      if (req.body && typeof req.body === 'object') {
        for (const field of fields) {
          if (req.body[field] && typeof req.body[field] === 'string') {
            try {
              req.body[field] = this.sanitizeHtml(req.body[field], profile);
            } catch (error) {
              return res.status(400).json({
                error: `入力フィールド '${field}' に不正なコンテンツが含まれています`,
                code: 'XSS_PROTECTION_ERROR'
              });
            }
          }
        }
      }
      
      // Add CSP header
      const csp = this.generateCSP(options.csp);
      res.setHeader('Content-Security-Policy', csp);
      
      next();
    };
  }
};

module.exports = XSSProtection;
