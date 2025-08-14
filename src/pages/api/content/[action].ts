import { NextApiRequest, NextApiResponse } from 'next';
import databaseContentService from '@/lib/databaseContentService';
import jwt from 'jsonwebtoken';
import formidable, { File, Fields, Files } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Types
interface AuthenticatedRequest extends NextApiRequest {
  query: {
    action: string;
    unitId?: string;
  };
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: any;
  [key: string]: any;
}

// File upload configuration
const ALLOWED_FILE_TYPES = {
  pdf: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    maxSize: 52428800, // 50MB
    directory: 'public/pdf'
  },
  audio: {
    mimeTypes: [
      'audio/mpeg',
      'audio/mp3', 
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/aac',
      'audio/ogg'
    ],
    extensions: ['.mp3', '.wav', '.m4a', '.aac', '.ogg'],
    maxSize: 104857600, // 100MB
    directory: 'public/audio'
  }
} as const;

// Security patterns
const FORBIDDEN_PATTERNS = [
  /\.\./,  // Directory traversal
  /\//,    // Path separators
  /\\/,    // Windows path separators
  /\x00/,  // Null characters
  /[<>:"|?*]/, // Special characters
];

// Rate limiting for uploads
const uploadAttempts = new Map<string, number[]>();
const MAX_UPLOADS_PER_HOUR = parseInt(process.env.MAX_UPLOAD_ATTEMPTS || '10', 10);
const UPLOAD_WINDOW = parseInt(process.env.UPLOAD_LOCKOUT_HOURS || '1', 10) * 60 * 60 * 1000;

// JWT verification middleware
function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    
    const decoded = jwt.verify(token, secret) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

// Authentication middleware
function authenticate(req: AuthenticatedRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return false;
  }
  
  req.user = user;
  return true;
}

// Utility functions
function validateUnitId(unitId: string): void {
  if (!unitId || typeof unitId !== 'string') {
    throw new Error('無効な単元IDです');
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(unitId)) {
    throw new Error('単元IDに無効な文字が含まれています');
  }
  
  if (unitId.length > 50) {
    throw new Error('単元IDが長すぎます');
  }
}

function validateFilename(filename: string): void {
  if (!filename || typeof filename !== 'string') {
    throw new Error('無効なファイル名です');
  }
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(filename)) {
      throw new Error('危険な文字が含まれているファイル名です');
    }
  }
}

function validateFileType(file: File, expectedType: keyof typeof ALLOWED_FILE_TYPES): void {
  const fileExt = path.extname(file.originalFilename || '').toLowerCase();
  const allowedConfig = ALLOWED_FILE_TYPES[expectedType];
  
  if (!allowedConfig.mimeTypes.includes(file.mimetype || '')) {
    throw new Error(`許可されていないMIMEタイプ: ${file.mimetype}`);
  }
  
  if (!allowedConfig.extensions.includes(fileExt)) {
    throw new Error(`許可されていない拡張子: ${fileExt}`);
  }
  
  if (file.size > allowedConfig.maxSize) {
    const maxSizeMB = Math.round(allowedConfig.maxSize / (1024 * 1024));
    throw new Error(`ファイルサイズが上限を超えています（上限: ${maxSizeMB}MB）`);
  }
}

function generateSecureFilename(originalName: string, unitId: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${unitId}_${timestamp}_${random}${ext}`;
}

function checkUploadRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = uploadAttempts.get(ip) || [];
  
  const recentAttempts = attempts.filter(time => now - time < UPLOAD_WINDOW);
  
  if (recentAttempts.length >= MAX_UPLOADS_PER_HOUR) {
    return false;
  }
  
  recentAttempts.push(now);
  uploadAttempts.set(ip, recentAttempts);
  return true;
}

async function ensureDirectories(): Promise<void> {
  await fs.mkdir(path.join(process.cwd(), 'public/audio'), { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'public/pdf'), { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'temp'), { recursive: true });
}

// Main handler
export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  const { action, unitId } = req.query;

  // Authentication check for write operations
  const writeOperations = ['save', 'upload', 'delete', 'update'];
  if (writeOperations.includes(action as string) && !authenticate(req)) {
    return res.status(401).json({
      error: 'Authentication required',
      message: '認証が必要です'
    });
  }

  try {
    await ensureDirectories();

    switch (action) {
      case 'get-subjects':
        const subjects = await databaseContentService.getSubjects();
        res.status(200).json({
          success: true,
          data: subjects
        });
        break;

      case 'get-units':
        const filters = {
          subjectId: req.query.subjectId as string,
          type: req.query.type as string,
          difficulty: req.query.difficulty as string,
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 20
        };
        
        const unitsResult = await databaseContentService.getUnits(filters);
        res.status(200).json({
          success: true,
          data: unitsResult
        });
        break;

      case 'get':
        if (!unitId) {
          return res.status(400).json({
            error: 'Validation error',
            message: 'Unit IDが必要です'
          });
        }
        
        validateUnitId(unitId);
        const unit = await databaseContentService.getUnit(unitId);
        
        if (!unit) {
          return res.status(404).json({
            error: 'Not found',
            message: '指定された学習単元が見つかりません'
          });
        }
        
        res.status(200).json({
          success: true,
          data: unit
        });
        break;

      case 'search':
        const searchQuery = req.query.q as string;
        if (!searchQuery) {
          return res.status(400).json({
            error: 'Validation error',
            message: '検索クエリが必要です'
          });
        }
        
        const searchParams = {
          query: searchQuery,
          type: req.query.type as string,
          subjectId: req.query.subjectId as string,
          limit: parseInt(req.query.limit as string) || 10
        };
        
        const searchResults = await databaseContentService.searchContent(searchParams);
        res.status(200).json({
          success: true,
          data: searchResults
        });
        break;

      case 'progress':
        if (!req.user) {
          return res.status(401).json({
            error: 'Authentication required',
            message: '認証が必要です'
          });
        }

        if (req.method === 'GET') {
          const progress = await databaseContentService.getUserProgress(req.user.userId);
          res.status(200).json({
            success: true,
            data: progress
          });
        } else if (req.method === 'POST') {
          if (!unitId) {
            return res.status(400).json({
              error: 'Validation error',
              message: 'Unit IDが必要です'
            });
          }
          
          const progressData = req.body;
          const updatedProgress = await databaseContentService.updateUserProgress(
            req.user.userId,
            unitId,
            progressData
          );
          
          res.status(200).json({
            success: true,
            data: updatedProgress
          });
        } else {
          res.status(405).json({
            error: 'Method not allowed',
            message: 'GETまたはPOSTメソッドのみ対応しています'
          });
        }
        break;

      case 'analytics':
        // Admin only
        if (!req.user || req.user.role !== 'ADMIN') {
          return res.status(403).json({
            error: 'Forbidden',
            message: '管理者権限が必要です'
          });
        }
        
        const analytics = await databaseContentService.getAnalytics();
        res.status(200).json({
          success: true,
          data: analytics
        });
        break;

      case 'upload':
        if (req.method !== 'POST') {
          return res.status(405).json({
            error: 'Method not allowed',
            message: 'POSTメソッドが必要です'
          });
        }

        // Rate limiting
        const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
          || req.socket.remoteAddress 
          || 'unknown';
          
        if (!checkUploadRateLimit(clientIp)) {
          return res.status(429).json({
            error: 'Rate limit exceeded',
            message: `アップロード回数が上限に達しました。${Math.floor(UPLOAD_WINDOW / (60 * 60 * 1000))}時間後に再試行してください`
          });
        }

        // Parse multipart form data
        const form = formidable({
          keepExtensions: true,
          maxFileSize: 104857600, // 100MB
          uploadDir: path.join(process.cwd(), 'temp'),
          filter: ({ originalFilename }) => {
            if (!originalFilename) return false;
            validateFilename(originalFilename);
            return true;
          }
        });

        const [fields, files] = await form.parse(req);
        
        const file = (files.file as File[])?.[0];
        const fileType = (fields.fileType as string[])?.[0] as keyof typeof ALLOWED_FILE_TYPES;
        const targetUnitId = (fields.unitId as string[])?.[0];

        if (!file || !fileType || !targetUnitId) {
          return res.status(400).json({
            error: 'Validation error',
            message: '必要なフィールドが不足しています'
          });
        }

        validateUnitId(targetUnitId);
        validateFilename(file.originalFilename!);
        validateFileType(file, fileType);

        const secureFileName = generateSecureFilename(file.originalFilename!, targetUnitId);
        const allowedConfig = ALLOWED_FILE_TYPES[fileType];
        const targetDir = path.join(process.cwd(), allowedConfig.directory);
        const targetPath = path.join(targetDir, secureFileName);

        await fs.mkdir(targetDir, { recursive: true });
        await fs.copyFile(file.filepath, targetPath);
        await fs.unlink(file.filepath); // Clean up temp file

        const publicUrl = `/${allowedConfig.directory.replace('public/', '')}/${secureFileName}`;

        // Update unit in database
        const updateData = fileType === 'pdf' 
          ? { pdfUrl: publicUrl, hasPdf: true }
          : { audioUrl: publicUrl, hasAudio: true };

        await databaseContentService.updateUnit(targetUnitId, updateData);

        res.status(200).json({
          success: true,
          data: {
            unitId: targetUnitId,
            fileType,
            publicUrl,
            originalName: file.originalFilename,
            size: file.size
          }
        });
        break;

      default:
        res.status(404).json({
          error: 'Not found',
          message: '無効なアクションです'
        });
    }
  } catch (error) {
    console.error('Content API Error:', error);
    
    const message = error instanceof Error ? error.message : 'サーバーエラーが発生しました';
    
    res.status(500).json({
      error: 'Internal server error',
      message
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};