/**
 * Content Input Validation Schemas
 * 
 * Validation schemas for educational content, including lessons, quizzes,
 * and user-generated content. Ensures content integrity and prevents
 * malicious content injection while maintaining educational quality.
 * 
 * Security Features:
 * - Markdown content validation and sanitization
 * - HTML tag whitelist for educational content
 * - File metadata validation
 * - Quiz and question format validation
 * - User comment and feedback sanitization
 */

const validator = require('validator');
const xss = require('xss');

/**
 * Content-specific XSS options (more permissive than auth)
 */
const CONTENT_XSS_OPTIONS = {
  whiteList: {
    // Text formatting
    'p': [],
    'br': [],
    'span': ['class'],
    'div': ['class'],
    
    // Headings
    'h1': [], 'h2': [], 'h3': [], 'h4': [], 'h5': [], 'h6': [],
    
    // Lists
    'ul': [], 'ol': [], 'li': [],
    
    // Text styling
    'strong': [], 'b': [], 'em': [], 'i': [], 'u': [],
    'code': ['class'], 'pre': ['class'],
    
    // Links (with restrictions)
    'a': ['href', 'title', 'target', 'rel'],
    
    // Tables
    'table': ['class'], 'thead': [], 'tbody': [], 'tr': [], 'td': [], 'th': [],
    
    // Blockquotes
    'blockquote': [],
    
    // Educational content
    'mark': [], // For highlighting
    'del': [], 's': [], // For corrections
    'ins': [], // For additions
    'sup': [], 'sub': [], // For mathematical content
    
    // Media (with strict validation)
    'img': ['src', 'alt', 'width', 'height', 'class'],
    'audio': ['controls', 'src'],
    'video': ['controls', 'width', 'height', 'src']
  },
  
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
  
  onIgnoreTagAttr: (tag, name, value) => {
    // Allow data attributes for educational content
    if (name.startsWith('data-')) {
      return `${name}="${xss.escapeAttrValue(value)}"`;
    }
    // Allow style for specific educational formatting
    if (name === 'style' && ['span', 'div', 'p'].includes(tag)) {
      // Basic style validation (color, font-weight, etc.)
      const allowedStyles = /^(color|font-weight|font-style|text-decoration|background-color):\s*[^;]+;?\s*$/;
      if (allowedStyles.test(value)) {
        return `style="${xss.escapeAttrValue(value)}"`;
      }
    }
    return '';
  },
  
  onTag: (tag, html, options) => {
    // Additional validation for links
    if (tag === 'a') {
      const hrefMatch = html.match(/href="([^"]+)"/);
      if (hrefMatch) {
        const url = hrefMatch[1];
        // Only allow http/https links and relative paths
        if (!url.match(/^(https?:\/\/|\/|#)/)) {
          return ''; // Remove unsafe links
        }
      }
    }
    return html;
  }
};

/**
 * File type validation configurations
 */
const ALLOWED_FILE_TYPES = {
  document: {
    extensions: ['.pdf', '.doc', '.docx'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  audio: {
    extensions: ['.mp3', '.wav', '.m4a', '.ogg'],
    mimeTypes: [
      'audio/mpeg',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/ogg'
    ],
    maxSize: 50 * 1024 * 1024 // 50MB
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
    maxSize: 5 * 1024 * 1024 // 5MB
  }
};

/**
 * Content validation utilities
 */
const ContentValidationUtils = {
  /**
   * Sanitize educational content with appropriate XSS filtering
   * @param {string} content - Raw content
   * @param {object} options - Validation options
   * @returns {string} - Sanitized content
   */
  sanitizeContent(content, options = {}) {
    if (typeof content !== 'string') {
      throw new Error('コンテンツは文字列である必要があります');
    }
    
    // Basic length validation
    if (options.maxLength && content.length > options.maxLength) {
      throw new Error(`コンテンツは${options.maxLength}文字以下である必要があります`);
    }
    
    if (options.minLength && content.trim().length < options.minLength) {
      throw new Error(`コンテンツは${options.minLength}文字以上である必要があります`);
    }
    
    // XSS sanitization with educational content support
    const sanitized = xss(content, CONTENT_XSS_OPTIONS);
    
    return sanitized;
  },

  /**
   * Validate markdown content
   * @param {string} markdown - Markdown content
   * @returns {string} - Validated markdown
   */
  validateMarkdown(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      throw new Error('マークダウンコンテンツが無効です');
    }
    
    // Check for potentially malicious markdown patterns
    const maliciousPatterns = [
      /javascript:/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
      /onclick=/gi
    ];
    
    for (const pattern of maliciousPatterns) {
      if (pattern.test(markdown)) {
        throw new Error('マークダウンに不正な内容が含まれています');
      }
    }
    
    return markdown.trim();
  },

  /**
   * Validate file metadata
   * @param {object} file - File object
   * @param {string} category - File category (document, audio, image)
   * @returns {object} - Validated file data
   */
  validateFile(file, category) {
    if (!file || !file.name || !file.size) {
      throw new Error('ファイル情報が不正です');
    }
    
    const config = ALLOWED_FILE_TYPES[category];
    if (!config) {
      throw new Error(`サポートされていないファイルカテゴリです: ${category}`);
    }
    
    // File size validation
    if (file.size > config.maxSize) {
      const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
      throw new Error(`ファイルサイズは${maxSizeMB}MB以下である必要があります`);
    }
    
    // File extension validation
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!config.extensions.includes(ext)) {
      throw new Error(`許可されていないファイル形式です。許可形式: ${config.extensions.join(', ')}`);
    }
    
    // MIME type validation
    if (file.type && !config.mimeTypes.includes(file.type)) {
      throw new Error(`許可されていないファイルタイプです`);
    }
    
    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF._-]/g, '');
    
    return {
      name: sanitizedName,
      size: file.size,
      type: file.type,
      category,
      extension: ext
    };
  },

  /**
   * Validate quiz question
   * @param {object} question - Question object
   * @returns {object} - Validated question
   */
  validateQuizQuestion(question) {
    const errors = [];
    const validated = {};
    
    // Question text
    try {
      validated.question = this.sanitizeContent(question.question, {
        minLength: 10,
        maxLength: 1000,
        fieldName: '問題文'
      });
    } catch (error) {
      errors.push(error.message);
    }
    
    // Question type
    const allowedTypes = ['multiple-choice', 'true-false', 'short-answer', 'essay'];
    if (!allowedTypes.includes(question.type)) {
      errors.push(`問題タイプが無効です。許可タイプ: ${allowedTypes.join(', ')}`);
    } else {
      validated.type = question.type;
    }
    
    // Options (for multiple choice)
    if (question.type === 'multiple-choice') {
      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        errors.push('選択肢は2つ以上必要です');
      } else {
        validated.options = question.options.map((option, index) => {
          try {
            return this.sanitizeContent(option, {
              minLength: 1,
              maxLength: 200,
              fieldName: `選択肢${index + 1}`
            });
          } catch (error) {
            errors.push(`選択肢${index + 1}: ${error.message}`);
            return option;
          }
        });
        
        // Correct answer validation
        if (typeof question.correctAnswer !== 'number' || 
            question.correctAnswer < 0 || 
            question.correctAnswer >= question.options.length) {
          errors.push('正解の選択肢が無効です');
        } else {
          validated.correctAnswer = question.correctAnswer;
        }
      }
    }
    
    // True/False validation
    if (question.type === 'true-false') {
      if (typeof question.correctAnswer !== 'boolean') {
        errors.push('正誤問題の正解は true または false である必要があります');
      } else {
        validated.correctAnswer = question.correctAnswer;
      }
    }
    
    // Short answer validation
    if (question.type === 'short-answer') {
      try {
        validated.correctAnswer = this.sanitizeContent(question.correctAnswer, {
          minLength: 1,
          maxLength: 100,
          fieldName: '正解'
        });
      } catch (error) {
        errors.push(error.message);
      }
    }
    
    // Explanation (optional)
    if (question.explanation) {
      try {
        validated.explanation = this.sanitizeContent(question.explanation, {
          maxLength: 2000,
          fieldName: '解説'
        });
      } catch (error) {
        errors.push(error.message);
      }
    }
    
    // Difficulty level
    const allowedDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (question.difficulty && !allowedDifficulties.includes(question.difficulty)) {
      errors.push(`難易度が無効です。許可レベル: ${allowedDifficulties.join(', ')}`);
    } else {
      validated.difficulty = question.difficulty || 'intermediate';
    }
    
    if (errors.length > 0) {
      const error = new Error('問題の検証に失敗しました');
      error.errors = errors;
      throw error;
    }
    
    return validated;
  }
};

/**
 * Content validation schemas
 */
const ContentSchemas = {
  /**
   * Lesson content validation
   * @param {object} data - Lesson data
   * @returns {object} - Validated lesson data
   */
  lesson(data) {
    const errors = [];
    const validated = {};
    
    // Title validation
    try {
      validated.title = ContentValidationUtils.sanitizeContent(data.title, {
        minLength: 5,
        maxLength: 200,
        fieldName: 'レッスンタイトル'
      });
    } catch (error) {
      errors.push(error.message);
    }
    
    // Description validation
    if (data.description) {
      try {
        validated.description = ContentValidationUtils.sanitizeContent(data.description, {
          maxLength: 1000,
          fieldName: 'レッスン説明'
        });
      } catch (error) {
        errors.push(error.message);
      }
    }
    
    // Content validation (markdown)
    try {
      validated.content = ContentValidationUtils.validateMarkdown(data.content);
    } catch (error) {
      errors.push(error.message);
    }
    
    // Subject validation
    const allowedSubjects = [
      'constitutional-law', 'administrative-law', 'civil-law', 
      'commercial-law', 'general-knowledge'
    ];
    if (!allowedSubjects.includes(data.subject)) {
      errors.push(`科目が無効です。許可科目: ${allowedSubjects.join(', ')}`);
    } else {
      validated.subject = data.subject;
    }
    
    // Unit number validation
    if (typeof data.unitNumber !== 'number' || data.unitNumber < 1) {
      errors.push('ユニット番号は1以上の整数である必要があります');
    } else {
      validated.unitNumber = data.unitNumber;
    }
    
    // Tags validation (optional)
    if (data.tags && Array.isArray(data.tags)) {
      validated.tags = data.tags.map(tag => {
        return ContentValidationUtils.sanitizeContent(tag, {
          maxLength: 50,
          fieldName: 'タグ'
        });
      }).filter(tag => tag.length > 0);
    }
    
    if (errors.length > 0) {
      const error = new Error('レッスンの検証に失敗しました');
      error.errors = errors;
      throw error;
    }
    
    return validated;
  },

  /**
   * Quiz validation
   * @param {object} data - Quiz data
   * @returns {object} - Validated quiz data
   */
  quiz(data) {
    const errors = [];
    const validated = {};
    
    // Quiz title
    try {
      validated.title = ContentValidationUtils.sanitizeContent(data.title, {
        minLength: 5,
        maxLength: 200,
        fieldName: 'クイズタイトル'
      });
    } catch (error) {
      errors.push(error.message);
    }
    
    // Questions validation
    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
      errors.push('クイズには少なくとも1つの問題が必要です');
    } else {
      validated.questions = [];
      data.questions.forEach((question, index) => {
        try {
          const validatedQuestion = ContentValidationUtils.validateQuizQuestion(question);
          validated.questions.push(validatedQuestion);
        } catch (error) {
          errors.push(`問題${index + 1}: ${error.message}`);
          if (error.errors) {
            errors.push(...error.errors.map(e => `問題${index + 1}: ${e}`));
          }
        }
      });
    }
    
    // Time limit (optional, in minutes)
    if (data.timeLimit) {
      if (typeof data.timeLimit !== 'number' || data.timeLimit < 1 || data.timeLimit > 180) {
        errors.push('制限時間は1分から180分の間で設定してください');
      } else {
        validated.timeLimit = data.timeLimit;
      }
    }
    
    if (errors.length > 0) {
      const error = new Error('クイズの検証に失敗しました');
      error.errors = errors;
      throw error;
    }
    
    return validated;
  },

  /**
   * User comment validation
   * @param {object} data - Comment data
   * @returns {object} - Validated comment data
   */
  comment(data) {
    const validated = {};
    
    // Comment content
    validated.content = ContentValidationUtils.sanitizeContent(data.content, {
      minLength: 1,
      maxLength: 2000,
      fieldName: 'コメント'
    });
    
    // Rating (optional, 1-5 stars)
    if (data.rating) {
      if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        throw new Error('評価は1から5の間で設定してください');
      }
      validated.rating = data.rating;
    }
    
    return validated;
  },

  /**
   * File upload validation
   * @param {object} file - File data
   * @param {string} category - File category
   * @returns {object} - Validated file data
   */
  file(file, category) {
    return ContentValidationUtils.validateFile(file, category);
  }
};

module.exports = {
  ContentSchemas,
  ContentValidationUtils,
  CONTENT_XSS_OPTIONS,
  ALLOWED_FILE_TYPES
};
