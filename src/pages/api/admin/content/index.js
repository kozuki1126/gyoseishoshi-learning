import fs from 'fs';
import contentRepository from '@/server/repositories/contentRepository';
import { parseMultipartForm } from '@/server/api/multipart';
import { saveAsset } from '@/server/api/assets';

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
  if (req.method === 'GET') {
    const includeDraft = req.query.includeDraft !== 'false';
    const result = contentRepository.listUnits(req.query, {
      includeDraft,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      units: result.units,
      pagination: result.pagination,
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
    const payload = normalizePayload(fields);
    const htmlFile = pickFirst(files.htmlFile);

    if (htmlFile) {
      payload.contentFormat = 'html';
      payload.content = fs.readFileSync(htmlFile.filepath, 'utf8');
    }

    if (!payload.title || !payload.subjectId || !payload.content) {
      return res.status(400).json({
        success: false,
        error: 'タイトル・科目・本文は必須です',
      });
    }

    const provisionalId = contentRepository.generateUnitId(payload.subjectId);
    const audioFile = pickFirst(files.audioFile);
    const pdfFile = pickFirst(files.pdfFile);

    const unit = contentRepository.saveUnit({
      ...payload,
      id: provisionalId,
      audioUrl: audioFile ? saveAsset(audioFile, 'audio', provisionalId) : null,
      pdfUrl: pdfFile ? saveAsset(pdfFile, 'pdf', provisionalId) : null,
    });

    return res.status(201).json({
      success: true,
      unit,
    });
  } catch (error) {
    console.error('Create content error:', error);
    return res.status(500).json({
      success: false,
      error: 'コンテンツの作成に失敗しました',
    });
  }
}
