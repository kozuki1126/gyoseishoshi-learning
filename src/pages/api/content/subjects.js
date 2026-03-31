import { subjects, getSubjectById } from '@/features/content/lib/subjects';
import contentRepository from '@/server/repositories/contentRepository';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { id } = req.query;

    // 特定の科目を取得
    if (id) {
      const subject = getSubjectById(id);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          error: '科目が見つかりません'
        });
      }

      // アイコンはシリアライズできないので除外
      const { icon, ...subjectWithoutIcon } = subject;

      return res.status(200).json({
        success: true,
        subject: {
          ...subjectWithoutIcon,
          iconName: icon?.displayName || icon?.name || null
        }
      });
    }

    // 全科目を取得
    const publishedUnits = contentRepository.listUnits({}, { includeDraft: false }).units;
    const subjectsData = subjects.map(subject => {
      const { icon, ...subjectWithoutIcon } = subject;
      return {
        ...subjectWithoutIcon,
        iconName: icon?.displayName || icon?.name || null,
        unitCount: publishedUnits.filter((unit) => unit.subjectId === subject.id).length
      };
    });

    // カテゴリ別に分類
    const categorized = {
      law: subjectsData.filter(s => s.category === 'law'),
      general: subjectsData.filter(s => s.category === 'general')
    };

    // 統計情報
    const stats = {
      totalSubjects: subjects.length,
      totalUnits: publishedUnits.length,
      totalHours: subjects.reduce((sum, s) => sum + s.estimatedHours, 0)
    };

    return res.status(200).json({
      success: true,
      subjects: subjectsData,
      categorized,
      stats
    });

  } catch (error) {
    console.error('Get subjects error:', error);
    return res.status(500).json({
      success: false,
      error: '科目の取得に失敗しました'
    });
  }
}
