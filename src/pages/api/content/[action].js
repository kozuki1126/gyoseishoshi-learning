import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// コンテンツの保存先ディレクトリ
const CONTENT_DIR = path.join(process.cwd(), 'content');
const UNITS_DIR = path.join(CONTENT_DIR, 'units');

// 許可されたファイルタイプと拡張子
const ALLOWED_FILE_TYPES = {
  pdf: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    maxSize: 50 * 1024 * 1024 // 50MB
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
    maxSize: 100 * 1024 * 1024 // 100MB
  }
};

// 禁止されたファイル名パターン
const FORBIDDEN_PATTERNS = [
  /\.\./,  // ディレクトリトラバーサル
  /\//,    // パス区切り文字
  /\\/,    // Windowsパス区切り文字
  /\x00/,  // ヌル文字
  /[<>:"|?*]/, // 特殊文字
];

// セキュアなファイル名の生成
function generateSecureFilename(originalName, unitId, fileType) {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${unitId}_${timestamp}_${random}${ext}`;
}

// ファイルタイプの検証
function validateFileType(file, expectedType) {
  const fileExt = path.extname(file.originalFilename).toLowerCase();
  const allowedConfig = ALLOWED_FILE_TYPES[expectedType];
  
  if (!allowedConfig) {
    throw new Error(`未対応のファイルタイプ: ${expectedType}`);
  }
  
  // MIMEタイプチェック
  if (!allowedConfig.mimeTypes.includes(file.mimetype)) {
    throw new Error(`許可されていないMIMEタイプ: ${file.mimetype}`);
  }
  
  // 拡張子チェック
  if (!allowedConfig.extensions.includes(fileExt)) {
    throw new Error(`許可されていない拡張子: ${fileExt}`);
  }
  
  // ファイルサイズチェック
  if (file.size > allowedConfig.maxSize) {
    const maxSizeMB = Math.round(allowedConfig.maxSize / (1024 * 1024));
    throw new Error(`ファイルサイズが上限を超えています（上限: ${maxSizeMB}MB）`);
  }
  
  return true;
}

// ファイル名の安全性チェック
function validateFilename(filename) {
  if (!filename || typeof filename !== 'string') {
    throw new Error('無効なファイル名です');
  }
  
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(filename)) {
      throw new Error('危険な文字が含まれているファイル名です');
    }
  }
  
  return true;
}

// unit IDの検証
function validateUnitId(unitId) {
  if (!unitId || typeof unitId !== 'string') {
    throw new Error('無効な単元IDです');
  }
  
  // 英数字とハイフン、アンダースコアのみ許可
  if (!/^[a-zA-Z0-9_-]+$/.test(unitId)) {
    throw new Error('単元IDに無効な文字が含まれています');
  }
  
  if (unitId.length > 50) {
    throw new Error('単元IDが長すぎます');
  }
  
  return true;
}

// 必要なディレクトリを作成する関数
async function ensureDirectories() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(UNITS_DIR, { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'public/audio'), { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'public/pdf'), { recursive: true });
}

// アップロードレート制限
const uploadAttempts = new Map();
const MAX_UPLOADS_PER_HOUR = 10;
const UPLOAD_WINDOW = 60 * 60 * 1000; // 1時間

function checkUploadRateLimit(ip) {
  const now = Date.now();
  const attempts = uploadAttempts.get(ip) || [];
  
  // 1時間より古い試行を削除
  const recentAttempts = attempts.filter(time => now - time < UPLOAD_WINDOW);
  
  if (recentAttempts.length >= MAX_UPLOADS_PER_HOUR) {
    return false;
  }
  
  recentAttempts.push(now);
  uploadAttempts.set(ip, recentAttempts);
  return true;
}

export default async function handler(req, res) {
  // セキュリティヘッダーの設定
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  await ensureDirectories();
  
  const { action, unitId } = req.query;

  try {
    switch (action) {
      case 'get':
        if (!unitId) {
          return res.status(400).json({ 
            error: 'Validation error',
            message: 'Unit ID is required' 
          });
        }
        
        validateUnitId(unitId);
        
        // 単元コンテンツを読み込む
        const contentPath = path.join(UNITS_DIR, `${unitId}.md`);
        try {
          const content = await fs.readFile(contentPath, 'utf-8');
          res.status(200).json({ 
            success: true,
            content, 
            unitId 
          });
        } catch (error) {
          if (error.code === 'ENOENT') {
            // ファイルが存在しない場合は空のコンテンツを返す
            res.status(200).json({ 
              success: true,
              content: '', 
              unitId 
            });
          } else {
            throw error;
          }
        }
        break;

      case 'save':
        if (!unitId) {
          return res.status(400).json({ 
            error: 'Validation error',
            message: 'Unit ID is required' 
          });
        }
        
        if (req.method !== 'POST') {
          return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'POST method required' 
          });
        }
        
        validateUnitId(unitId);
        
        const { content } = req.body;
        
        // コンテンツの検証
        if (typeof content !== 'string') {
          return res.status(400).json({ 
            error: 'Validation error',
            message: 'Content must be a string' 
          });
        }
        
        if (content.length > 1024 * 1024) { // 1MB制限
          return res.status(400).json({ 
            error: 'Validation error',
            message: 'Content too large (max 1MB)' 
          });
        }
        
        const savePath = path.join(UNITS_DIR, `${unitId}.md`);
        await fs.writeFile(savePath, content, 'utf-8');
        
        res.status(200).json({ 
          success: true, 
          unitId, 
          path: savePath 
        });
        break;

      case 'upload':
        if (req.method !== 'POST') {
          return res.status(405).json({ 
            error: 'Method not allowed',
            message: 'POST method required' 
          });
        }
        
        try {
          console.log('=== Secure File Upload Started ===');
          
          // レート制限チェック
          const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
          if (!checkUploadRateLimit(clientIp)) {
            return res.status(429).json({ 
              error: 'Rate limit exceeded',
              message: 'アップロード回数が上限に達しました。1時間後に再試行してください' 
            });
          }
          
          // 動的インポート: formidable はサーバーサイド専用
          console.log('Importing formidable...');
          const formidableModule = await import('formidable');
          const formidable = formidableModule.default;
          console.log('Formidable imported successfully');
          
          const form = formidable({
            keepExtensions: true,
            maxFileSize: 100 * 1024 * 1024, // 100 MB
            uploadDir: path.join(process.cwd(), 'temp'), // 一時ディレクトリ
            filter: ({ name, originalFilename, mimetype }) => {
              // ファイル名の事前チェック
              if (!originalFilename) return false;
              validateFilename(originalFilename);
              return true;
            }
          });
          
          console.log('Creating temp directory...');
          // 一時ディレクトリを作成
          try {
            await fs.mkdir(path.join(process.cwd(), 'temp'), { recursive: true });
            console.log('Temp directory created/verified');
          } catch (mkdirError) {
            console.error('Error creating temp directory:', mkdirError);
            throw mkdirError;
          }
          
          console.log('Starting file parse...');
          let fields, files;
          try {
            [fields, files] = await form.parse(req);
          } catch (parseError) {
            console.error('Parse error:', parseError);
            throw new Error('ファイルの解析に失敗しました');
          }
          
          console.log('Parse result - Fields:', fields);
          console.log('Parse result - Files:', Object.keys(files));
          
          const file = files.file?.[0];
          const fileType = fields.fileType?.[0];
          const targetUnitId = fields.unitId?.[0];
          
          console.log('Extracted data:', { file: !!file, fileType, targetUnitId });
          
          if (!file || !fileType || !targetUnitId) {
            console.log('Missing required fields');
            return res.status(400).json({ 
              error: 'Validation error',
              message: 'Missing required fields',
              details: {
                file: !!file,
                fileType: !!fileType,
                targetUnitId: !!targetUnitId
              }
            });
          }
          
          // 各種検証
          validateUnitId(targetUnitId);
          validateFilename(file.originalFilename);
          validateFileType(file, fileType);
          
          // セキュアなファイル名の生成
          const secureFileName = generateSecureFilename(file.originalFilename, targetUnitId, fileType);
          
          const targetDir = fileType === 'pdf' ? 'public/pdf' : 'public/audio';
          const absoluteTargetDir = path.join(process.cwd(), targetDir);
          const targetPath = path.join(absoluteTargetDir, secureFileName);
          
          console.log('Target paths:', { targetDir, absoluteTargetDir, targetPath });
          
          // 保存先ディレクトリを作成（存在しない場合）
          try {
            await fs.mkdir(absoluteTargetDir, { recursive: true });
            console.log('Target directory created/verified');
          } catch (targetMkdirError) {
            console.error('Error creating target directory:', targetMkdirError);
            throw targetMkdirError;
          }
          
          // ファイルをコピー
          console.log('Copying file from', file.filepath, 'to', targetPath);
          try {
            await fs.copyFile(file.filepath, targetPath);
            console.log('File copied successfully');
          } catch (copyError) {
            console.error('Error copying file:', copyError);
            throw new Error('ファイルの保存に失敗しました');
          }
          
          // 一時ファイルを削除
          try {
            await fs.unlink(file.filepath);
            console.log('Temp file deleted');
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
            // 一時ファイルの削除失敗は致命的ではない
          }
          
          const publicUrl = `/${targetDir.replace('public/', '')}/${secureFileName}`;
          console.log('Public URL:', publicUrl);
          
          // 該当単元のメタデータを更新
          const metaDir = path.join(process.cwd(), 'content/units');
          try {
            await fs.mkdir(metaDir, { recursive: true });
            console.log('Metadata directory created/verified');
          } catch (metaMkdirError) {
            console.error('Error creating metadata directory:', metaMkdirError);
            throw metaMkdirError;
          }
          
          const metaPath = path.join(metaDir, `${targetUnitId}.meta.json`);
          let metadata = {};
          
          console.log('Loading existing metadata from:', metaPath);
          try {
            const metaContent = await fs.readFile(metaPath, 'utf-8');
            metadata = JSON.parse(metaContent);
            console.log('Existing metadata loaded:', metadata);
          } catch (error) {
            console.log('No existing metadata found, creating new');
          }
          
          if (fileType === 'pdf') {
            metadata.pdfUrl = publicUrl;
            metadata.pdfOriginalName = file.originalFilename;
            metadata.pdfSize = file.size;
          } else if (fileType === 'audio') {
            metadata.audioUrl = publicUrl;
            metadata.audioOriginalName = file.originalFilename;
            metadata.audioSize = file.size;
          }
          
          metadata.lastUpdated = new Date().toISOString();
          
          console.log('Updated metadata:', metadata);
          
          try {
            await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2));
            console.log('Metadata saved successfully');
          } catch (metaWriteError) {
            console.error('Error writing metadata:', metaWriteError);
            throw metaWriteError;
          }
          
          console.log('=== Secure File Upload Completed Successfully ===');
          res.status(200).json({
            success: true,
            unitId: targetUnitId,
            fileType,
            publicUrl,
            originalName: file.originalFilename,
            size: file.size,
            metadata,
            savedPath: targetPath
          });
        } catch (error) {
          console.error('=== File Upload Failed ===');
          console.error('Error type:', error.constructor.name);
          console.error('Error message:', error.message);
          
          res.status(500).json({ 
            error: 'Upload failed', 
            message: error.message || 'ファイルアップロードに失敗しました'
          });
        }
        
        break;

      case 'get-files':
        if (!unitId) {
          return res.status(400).json({ 
            error: 'Validation error',
            message: 'Unit ID is required' 
          });
        }
        
        validateUnitId(unitId);
        
        // メタデータから既存ファイルの情報を取得
        const metadataPath = path.join(UNITS_DIR, `${unitId}.meta.json`);
        try {
          const metaContent = await fs.readFile(metadataPath, 'utf-8');
          const metadata = JSON.parse(metaContent);
          res.status(200).json({ 
            success: true,
            metadata, 
            unitId 
          });
        } catch (error) {
          res.status(200).json({ 
            success: true,
            metadata: {}, 
            unitId 
          });
        }
        break;

      default:
        res.status(404).json({ 
          error: 'Not found',
          message: 'Invalid action' 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: 'サーバーエラーが発生しました'
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
