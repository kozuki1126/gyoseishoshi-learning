import fs from 'fs';
import path from 'path';

// bodyParserを無効化（ファイルアップロードのため）
export const config = {
  api: {
    bodyParser: false
  }
};

// マルチパートフォームデータを手動でパース
async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      reject(new Error('No boundary found in content-type'));
      return;
    }

    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const parts = buffer.toString().split('--' + boundary);
      
      const result = { fields: {}, files: [] };
      
      for (const part of parts) {
        if (part.includes('Content-Disposition')) {
          const nameMatch = part.match(/name="([^"]+)"/);
          const filenameMatch = part.match(/filename="([^"]+)"/);
          
          if (filenameMatch) {
            // ファイルの場合
            const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);
            const contentStart = part.indexOf('\r\n\r\n') + 4;
            const contentEnd = part.lastIndexOf('\r\n');
            const content = part.slice(contentStart, contentEnd);
            
            result.files.push({
              fieldname: nameMatch?.[1] || 'file',
              filename: filenameMatch[1],
              mimetype: contentTypeMatch?.[1] || 'application/octet-stream',
              content: Buffer.from(content, 'binary')
            });
          } else if (nameMatch) {
            // 通常のフィールドの場合
            const contentStart = part.indexOf('\r\n\r\n') + 4;
            const contentEnd = part.lastIndexOf('\r\n');
            const value = part.slice(contentStart, contentEnd).trim();
            result.fields[nameMatch[1]] = value;
          }
        }
      }
      
      resolve(result);
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // フォームデータのパース
    const { fields, files } = await parseMultipartForm(req);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ファイルがアップロードされていません'
      });
    }

    const uploadType = fields.type || 'general';
    const uploadedFiles = [];

    // アップロードディレクトリの設定
    const uploadDirs = {
      audio: path.join(process.cwd(), 'public', 'audio'),
      pdf: path.join(process.cwd(), 'public', 'pdf'),
      image: path.join(process.cwd(), 'public', 'images'),
      general: path.join(process.cwd(), 'public', 'uploads')
    };

    const uploadDir = uploadDirs[uploadType] || uploadDirs.general;

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 許可されるMIMEタイプ
    const allowedTypes = {
      audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
      pdf: ['application/pdf'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      general: ['audio/mpeg', 'audio/mp3', 'application/pdf', 'image/jpeg', 'image/png', 'image/gif']
    };

    const allowed = allowedTypes[uploadType] || allowedTypes.general;

    for (const file of files) {
      // MIMEタイプのチェック
      if (!allowed.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: `許可されていないファイル形式です: ${file.mimetype}`
        });
      }

      // ファイルサイズのチェック（50MB上限）
      if (file.content.length > 50 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'ファイルサイズが大きすぎます（上限: 50MB）'
        });
      }

      // ファイル名のサニタイズ
      const timestamp = Date.now();
      const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const finalName = `${timestamp}_${safeName}`;
      const filePath = path.join(uploadDir, finalName);

      // ファイルの保存
      fs.writeFileSync(filePath, file.content);

      // 公開URLパスの生成
      const relativePath = filePath.replace(path.join(process.cwd(), 'public'), '');
      const publicUrl = relativePath.replace(/\\/g, '/');

      uploadedFiles.push({
        originalName: file.filename,
        savedName: finalName,
        size: file.content.length,
        mimetype: file.mimetype,
        path: publicUrl,
        url: publicUrl
      });
    }

    return res.status(200).json({
      success: true,
      message: 'ファイルをアップロードしました',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'ファイルのアップロードに失敗しました',
      details: error.message
    });
  }
}
