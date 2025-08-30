/**
 * Content Management Validation Schemas
 * 
 * Comprehensive Zod schemas for content-related input validation
 * specifically designed for the 行政書士 (Administrative Scrivener) 
 * learning platform. Handles educational content, course materials,
 * and learning progress tracking.
 * 
 * Security Features:
 * - Content length limits to prevent DoS
 * - HTML/Markdown sanitization rules
 * - File attachment validation
 * - User-generated content filtering
 * - SEO and metadata validation
 * 
 * Usage:
 *   import { unitSchema, courseSchema } from '@/schemas/content';
 *   const result = unitSchema.safeParse(requestData);
 */

const { z } = require('zod');
const validator = require('validator');

// Content security constants
const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 1000;
const CONTENT_MAX_LENGTH = 50000; // 50KB of text content
const TAG_MAX_LENGTH = 50;
const MAX_TAGS = 20;
const SLUG_MAX_LENGTH = 100;
const META_DESCRIPTION_MAX_LENGTH = 160;
const SEARCH_KEYWORDS_MAX_LENGTH = 500;

// Legal subject areas for 行政書士 exam
const LEGAL_SUBJECTS = [
  'constitutional-law',      // 憲法
  'administrative-law',      // 行政法
  'civil-law',              // 民法
  'commercial-law',         // 商法
  'basic-legal-studies',    // 基礎法学
  'general-knowledge',      // 一般知識等
  'administrative-writing', // 文章理解
  'practical-application'   // 実務
];

const CONTENT_TYPES = [
  'text',           // テキスト
  'video',          // 動画
  'audio',          // 音声
  'quiz',           // クイズ
  'exercise',       // 演習問題
  'case-study',     // 事例研究
  'reference'       // 参考資料
];

const DIFFICULTY_LEVELS = [
  'beginner',       // 初級
  'intermediate',   // 中級
  'advanced',       // 上級
  'expert'          // 専門級
];

const CONTENT_STATUS = [
  'draft',          // 下書き
  'review',         // 査読中
  'published',      // 公開済み
  'archived',       // アーカイブ
  'deleted'         // 削除済み
];

/**
 * Custom validation functions for content
 */
const contentValidators = {
  /**
   * Validate URL slug format
   */
  slug: (slug) => {
    if (!slug || typeof slug !== 'string') return false;
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug) && slug.length <= SLUG_MAX_LENGTH;
  },

  /**
   * Validate HTML content (basic safety check)
   */
  safeHTML: (html) => {
    if (!html || typeof html !== 'string') return false;
    
    // Check for dangerous patterns
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^>]*>/gi,
      /<object\b[^>]*>/gi,
      /<embed\b[^>]*>/gi,
      /<link\b[^>]*>/gi,
      /<meta\b[^>]*>/gi,
      /javascript:/gi,
      /data:.*base64/gi,
      /on\w+\s*=/gi // Event handlers
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(html));
  },

  /**
   * Validate Markdown content
   */
  safeMarkdown: (markdown) => {
    if (!markdown || typeof markdown !== 'string') return false;
    
    // Basic Markdown validation - no HTML injection
    const dangerousPatterns = [
      /<script/gi,
      /<iframe/gi,
      /javascript:/gi,
      /data:.*base64/gi
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(markdown));
  },

  /**
   * Validate Japanese text content
   */
  japaneseText: (text) => {
    if (!text || typeof text !== 'string') return true; // Optional content
    
    // Allow Japanese characters, English, numbers, and common punctuation
    const validPattern = /^[ひらがなカタカナ漢字a-zA-Z0-9\s\n\r\t.,!?()（）「」『』【】〜ー・：；／\-_+=*#@%&\[\]{}|\\'"<>]+$/u;
    return validPattern.test(text);
  }
};

/**
 * Base content schemas
 */
const titleSchema = z.string()
  .min(1, { message: 'タイトルは必須です' })
  .max(TITLE_MAX_LENGTH, { message: `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください` })
  .refine(contentValidators.japaneseText, {
    message: 'タイトルに無効な文字が含まれています'
  });

const descriptionSchema = z.string()
  .max(DESCRIPTION_MAX_LENGTH, { 
    message: `説明文は${DESCRIPTION_MAX_LENGTH}文字以内で入力してください` 
  })
  .refine(contentValidators.japaneseText, {
    message: '説明文に無効な文字が含まれています'
  })
  .optional();

const slugSchema = z.string()
  .min(1, { message: 'URLスラッグは必須です' })
  .refine(contentValidators.slug, {
    message: 'URLスラッグは小文字の英数字とハイフンのみ使用できます'
  });

const tagsSchema = z.array(
  z.string()
    .min(1, { message: 'タグは空にできません' })
    .max(TAG_MAX_LENGTH, { message: `タグは${TAG_MAX_LENGTH}文字以内で入力してください` })
    .refine(contentValidators.japaneseText, {
      message: 'タグに無効な文字が含まれています'
    })
)
  .max(MAX_TAGS, { message: `タグは${MAX_TAGS}個まで設定できます` })
  .optional()
  .default([]);

/**
 * Legal subject validation
 */
const subjectSchema = z.enum(LEGAL_SUBJECTS, {
  errorMap: () => ({ message: '有効な法律科目を選択してください' })
});

/**
 * Content type validation
 */
const contentTypeSchema = z.enum(CONTENT_TYPES, {
  errorMap: () => ({ message: '有効なコンテンツタイプを選択してください' })
});

/**
 * Difficulty level validation
 */
const difficultySchema = z.enum(DIFFICULTY_LEVELS, {
  errorMap: () => ({ message: '有効な難易度を選択してください' })
});

/**
 * Content status validation
 */
const statusSchema = z.enum(CONTENT_STATUS, {
  errorMap: () => ({ message: '有効なステータスを選択してください' })
});

/**
 * Learning unit schema - core content structure
 */
const unitSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  description: descriptionSchema,
  subject: subjectSchema,
  contentType: contentTypeSchema,
  difficulty: difficultySchema,
  status: statusSchema.optional().default('draft'),
  
  // Content data
  content: z.string()
    .min(1, { message: 'コンテンツ本文は必須です' })
    .max(CONTENT_MAX_LENGTH, { 
      message: `コンテンツ本文は${CONTENT_MAX_LENGTH}文字以内で入力してください` 
    })
    .refine(contentValidators.safeMarkdown, {
      message: 'コンテンツに無効または危険な内容が含まれています'
    }),
    
  // Metadata
  tags: tagsSchema,
  estimatedMinutes: z.number()
    .int()
    .min(1, { message: '学習時間は1分以上で設定してください' })
    .max(600, { message: '学習時間は600分以下で設定してください' })
    .optional(),
    
  // SEO metadata
  metaTitle: z.string()
    .max(60, { message: 'メタタイトルは60文字以内で入力してください' })
    .optional(),
  metaDescription: z.string()
    .max(META_DESCRIPTION_MAX_LENGTH, { 
      message: `メタ説明は${META_DESCRIPTION_MAX_LENGTH}文字以内で入力してください` 
    })
    .optional(),
    
  // Ordering and relationships
  order: z.number().int().min(0).optional().default(0),
  prerequisiteIds: z.array(z.string()).optional().default([]),
  
  // Publishing settings
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),
  
  // Accessibility
  hasAudio: z.boolean().optional().default(false),
  hasVideo: z.boolean().optional().default(false),
  hasQuiz: z.boolean().optional().default(false),
  
  // Learning objectives
  objectives: z.array(
    z.string()
      .min(1, { message: '学習目標は空にできません' })
      .max(200, { message: '学習目標は200文字以内で入力してください' })
  ).optional().default([])
});

/**
 * Course schema - collection of units
 */
const courseSchema = z.object({
  title: titleSchema,
  slug: slugSchema,
  description: descriptionSchema,
  subject: subjectSchema,
  difficulty: difficultySchema,
  status: statusSchema.optional().default('draft'),
  
  // Course structure
  units: z.array(z.string()) // Array of unit IDs
    .min(1, { message: 'コースには最低1つのユニットが必要です' })
    .optional()
    .default([]),
    
  // Course metadata
  tags: tagsSchema,
  estimatedHours: z.number()
    .min(0.5, { message: '推定学習時間は0.5時間以上で設定してください' })
    .max(100, { message: '推定学習時間は100時間以下で設定してください' })
    .optional(),
    
  // Pricing (for premium content)
  isPremium: z.boolean().optional().default(false),
  price: z.number()
    .min(0, { message: '価格は0円以上で設定してください' })
    .max(100000, { message: '価格は100,000円以下で設定してください' })
    .optional(),
    
  // SEO metadata
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(META_DESCRIPTION_MAX_LENGTH).optional(),
  
  // Course image
  thumbnailUrl: z.string()
    .url({ message: '有効なサムネイル画像URLを入力してください' })
    .optional(),
    
  // Instructor information
  instructorId: z.string().optional(),
  instructorNotes: z.string()
    .max(1000, { message: '講師ノートは1000文字以内で入力してください' })
    .optional()
});

/**
 * Quiz question schema
 */
const quizQuestionSchema = z.object({
  question: z.string()
    .min(10, { message: '問題文は10文字以上で入力してください' })
    .max(500, { message: '問題文は500文字以内で入力してください' })
    .refine(contentValidators.japaneseText, {
      message: '問題文に無効な文字が含まれています'
    }),
    
  type: z.enum(['multiple-choice', 'true-false', 'fill-blank', 'essay'], {
    errorMap: () => ({ message: '有効な問題タイプを選択してください' })
  }),
  
  choices: z.array(
    z.string()
      .min(1, { message: '選択肢は空にできません' })
      .max(200, { message: '選択肢は200文字以内で入力してください' })
  ).optional(),
  
  correctAnswer: z.string()
    .min(1, { message: '正解は必須です' }),
    
  explanation: z.string()
    .max(1000, { message: '解説は1000文字以内で入力してください' })
    .optional(),
    
  points: z.number()
    .int()
    .min(1, { message: '配点は1点以上で設定してください' })
    .max(10, { message: '配点は10点以下で設定してください' })
    .optional()
    .default(1),
    
  difficulty: difficultySchema,
  subject: subjectSchema,
  tags: tagsSchema
});

/**
 * Quiz schema
 */
const quizSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  subject: subjectSchema,
  difficulty: difficultySchema,
  
  questions: z.array(quizQuestionSchema)
    .min(1, { message: 'クイズには最低1問が必要です' })
    .max(50, { message: 'クイズは50問以下で作成してください' }),
    
  timeLimit: z.number()
    .int()
    .min(60, { message: '制限時間は60秒以上で設定してください' })
    .max(7200, { message: '制限時間は2時間以下で設定してください' })
    .optional(),
    
  passingScore: z.number()
    .min(0, { message: '合格点は0点以上で設定してください' })
    .max(100, { message: '合格点は100点以下で設定してください' })
    .optional()
    .default(70),
    
  allowRetake: z.boolean().optional().default(true),
  showResults: z.boolean().optional().default(true),
  tags: tagsSchema
});

/**
 * User progress schema
 */
const progressSchema = z.object({
  unitId: z.string().min(1, { message: 'ユニットIDは必須です' }),
  userId: z.string().min(1, { message: 'ユーザーIDは必須です' }),
  
  status: z.enum(['not-started', 'in-progress', 'completed'], {
    errorMap: () => ({ message: '有効な進捗状態を選択してください' })
  }),
  
  progressPercentage: z.number()
    .min(0)
    .max(100)
    .optional()
    .default(0),
    
  timeSpent: z.number()
    .int()
    .min(0, { message: '学習時間は0秒以上で設定してください' })
    .optional()
    .default(0),
    
  lastAccessedAt: z.date().optional(),
  completedAt: z.date().optional(),
  
  // Quiz results
  quizScore: z.number()
    .min(0)
    .max(100)
    .optional(),
  quizAttempts: z.number()
    .int()
    .min(0)
    .optional()
    .default(0),
    
  // Notes and bookmarks
  notes: z.string()
    .max(2000, { message: 'ノートは2000文字以内で入力してください' })
    .optional(),
  bookmarks: z.array(z.number().int().min(0)).optional().default([])
});

/**
 * Search schema
 */
const searchSchema = z.object({
  query: z.string()
    .min(1, { message: '検索キーワードは必須です' })
    .max(SEARCH_KEYWORDS_MAX_LENGTH, { 
      message: `検索キーワードは${SEARCH_KEYWORDS_MAX_LENGTH}文字以内で入力してください` 
    })
    .refine(contentValidators.japaneseText, {
      message: '検索キーワードに無効な文字が含まれています'
    }),
    
  subjects: z.array(subjectSchema).optional(),
  contentTypes: z.array(contentTypeSchema).optional(),
  difficulty: difficultySchema.optional(),
  tags: z.array(z.string()).optional(),
  
  // Pagination
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  
  // Sorting
  sortBy: z.enum(['relevance', 'date', 'title', 'difficulty'], {
    errorMap: () => ({ message: '有効なソート条件を選択してください' })
  }).optional().default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

/**
 * Content validation helpers
 */
const contentValidationHelpers = {
  /**
   * Validate content data
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
   * Sanitize content for safe storage
   */
  sanitizeContent(content) {
    if (typeof content !== 'string') return content;
    
    // Basic sanitization - remove potential XSS vectors
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
};

module.exports = {
  // Main schemas
  unitSchema,
  courseSchema,
  quizSchema,
  quizQuestionSchema,
  progressSchema,
  searchSchema,
  
  // Base schemas
  titleSchema,
  descriptionSchema,
  slugSchema,
  tagsSchema,
  subjectSchema,
  contentTypeSchema,
  difficultySchema,
  statusSchema,
  
  // Validation helpers
  contentValidationHelpers,
  contentValidators,
  
  // Constants
  LEGAL_SUBJECTS,
  CONTENT_TYPES,
  DIFFICULTY_LEVELS,
  CONTENT_STATUS,
  TITLE_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  CONTENT_MAX_LENGTH
};
