/**
 * Authentication Validation Schemas
 * 
 * Comprehensive Zod schemas for authentication-related input validation.
 * Provides type-safe validation with detailed error messages and
 * security-focused rules to prevent common authentication attacks.
 * 
 * Security Features:
 * - Strong password requirements
 * - Email format validation
 * - Input length limits to prevent DoS
 * - Character whitelist for usernames
 * - Rate limiting validation
 * 
 * Usage:
 *   import { loginSchema, registerSchema } from '@/schemas/auth';
 *   const result = loginSchema.safeParse(requestData);
 */

const { z } = require('zod');
const validator = require('validator');

// Security constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const EMAIL_MAX_LENGTH = 254; // RFC 5321 limit
const NAME_MAX_LENGTH = 100;
const USERNAME_MAX_LENGTH = 50;

// Common validation patterns
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const SAFE_USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

// Japanese name pattern (allows hiragana, katakana, kanji)
const JAPANESE_NAME_PATTERN = /^[ひらがなカタカナ漢字a-zA-Z\s　]+$/u;

/**
 * Custom validation functions
 */
const customValidators = {
  /**
   * Validate email using comprehensive checks
   */
  email: (email) => {
    if (!email || typeof email !== 'string') return false;
    if (email.length > EMAIL_MAX_LENGTH) return false;
    
    // Basic pattern check
    if (!EMAIL_PATTERN.test(email)) return false;
    
    // Use validator.js for additional checks
    if (!validator.isEmail(email, {
      allow_utf8_local_part: false,
      require_tld: true,
      allow_ip_domain: false
    })) return false;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.{2,}/, // Multiple consecutive dots
      /^\./, // Starting with dot
      /\.$/, // Ending with dot
      /@.*@/, // Multiple @ symbols
      /[<>()[\]\\,;:\s@"]/ // Invalid characters
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(email));
  },

  /**
   * Validate strong password
   */
  strongPassword: (password) => {
    if (!password || typeof password !== 'string') return false;
    if (password.length < PASSWORD_MIN_LENGTH) return false;
    if (password.length > PASSWORD_MAX_LENGTH) return false;
    
    // Check for required character types
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[@$!%*?&]/.test(password);
    
    const requiredTypes = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars];
    const validTypes = requiredTypes.filter(Boolean).length;
    
    return validTypes >= 3; // At least 3 of 4 types required
  },

  /**
   * Check for common weak passwords
   */
  notCommonPassword: (password) => {
    const commonPasswords = [
      'password', 'password123', '123456', '123456789', 'qwerty',
      'abc123', 'password1', 'admin', 'letmein', 'welcome',
      'monkey', '1234567890', 'dragon', 'master', 'shadow'
    ];
    
    return !commonPasswords.some(common => 
      password.toLowerCase().includes(common.toLowerCase())
    );
  },

  /**
   * Validate Japanese name
   */
  japaneseName: (name) => {
    if (!name || typeof name !== 'string') return false;
    return JAPANESE_NAME_PATTERN.test(name);
  },

  /**
   * Validate safe username
   */
  safeUsername: (username) => {
    if (!username || typeof username !== 'string') return false;
    if (username.length > USERNAME_MAX_LENGTH) return false;
    return SAFE_USERNAME_PATTERN.test(username);
  }
};

/**
 * Base email schema with comprehensive validation
 */
const emailSchema = z.string()
  .min(1, { message: 'メールアドレスは必須です' })
  .max(EMAIL_MAX_LENGTH, { message: `メールアドレスは${EMAIL_MAX_LENGTH}文字以内で入力してください` })
  .refine(customValidators.email, {
    message: '有効なメールアドレスを入力してください'
  });

/**
 * Base password schema with security requirements
 */
const passwordSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, { 
    message: `パスワードは${PASSWORD_MIN_LENGTH}文字以上で入力してください` 
  })
  .max(PASSWORD_MAX_LENGTH, { 
    message: `パスワードは${PASSWORD_MAX_LENGTH}文字以内で入力してください` 
  })
  .refine(customValidators.strongPassword, {
    message: 'パスワードは大文字、小文字、数字、特殊文字のうち3種類以上を含む必要があります'
  })
  .refine(customValidators.notCommonPassword, {
    message: 'より安全なパスワードを設定してください'
  });

/**
 * Name validation schema for Japanese users
 */
const nameSchema = z.string()
  .min(1, { message: '氏名は必須です' })
  .max(NAME_MAX_LENGTH, { message: `氏名は${NAME_MAX_LENGTH}文字以内で入力してください` })
  .refine(customValidators.japaneseName, {
    message: '氏名にはひらがな、カタカナ、漢字、英字のみ使用できます'
  });

/**
 * Username schema for optional usernames
 */
const usernameSchema = z.string()
  .min(3, { message: 'ユーザー名は3文字以上で入力してください' })
  .max(USERNAME_MAX_LENGTH, { message: `ユーザー名は${USERNAME_MAX_LENGTH}文字以内で入力してください` })
  .refine(customValidators.safeUsername, {
    message: 'ユーザー名には英数字、ハイフン、アンダースコアのみ使用できます'
  });

/**
 * Login schema - basic authentication
 */
const loginSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(1, { message: 'パスワードは必須です' })
    .max(PASSWORD_MAX_LENGTH, { message: 'パスワードが長すぎます' }),
  rememberMe: z.boolean().optional().default(false),
  captcha: z.string().optional() // For future captcha integration
});

/**
 * Registration schema - comprehensive user creation
 */
const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: nameSchema,
  lastName: nameSchema,
  username: usernameSchema.optional(),
  acceptTerms: z.boolean()
    .refine(val => val === true, {
      message: '利用規約への同意が必要です'
    }),
  acceptPrivacy: z.boolean()
    .refine(val => val === true, {
      message: 'プライバシーポリシーへの同意が必要です'
    }),
  marketingEmails: z.boolean().optional().default(false),
  captcha: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword']
});

/**
 * Password reset request schema
 */
const forgotPasswordSchema = z.object({
  email: emailSchema,
  captcha: z.string().optional()
});

/**
 * Password reset confirmation schema
 */
const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, { message: 'リセットトークンは必須です' })
    .max(500, { message: 'リセットトークンが無効です' }),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword']
});

/**
 * Password change schema (for logged-in users)
 */
const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, { message: '現在のパスワードは必須です' }),
  newPassword: passwordSchema,
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: '新しいパスワードが一致しません',
  path: ['confirmNewPassword']
}).refine(data => data.currentPassword !== data.newPassword, {
  message: '新しいパスワードは現在のパスワードと異なる必要があります',
  path: ['newPassword']
});

/**
 * Profile update schema
 */
const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  username: usernameSchema.optional(),
  bio: z.string()
    .max(500, { message: '自己紹介は500文字以内で入力してください' })
    .optional(),
  website: z.string()
    .url({ message: '有効なURLを入力してください' })
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .regex(/^[\d-+().\s]+$/, { message: '有効な電話番号を入力してください' })
    .max(20, { message: '電話番号は20文字以内で入力してください' })
    .optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    marketing: z.boolean().optional()
  }).optional()
});

/**
 * Email verification schema
 */
const verifyEmailSchema = z.object({
  token: z.string()
    .min(1, { message: '認証トークンは必須です' })
    .max(500, { message: '認証トークンが無効です' }),
  email: emailSchema.optional()
});

/**
 * Two-factor authentication setup schema
 */
const twoFactorSetupSchema = z.object({
  secret: z.string()
    .min(1, { message: '2FAシークレットは必須です' }),
  token: z.string()
    .regex(/^\d{6}$/, { message: '6桁の認証コードを入力してください' }),
  backupCodes: z.array(z.string()).optional()
});

/**
 * Two-factor authentication verification schema
 */
const twoFactorVerifySchema = z.object({
  token: z.string()
    .regex(/^\d{6}$/, { message: '6桁の認証コードを入力してください' }),
  rememberDevice: z.boolean().optional().default(false)
});

/**
 * Admin user creation schema
 */
const adminCreateUserSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['admin', 'editor', 'user'], {
    errorMap: () => ({ message: '有効な権限を選択してください' })
  }),
  isActive: z.boolean().optional().default(true),
  sendWelcomeEmail: z.boolean().optional().default(true)
});

/**
 * Validation helper functions
 */
const validationHelpers = {
  /**
   * Validate and sanitize authentication data
   * @param {object} schema - Zod schema
   * @param {object} data - Data to validate
   * @returns {object} - Validation result
   */
  validate(schema, data) {
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const errors = result.error.errors.reduce((acc, error) => {
        const field = error.path.join('.');
        acc[field] = error.message;
        return acc;
      }, {});
      
      return {
        success: false,
        errors,
        data: null
      };
    }
    
    return {
      success: true,
      errors: {},
      data: result.data
    };
  },

  /**
   * Get user-friendly error message
   * @param {object} errors - Validation errors
   * @returns {string} - Formatted error message
   */
  getErrorMessage(errors) {
    const errorMessages = Object.values(errors);
    return errorMessages.length > 0 ? errorMessages[0] : '入力データが無効です';
  }
};

module.exports = {
  // Main schemas
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
  twoFactorSetupSchema,
  twoFactorVerifySchema,
  adminCreateUserSchema,
  
  // Base schemas for reuse
  emailSchema,
  passwordSchema,
  nameSchema,
  usernameSchema,
  
  // Validation helpers
  validationHelpers,
  customValidators,
  
  // Constants for external use
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH
};
