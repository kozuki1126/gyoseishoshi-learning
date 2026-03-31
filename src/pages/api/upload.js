import { parseMultipartForm } from '@/server/api/multipart';
import { saveAsset, listUploadedAssets, deletePublicAsset } from '@/server/api/assets';

export const config = {
  api: {
    bodyParser: false,
  },
};

function pickFirst(value) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      files: listUploadedAssets(),
    });
  }

  if (req.method === 'DELETE') {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({
        success: false,
        error: '削除対象のパスが必要です',
      });
    }

    deletePublicAsset(String(path));
    return res.status(200).json({
      success: true,
      message: 'ファイルを削除しました',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { fields, files } = await parseMultipartForm(req);
    const uploadType = pickFirst(fields.type) || 'general';
    const unitId = pickFirst(fields.unitId) || 'asset';
    const fileField = pickFirst(files.file || files.audioFile || files.pdfFile);

    if (!fileField) {
      return res.status(400).json({
        success: false,
        error: 'ファイルがアップロードされていません',
      });
    }

    const fileType = uploadType === 'audio' ? 'audio' : 'pdf';
    const url = saveAsset(fileField, fileType, String(unitId));

    return res.status(200).json({
      success: true,
      message: 'ファイルをアップロードしました',
      files: [
        {
          originalName: fileField.originalFilename,
          size: fileField.size,
          mimetype: fileField.mimetype,
          url,
          path: url,
        },
      ],
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'ファイルのアップロードに失敗しました',
      details: error.message,
    });
  }
}
