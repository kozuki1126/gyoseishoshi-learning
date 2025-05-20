import fs from 'fs/promises';
import path from 'path';

// コンテンツの保存先ディレクトリ
const CONTENT_DIR = path.join(process.cwd(), 'content');
const UNITS_DIR = path.join(CONTENT_DIR, 'units');

// 必要なディレクトリを作成する関数
async function ensureDirectories() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(UNITS_DIR, { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'public/audio'), { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'public/pdf'), { recursive: true });
}

export default async function handler(req, res) {
  await ensureDirectories();
  
  const { action, unitId } = req.query;

  try {
    switch (action) {
      case 'get':
        if (!unitId) {
          return res.status(400).json({ error: 'Unit ID is required' });
        }
        
        // 単元コンテンツを読み込む
        const contentPath = path.join(UNITS_DIR, `${unitId}.md`);
        try {
          const content = await fs.readFile(contentPath, 'utf-8');
          res.status(200).json({ content, unitId });
        } catch (error) {
          if (error.code === 'ENOENT') {
            // ファイルが存在しない場合は空のコンテンツを返す
            res.status(200).json({ content: '', unitId });
          } else {
            throw error;
          }
        }
        break;

      case 'save':
        if (!unitId) {
          return res.status(400).json({ error: 'Unit ID is required' });
        }
        
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        const { content } = req.body;
        const savePath = path.join(UNITS_DIR, `${unitId}.md`);
        await fs.writeFile(savePath, content, 'utf-8');
        
        res.status(200).json({ success: true, unitId, path: savePath });
        break;

      case 'upload':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        try {
          console.log('=== File Upload Started ===');
          
          // 動的インポート: formidable はサーバーサイド専用
          console.log('Importing formidable...');
          const formidableModule = await import('formidable');
          const formidable = formidableModule.default;
          console.log('Formidable imported successfully');
          
          const form = formidable({
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10 MB
            uploadDir: path.join(process.cwd(), 'temp'), // 一時ディレクトリ
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
            throw parseError;
          }
          
          console.log('Parse result - Fields:', fields);
          console.log('Parse result - Files:', files);
          
          const file = files.file?.[0];
          const fileType = fields.fileType?.[0];
          const targetUnitId = fields.unitId?.[0];
          
          console.log('Extracted data:', { file: !!file, fileType, targetUnitId });
          
          if (!file || !fileType || !targetUnitId) {
            console.log('Missing required fields');
            return res.status(400).json({ 
              error: 'Missing required fields',
              details: {
                file: !!file,
                fileType: !!fileType,
                targetUnitId: !!targetUnitId
              }
            });
          }
          
          // ファイルを適切な場所に移動
          const fileExtension = path.extname(file.originalFilename);
          const fileName = `${targetUnitId}${fileExtension}`;
          const targetDir = fileType === 'pdf' ? 'public/pdf' : 'public/audio';
          const absoluteTargetDir = path.join(process.cwd(), targetDir);
          const targetPath = path.join(absoluteTargetDir, fileName);
          
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
            throw copyError;
          }
          
          // 一時ファイルを削除
          try {
            await fs.unlink(file.filepath);
            console.log('Temp file deleted');
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
            // 一時ファイルの削除失敗は致命的ではない
          }
          
          const publicUrl = `/${targetDir.replace('public/', '')}/${fileName}`;
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
          } else if (fileType === 'audio') {
            metadata.audioUrl = publicUrl;
          }
          
          console.log('Updated metadata:', metadata);
          
          try {
            await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2));
            console.log('Metadata saved successfully');
          } catch (metaWriteError) {
            console.error('Error writing metadata:', metaWriteError);
            throw metaWriteError;
          }
          
          console.log('=== File Upload Completed Successfully ===');
          res.status(200).json({
            success: true,
            unitId: targetUnitId,
            fileType,
            publicUrl,
            metadata,
            savedPath: targetPath
          });
        } catch (error) {
          console.error('=== File Upload Failed ===');
          console.error('Error type:', error.constructor.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          
          res.status(500).json({ 
            error: 'File upload failed', 
            message: error.message,
            type: error.constructor.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
        }
        
        break;

      case 'get-files':
        if (!unitId) {
          return res.status(400).json({ error: 'Unit ID is required' });
        }
        
        // メタデータから既存ファイルの情報を取得
        const metadataPath = path.join(UNITS_DIR, `${unitId}.meta.json`);
        try {
          const metaContent = await fs.readFile(metadataPath, 'utf-8');
          const metadata = JSON.parse(metaContent);
          res.status(200).json({ metadata, unitId });
        } catch (error) {
          res.status(200).json({ metadata: {}, unitId });
        }
        break;

      default:
        res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};