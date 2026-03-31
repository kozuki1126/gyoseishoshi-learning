import fs from 'fs';
import contentRepository from '@/server/repositories/contentRepository';
import { parseMultipartForm } from '@/server/api/multipart';
import { saveAsset, deletePublicAsset } from '@/server/api/assets';

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

function normalizePayload(fields) {
  return {
    title: pickFirst(fields.title),
    subjectId: pickFirst(fields.subjectId),
    type: pickFirst(fields.type),
    difficulty: pickFirst(fields.difficulty),
    estimatedTime: pickFirst(fields.estimatedTime),
    accessLevel: pickFirst(fields.accessLevel),
    status: pickFirst(fields.status),
    contentFormat: pickFirst(fields.contentFormat) || 'markdown',
    content: pickFirst(fields.content) || pickFirst(fields.markdown),
  };
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const unit = contentRepository.getUnit(String(id), { includeDraft: true });
    if (!unit) {
      return res.status(404).json({
        success: false,
        error: 'コンテンツが見つかりません',
      });
    }

    return res.status(200).json({
      success: true,
      unit,
    });
  }

  if (req.method === 'DELETE') {
    const existing = contentRepository.getUnit(String(id), { includeDraft: true });
    if (existing?.audioUrl) {
      deletePublicAsset(existing.audioUrl);
    }
    if (existing?.pdfUrl) {
      deletePublicAsset(existing.pdfUrl);
    }
    contentRepository.deleteUnit(String(id));

    return res.status(200).json({
      success: true,
      message: 'コンテンツを削除しました',
    });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const existing = contentRepository.getUnit(String(id), { includeDraft: true });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'コンテンツが見つかりません',
      });
    }

    const { fields, files } = await parseMultipartForm(req);
    const payload = normalizePayload(fields);
    const audioFile = pickFirst(files.audioFile);
    const pdfFile = pickFirst(files.pdfFile);
    const htmlFile = pickFirst(files.htmlFile);

    if (htmlFile) {
      payload.contentFormat = 'html';
      payload.content = fs.readFileSync(htmlFile.filepath, 'utf8');
    }

    const nextAudioUrl = audioFile ? saveAsset(audioFile, 'audio', String(id)) : existing.audioUrl;
    const nextPdfUrl = pdfFile ? saveAsset(pdfFile, 'pdf', String(id)) : existing.pdfUrl;

    if (audioFile && existing.audioUrl && existing.audioUrl !== nextAudioUrl) {
      deletePublicAsset(existing.audioUrl);
    }
    if (pdfFile && existing.pdfUrl && existing.pdfUrl !== nextPdfUrl) {
      deletePublicAsset(existing.pdfUrl);
    }

    const unit = contentRepository.saveUnit({
      ...existing,
      ...payload,
      id: String(id),
      audioUrl: nextAudioUrl,
      pdfUrl: nextPdfUrl,
    });

    return res.status(200).json({
      success: true,
      unit,
    });
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(500).json({
      success: false,
      error: 'コンテンツの更新に失敗しました',
    });
  }
}
