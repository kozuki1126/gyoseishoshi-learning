import contentRepository from '@/server/repositories/contentRepository';
import { getSubjectById } from '@/features/content/lib/subjects';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { subjectId, type, difficulty, accessLevel, status, page, limit } = req.query;
    const includeDraft = req.query.includeDraft === 'true';

    const result = contentRepository.listUnits(
      {
        subjectId,
        type,
        difficulty,
        accessLevel,
        status,
      },
      {
        page,
        limit,
        includeDraft,
      }
    );

    const units = result.units.map((unit) => {
      const subject = getSubjectById(unit.subjectId);
      return {
        id: unit.id,
        title: unit.title,
        subjectId: unit.subjectId,
        subjectName: subject?.name || null,
        subjectColor: subject?.color || null,
        type: unit.type,
        difficulty: unit.difficulty,
        estimatedTime: unit.estimatedTime,
        accessLevel: unit.accessLevel,
        status: unit.status,
        hasAudio: unit.hasAudio,
        hasPdf: unit.hasPdf,
        audioUrl: unit.audioUrl,
        pdfUrl: unit.pdfUrl,
        summary: unit.content.summary,
        sections: unit.content.sections,
        createdAt: unit.createdAt,
        updatedAt: unit.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      units,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get units error:', error);
    return res.status(500).json({
      success: false,
      error: '単元の取得に失敗しました',
    });
  }
}
