/**
 * XSS Protection Utilities
 * 
 * Comprehensive XSS (Cross-Site Scripting) protection utilities
 * for the 行政書士 learning platform. Provides multiple layers
 * of protection against various XSS attack vectors.
 * 
 * Security Features:
 * - HTML sanitization with DOMPurify
 * - Content Security Policy helpers
 * - Input validation and filtering
 * - Context-aware output encoding
 * - Japanese text-specific protections
 * - Rich text editor safety
 * 
 * Usage:
 *   import { sanitizeHTML, validateInput } from '@/utils/xssProtection';
 *   const safeHTML = sanitizeHTML(userInput);
 */

const xss = require('xss');
const validator = require('validator');

// Custom XSS filter options for educational content
const XSS_OPTIONS = {
  // Allowed HTML tags for educational content
  whiteList: {
    // Text formatting
    'p': ['class', 'style'],
    'br': [],
    'strong': ['class'],
    'b': ['class'],
    'em': ['class'],
    'i': ['class'],
    'u': ['class'],
    'span': ['class', 'style'],
    'div': ['class', 'style'],
    
    // Headings
    'h1': ['class', 'style'],
    'h2': ['class', 'style'], 
    'h3': ['class', 'style'],
    'h4': ['class', 'style'],
    'h5': ['class', 'style'],
    'h6': ['class', 'style'],
    
    // Lists
    'ul': ['class', 'style'],
    'ol': ['class', 'style'],
    'li': ['class', 'style'],
    
    // Links (with restrictions)
    'a': ['href', 'title', 'class', 'target', 'rel'],
    
    // Images (with restrictions)
    'img': ['src', 'alt', 'title', 'width', 'height', 'class', 'style'],
    
    // Tables for legal content
    'table': ['class', 'style'],
    'thead': ['class'],
    'tbody': ['class'],
    'tr': ['class', 'style'],
    'td': ['class', 'style', 'colspan', 'rowspan'],
    'th': ['class', 'style', 'colspan', 'rowspan'],
    
    // Code blocks for legal citations
    'code': ['class'],
    'pre': ['class'],
    
    // Blockquotes for legal quotes
    'blockquote': ['class', 'style', 'cite'],
    
    // Horizontal rules
    'hr': ['class', 'style']
  },
  
  // Custom attribute filters
  onTagAttr: function (tag, name, value, isWhiteAttr) {
    // Allow only safe href values
    if (tag === 'a' && name === 'href') {
      // Only allow http(s) and relative URLs
      if (!/^(https?:\/\/|\/|#)/.test(value)) {
        return name + '="#"';
      }
      // Prevent javascript: and data: URLs
      if (/^(javascript|data|vbscript):/i.test(value)) {
        return name + '="#"';
      }
    }
    
    // Restrict image sources
    if (tag === 'img' && name === 'src') {
      // Only allow http(s) and relative URLs for images
      if (!/^(https?:\/\/|\/|data:image\/(png|jpe?g|gif|webp);base64,)/.test(value)) {
        return '';
      }
      // Check for data URL size limit (prevent DoS)
      if (value.startsWith('data:') && value.length > 100000) {
        return '';
      }
    }
    
    // Restrict inline styles
    if (name === 'style') {
      // Remove dangerous CSS properties
      const dangerousCSSProps = [
        'expression',
        'javascript',
        'vbscript',
        'behavior',
        'binding',
        '@import',
        'position\s*:\s*fixed',
        'position\s*:\s*absolute'
      ];
      
      const safeCSSValue = dangerousCSSProps.reduce((val, prop) => {
        const regex = new RegExp(prop, 'gi');
        return val.replace(regex, '');
      }, value);
      
      return name + '="' + safeCSSValue + '"';
    }
    
    // Set secure defaults for links
    if (tag === 'a' && name === 'target' && value === '_blank') {
      return name + '="_blank" rel="noopener noreferrer"';
    }
    
    return isWhiteAttr ? name + '="' + value + '"' : '';
  },
  
  // Strip dangerous tags completely
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'],
  
  // Custom CSS filter
  css: {
    whiteList: {
      'color': true,
      'background-color': true,
      'font-size': true,
      'font-weight': true,
      'font-family': true,
      'text-align': true,
      'text-decoration': true,
      'margin': true,
      'margin-top': true,
      'margin-bottom': true,
      'margin-left': true,
      'margin-right': true,
      'padding': true,
      'padding-top': true,
      'padding-bottom': true,
      'padding-left': true,
      'padding-right': true,
      'border': true,
      'border-width': true,
      'border-color': true,
      'border-style': true,
      'width': true,
      'height': true,
      'max-width': true,
      'max-height': true
    }
  }
};

// Stricter options for user comments and basic text
const STRICT_XSS_OPTIONS = {
  whiteList: {
    'p': [],
    'br': [],
    'strong': [],
    'b': [],
    'em': [],
    'i': [],
    'u': [],
    'span': [],
    'a': ['href', 'title'],
    'blockquote': []
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed']
};

/**
 * XSS Protection Class
 */
class XSSProtection {
  constructor() {
    this.customXSS = new xss.FilterXSS(XSS_OPTIONS);
    this.strictXSS = new xss.FilterXSS(STRICT_XSS_OPTIONS);
  }

  /**
   * Sanitize HTML content for educational materials
   * @param {string} html - HTML content to sanitize
   * @returns {string} - Sanitized HTML
   */
  sanitizeHTML(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }
    
    // Pre-process to handle Japanese content properly
    const preprocessed = this.preprocessContent(html);
    
    // Apply XSS filtering
    return this.customXSS.process(preprocessed);
  }

  /**
   * Strict sanitization for user comments and basic text
   * @param {string} html - HTML content to sanitize
   * @returns {string} - Sanitized HTML
   */
  sanitizeUserContent(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }
    
    const preprocessed = this.preprocessContent(html);
    return this.strictXSS.process(preprocessed);
  }

  /**
   * Sanitize plain text input
   * @param {string} text - Plain text to sanitize
   * @returns {string} - Sanitized text
   */
  sanitizeText(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    
    return validator.escape(text);
  }

  /**
   * Preprocess content to handle Japanese text and common issues
   * @param {string} content - Content to preprocess
   * @returns {string} - Preprocessed content
   */
  preprocessContent(content) {
    if (!content) return '';
    
    // Remove null bytes and control characters
    let cleaned = content.replace(/\x00/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Normalize Unicode characters (important for Japanese text)
    cleaned = cleaned.normalize('NFC');
    
    // Remove hidden Unicode characters that could be used for attacks
    const hiddenChars = [
      '\u200B', // Zero-width space
      '\u200C', // Zero-width non-joiner
      '\u200D', // Zero-width joiner
      '\u2060', // Word joiner
      '\uFEFF'  // Zero-width no-break space
    ];
    
    hiddenChars.forEach(char => {
      cleaned = cleaned.replace(new RegExp(char, 'g'), '');
    });
    
    // Remove suspicious comment patterns
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remove CDATA sections (can be used for XSS)
    cleaned = cleaned.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    
    return cleaned;
  }

  /**
   * Validate and sanitize URLs
   * @param {string} url - URL to validate
   * @returns {string|null} - Sanitized URL or null if invalid
   */
  sanitizeURL(url) {
    if (!url || typeof url !== 'string') {
      return null;
    }
    
    // Remove whitespace and control characters
    const cleanURL = url.trim().replace(/[\x00-\x20]/g, '');
    
    // Check for dangerous protocols
    const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
    if (dangerousProtocols.test(cleanURL)) {
      return null;
    }
    
    // Only allow http, https, and relative URLs
    if (!/^(https?:\/\/|\/|#|mailto:)/.test(cleanURL)) {
      return null;
    }
    
    // Validate URL format
    if (cleanURL.startsWith('http')) {
      try {
        new URL(cleanURL);
        return validator.escape(cleanURL);
      } catch {
        return null;
      }
    }
    
    return validator.escape(cleanURL);
  }

  /**
   * Sanitize filename for safe display
   * @param {string} filename - Filename to sanitize
   * @returns {string} - Sanitized filename
   */
  sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      return 'unnamed';
    }
    
    // Remove path traversal patterns
    let clean = filename.replace(/\.\.[/\\]/g, '');
    
    // Remove dangerous characters
    clean = clean.replace(/[<>:"|?*\x00-\x1f]/g, '');
    
    // Escape HTML entities
    clean = validator.escape(clean);
    
    // Limit length
    return clean.substring(0, 100);
  }

  /**
   * Sanitize search query
   * @param {string} query - Search query to sanitize
   * @returns {string} - Sanitized query
   */
  sanitizeSearchQuery(query) {
    if (!query || typeof query !== 'string') {
      return '';
    }
    
    // Remove HTML tags completely from search
    let clean = query.replace(/<[^>]*>/g, '');
    
    // Remove script-like patterns
    clean = clean.replace(/(javascript|vbscript|on\w+\s*=)/gi, '');
    
    // Normalize whitespace
    clean = clean.replace(/\s+/g, ' ').trim();
    
    // Limit length
    return clean.substring(0, 500);
  }

  /**
   * Context-aware output encoding
   * @param {string} value - Value to encode
   * @param {string} context - Output context (html, attribute, js, css, url)
   * @returns {string} - Encoded value
   */
  encodeForContext(value, context = 'html') {
    if (!value || typeof value !== 'string') {
      return '';
    }
    
    switch (context) {
      case 'html':
        return validator.escape(value);
        
      case 'attribute':
        return validator.escape(value).replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
        
      case 'js':
        return value.replace(/\\/g, '\\\\')
                   .replace(/'/g, "\\'")
                   .replace(/"/g, '\\"')
                   .replace(/\n/g, '\\n')
                   .replace(/\r/g, '\\r')
                   .replace(/\u2028/g, '\\u2028')
                   .replace(/\u2029/g, '\\u2029')
                   .replace(/</g, '\\u003c')
                   .replace(/>/g, '\\u003e');
        
      case 'css':
        return value.replace(/[<>"'&]/g, (match) => {
          const codes = { '<': '\\003c', '>': '\\003e', '"': '\\0022', "'": '\\0027', '&': '\\0026' };
          return codes[match] || match;
        });
        
      case 'url':
        return encodeURIComponent(value);
        
      default:
        return validator.escape(value);
    }
  }

  /**
   * Generate Content Security Policy
   * @param {object} options - CSP options
   * @returns {string} - CSP header value
   */
  generateCSP(options = {}) {
    const defaults = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: true
    };
    
    const config = { ...defaults, ...options };
    
    const directives = Object.entries(config)
      .filter(([key, value]) => key !== 'upgradeInsecureRequests' && value)
      .map(([key, value]) => {
        const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${directive} ${Array.isArray(value) ? value.join(' ') : value}`;
      });
    
    if (config.upgradeInsecureRequests) {
      directives.push('upgrade-insecure-requests');
    }
    
    return directives.join('; ');
  }

  /**
   * Validate rich text content from editors
   * @param {string} content - Rich text content
   * @param {object} options - Validation options
   * @returns {object} - Validation result
   */
  validateRichText(content, options = {}) {
    const maxLength = options.maxLength || 50000;
    const allowedTags = options.allowedTags || Object.keys(XSS_OPTIONS.whiteList);
    
    if (!content || typeof content !== 'string') {
      return { valid: false, error: 'コンテンツが空です' };
    }
    
    if (content.length > maxLength) {
      return { valid: false, error: `コンテンツが長すぎます（最大${maxLength}文字）` };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^>]*>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /expression\s*\(/gi
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        return { valid: false, error: '危険なコンテンツが検出されました' };
      }
    }
    
    // Sanitize and return cleaned content
    const sanitized = this.sanitizeHTML(content);
    
    return {
      valid: true,
      sanitized,
      originalLength: content.length,
      sanitizedLength: sanitized.length
    };
  }
}

// Create singleton instance
const xssProtection = new XSSProtection();

/**
 * Convenience functions for common use cases
 */
const xssHelpers = {
  /**
   * Sanitize user input based on type
   */
  sanitizeInput(input, type = 'text') {
    switch (type) {
      case 'html':
        return xssProtection.sanitizeHTML(input);
      case 'user-content':
        return xssProtection.sanitizeUserContent(input);
      case 'text':
        return xssProtection.sanitizeText(input);
      case 'url':
        return xssProtection.sanitizeURL(input);
      case 'filename':
        return xssProtection.sanitizeFilename(input);
      case 'search':
        return xssProtection.sanitizeSearchQuery(input);
      default:
        return xssProtection.sanitizeText(input);
    }
  },

  /**
   * Batch sanitize multiple inputs
   */
  sanitizeBatch(inputs, types = {}) {
    const result = {};
    
    for (const [key, value] of Object.entries(inputs)) {
      const type = types[key] || 'text';
      result[key] = this.sanitizeInput(value, type);
    }
    
    return result;
  },

  /**
   * Check if content is safe
   */
  isSafe(content) {
    if (!content || typeof content !== 'string') return true;
    
    const dangerous = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /expression\s*\(/gi
    ];
    
    return !dangerous.some(pattern => pattern.test(content));
  }
};

module.exports = {
  // Main XSS protection instance
  xssProtection,
  
  // Convenience helpers
  xssHelpers,
  
  // Direct access to common functions
  sanitizeHTML: xssProtection.sanitizeHTML.bind(xssProtection),
  sanitizeText: xssProtection.sanitizeText.bind(xssProtection),
  sanitizeURL: xssProtection.sanitizeURL.bind(xssProtection),
  sanitizeFilename: xssProtection.sanitizeFilename.bind(xssProtection),
  encodeForContext: xssProtection.encodeForContext.bind(xssProtection),
  generateCSP: xssProtection.generateCSP.bind(xssProtection),
  validateRichText: xssProtection.validateRichText.bind(xssProtection),
  
  // Configuration
  XSS_OPTIONS,
  STRICT_XSS_OPTIONS
};
