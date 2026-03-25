import contentManager from '@/features/content/lib/contentManager';
import { getSubjectById } from '@/features/content/lib/subjects';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    default:
      return res.status(405).json({ 
        success: false, 
        error: 'Method not allowed' 
      });
  }
}

// 単元取得
async function handleGet(req, res) {
  try {
    const { id, subjectId, type, difficulty, page, limit } = req.query;

    // 特定の単元を取得
    if (id) {
      const unit = await contentManager.getUnit(id);
      
      if (!unit) {
        return res.status(404).json({
          success: false,
          error: '単元が見つかりません'
        });
      }

      // 科目情報を追加
      const subject = getSubjectById(unit.subjectId);
      const { icon, ...subjectWithoutIcon } = subject || {};

      return res.status(200).json({
        success: true,
        unit: {
          ...unit,
          subject: subject ? {
            ...subjectWithoutIcon,
            iconName: icon?.displayName || icon?.name || null
          } : null
        }
      });
    }

    // フィルタ付きで単元一覧を取得
    const filters = {};
    if (subjectId) filters.subjectId = subjectId;
    if (type) filters.type = type;
    if (difficulty) filters.difficulty = difficulty;
    if (page) filters.page = page;
    if (limit) filters.limit = limit;

    const result = await contentManager.getUnits(filters);

    // 各単元に科目情報を追加
    const unitsWithSubject = result.units.map(unit => {
      const subject = getSubjectById(unit.subjectId);
      return {
        ...unit,
        subjectName: subject?.name || null,
        subjectColor: subject?.color || null
      };
    });

    return res.status(200).json({
      success: true,
      units: unitsWithSubject,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('Get units error:', error);
    return res.status(500).json({
      success: false,
      error: '単元の取得に失敗しました'
    });
  }
}
