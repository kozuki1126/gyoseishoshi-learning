/**
 * Authentication Input Validation Schemas
 * 
 * Comprehensive validation schemas for all authentication-related inputs
 * using the validator library for security-focused validation rules.
 * Prevents injection attacks, ensures data integrity, and provides
 * detailed error messages in Japanese for better user experience.
 * 
 * Security Features:
 * - Email format validation with domain whitelist support
 * - Password strength requirements
 * - Username sanitization and validation
 * - XSS protection for all text inputs
 * - Rate limiting friendly error messages
 */

const validator = require('validator');
const xss = require('xss');

/**
 * Validation error class for structured error handling
 */
class ValidationError extends Error {
  constructor(message, field = null, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
    this.statusCode = 400;
  }
}

/**
 * Password strength validation configuration
 */
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional for user convenience
  forbiddenPatterns: [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /user/i,
    /test/i
  ]
};

/**
 * Email domain whitelist (optional - can be configured via environment)
 */
const ALLOWED_EMAIL_DOMAINS = process.env.ALLOWED_EMAIL_DOMAINS 
  ? process.env.ALLOWED_EMAIL_DOMAINS.split(',').map(d => d.trim())
  : null; // null = allow all domains

/**
 * XSS sanitization options
 */
const XSS_OPTIONS = {
  whiteList: {}, // No HTML tags allowed in auth fields
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe'],
  css: false
};

/**
 * Base validation functions
 */
const ValidationUtils = {
  /**
   * Sanitize and validate string input
   * @param {string} input - Input string
   * @param {object} options - Validation options
   * @returns {string} - Sanitized string
   */
  sanitizeString(input, options = {}) {
    if (typeof input !== 'string') {
      throw new ValidationError('入力は文字列である必要があります', options.field);
    }
    
    // XSS sanitization
    const sanitized = xss(input.trim(), XSS_OPTIONS);
    
    // Length validation
    if (options.minLength && sanitized.length < options.minLength) {
      throw new ValidationError(
        `${options.fieldName || 'この項目'}は${options.minLength}文字以上である必要があります`,
        options.field
      );
    }
    
    if (options.maxLength && sanitized.length > options.maxLength) {
      throw new ValidationError(
        `${options.fieldName || 'この項目'}は${options.maxLength}文字以下である必要があります`,
        options.field
      );
    }
    
    // Pattern validation
    if (options.pattern && !options.pattern.test(sanitized)) {
      throw new ValidationError(
        options.patternError || `${options.fieldName || 'この項目'}の形式が正しくありません`,
        options.field
      );
    }
    
    // Forbidden patterns
    if (options.forbiddenPatterns) {
      for (const pattern of options.forbiddenPatterns) {
        if (pattern.test(sanitized)) {
          throw new ValidationError(
            options.forbiddenError || `${options.fieldName || 'この項目'}に使用できない文字が含まれています`,
            options.field
          );
        }
      }
    }
    
    return sanitized;
  },

  /**
   * Validate email address
   * @param {string} email - Email address
   * @returns {string} - Normalized email
   */
  validateEmail(email) {
    const sanitized = this.sanitizeString(email, {
      field: 'email',
      fieldName: 'メールアドレス',
      maxLength: 254
    });
    
    // Email format validation
    if (!validator.isEmail(sanitized)) {
      throw new ValidationError('有効なメールアドレスを入力してください', 'email');
    }
    
    // Normalize email
    const normalized = validator.normalizeEmail(sanitized, {
      gmail_lowercase: true,
      gmail_remove_dots: false,
      outlookdotcom_lowercase: true,
      yahoo_lowercase: true
    });
    
    if (!normalized) {
      throw new ValidationError('メールアドレスの形式が正しくありません', 'email');
    }
    
    // Domain whitelist check
    if (ALLOWED_EMAIL_DOMAINS) {
      const domain = normalized.split('@')[1];
      if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
        throw new ValidationError(
          `許可されていないメールドメインです。許可ドメイン: ${ALLOWED_EMAIL_DOMAINS.join(', ')}`,
          'email'
        );
      }
    }
    
    return normalized;
  },

  /**
   * Validate password strength
   * @param {string} password - Password
   * @returns {string} - Validated password
   */
  validatePassword(password) {
    if (typeof password !== 'string') {
      throw new ValidationError('パスワードは文字列である必要があります', 'password');
    }
    
    // Length validation
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      throw new ValidationError(
        `パスワードは${PASSWORD_REQUIREMENTS.minLength}文字以上である必要があります`,
        'password'
      );
    }
    
    if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
      throw new ValidationError(
        `パスワードは${PASSWORD_REQUIREMENTS.maxLength}文字以下である必要があります`,
        'password'
      );
    }
    
    // Character requirements
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      throw new ValidationError('パスワードには大文字を含める必要があります', 'password');
    }
    
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      throw new ValidationError('パスワードには小文字を含める必要があります', 'password');
    }
    
    if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
      throw new ValidationError('パスワードには数字を含める必要があります', 'password');
    }
    
    if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      throw new ValidationError('パスワードには特殊文字を含める必要があります', 'password');
    }
    
    // Forbidden patterns
    for (const pattern of PASSWORD_REQUIREMENTS.forbiddenPatterns) {
      if (pattern.test(password)) {
        throw new ValidationError('パスワードに使用できない文字列が含まれています', 'password');
      }
    }
    
    return password;
  },

  /**
   * Validate username
   * @param {string} username - Username
   * @returns {string} - Sanitized username
   */
  validateUsername(username) {
    return this.sanitizeString(username, {
      field: 'username',
      fieldName: 'ユーザー名',
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_-]+$/,
      patternError: 'ユーザー名は英数字、アンダースコア、ハイフンのみ使用できます',
      forbiddenPatterns: [
        /^admin$/i,
        /^root$/i,
        /^system$/i,
        /^test$/i,
        /^user$/i
      ],
      forbiddenError: 'このユーザー名は使用できません'
    });
  },

  /**
   * Validate name (display name)
   * @param {string} name - Display name
   * @returns {string} - Sanitized name
   */
  validateName(name) {
    return this.sanitizeString(name, {
      field: 'name',
      fieldName: '名前',
      minLength: 1,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s_-]+$/,
      patternError: '名前には日本語、英数字、スペース、アンダースコア、ハイフンのみ使用できます'
    });
  }
};

/**
 * Authentication schema validators
 */
const AuthSchemas = {
  /**
   * Login validation schema
   * @param {object} data - Login data
   * @returns {object} - Validated data
   */
  login(data) {
    const errors = [];
    const validated = {};
    
    try {
      validated.email = ValidationUtils.validateEmail(data.email);
    } catch (error) {
      errors.push(error);
    }
    
    try {
      // For login, we don't validate password strength (user might have old password)
      if (!data.password || typeof data.password !== 'string' || data.password.length === 0) {
        throw new ValidationError('パスワードを入力してください', 'password');
      }
      validated.password = data.password;
    } catch (error) {
      errors.push(error);
    }
    
    // Remember me flag (optional)
    if (data.rememberMe !== undefined) {
      validated.rememberMe = Boolean(data.rememberMe);
    }
    
    if (errors.length > 0) {
      const combinedError = new ValidationError('入力値にエラーがあります');
      combinedError.errors = errors;
      throw combinedError;
    }
    
    return validated;
  },

  /**
   * Registration validation schema
   * @param {object} data - Registration data
   * @returns {object} - Validated data
   */
  register(data) {
    const errors = [];
    const validated = {};
    
    try {
      validated.email = ValidationUtils.validateEmail(data.email);
    } catch (error) {
      errors.push(error);
    }
    
    try {
      validated.password = ValidationUtils.validatePassword(data.password);
    } catch (error) {
      errors.push(error);
    }
    
    // Password confirmation
    try {
      if (data.password !== data.confirmPassword) {
        throw new ValidationError('パスワードが一致しません', 'confirmPassword');
      }
    } catch (error) {
      errors.push(error);
    }
    
    // Optional username
    if (data.username) {
      try {
        validated.username = ValidationUtils.validateUsername(data.username);
      } catch (error) {
        errors.push(error);
      }
    }
    
    // Optional display name
    if (data.name) {
      try {
        validated.name = ValidationUtils.validateName(data.name);
      } catch (error) {
        errors.push(error);
      }
    }
    
    // Terms acceptance (required)
    if (!data.acceptTerms) {
      errors.push(new ValidationError('利用規約に同意していただく必要があります', 'acceptTerms'));
    }
    validated.acceptTerms = Boolean(data.acceptTerms);
    
    if (errors.length > 0) {
      const combinedError = new ValidationError('入力値にエラーがあります');
      combinedError.errors = errors;
      throw combinedError;
    }
    
    return validated;
  },

  /**
   * Password reset request validation
   * @param {object} data - Reset request data
   * @returns {object} - Validated data
   */
  passwordResetRequest(data) {
    const validated = {};
    
    try {
      validated.email = ValidationUtils.validateEmail(data.email);
    } catch (error) {
      throw error;
    }
    
    return validated;
  },

  /**
   * Password reset validation
   * @param {object} data - Reset data
   * @returns {object} - Validated data
   */
  passwordReset(data) {
    const errors = [];
    const validated = {};
    
    // Reset token validation
    try {
      if (!data.token || typeof data.token !== 'string' || data.token.length < 32) {
        throw new ValidationError('無効なリセットトークンです', 'token');
      }
      validated.token = data.token.trim();
    } catch (error) {
      errors.push(error);
    }
    
    try {
      validated.password = ValidationUtils.validatePassword(data.password);
    } catch (error) {
      errors.push(error);
    }
    
    // Password confirmation
    try {
      if (data.password !== data.confirmPassword) {
        throw new ValidationError('パスワードが一致しません', 'confirmPassword');
      }
    } catch (error) {
      errors.push(error);
    }
    
    if (errors.length > 0) {
      const combinedError = new ValidationError('入力値にエラーがあります');
      combinedError.errors = errors;
      throw combinedError;
    }
    
    return validated;
  },

  /**
   * Password change validation (for authenticated users)
   * @param {object} data - Password change data
   * @returns {object} - Validated data
   */
  passwordChange(data) {
    const errors = [];
    const validated = {};
    
    // Current password
    try {
      if (!data.currentPassword || typeof data.currentPassword !== 'string') {
        throw new ValidationError('現在のパスワードを入力してください', 'currentPassword');
      }
      validated.currentPassword = data.currentPassword;
    } catch (error) {
      errors.push(error);
    }
    
    try {
      validated.newPassword = ValidationUtils.validatePassword(data.newPassword);
    } catch (error) {
      errors.push(error);
    }
    
    // Password confirmation
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new ValidationError('新しいパスワードが一致しません', 'confirmPassword');
      }
    } catch (error) {
      errors.push(error);
    }
    
    // Ensure new password is different
    try {
      if (data.currentPassword === data.newPassword) {
        throw new ValidationError('新しいパスワードは現在のパスワードと異なる必要があります', 'newPassword');
      }
    } catch (error) {
      errors.push(error);
    }
    
    if (errors.length > 0) {
      const combinedError = new ValidationError('入力値にエラーがあります');
      combinedError.errors = errors;
      throw combinedError;
    }
    
    return validated;
  }
};

module.exports = {
  AuthSchemas,
  ValidationUtils,
  ValidationError,
  PASSWORD_REQUIREMENTS,
  XSS_OPTIONS
};
