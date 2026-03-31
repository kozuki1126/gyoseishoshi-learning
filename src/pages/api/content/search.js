import contentRepository from '@/server/repositories/contentRepository';
import { subjects, getSubjectById } from '@/features/content/lib/subjects';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { q, type, subjectId, limit = 10 } = req.query;

    // クエリが空の場合
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: '検索キーワードを入力してください'
      });
    }

    const query = q.trim();

    // コンテンツマネージャーで検索
    const searchParams = {
      query,
      type,
      subjectId,
      limit: parseInt(limit)
    };

    const unitResults = contentRepository.searchUnits(searchParams);

    // 科目名でも検索
    const matchingSubjects = subjects.filter(subject => 
      subject.name.includes(query) || 
      subject.description.includes(query)
    ).map(subject => {
      const { icon, ...subjectWithoutIcon } = subject;
      return {
        type: 'subject',
        ...subjectWithoutIcon,
        iconName: icon?.displayName || icon?.name || null
      };
    });

    // 単元結果に科目情報を追加
    const enrichedUnitResults = unitResults.map(result => {
      const subject = getSubjectById(result.subjectId);
      return {
        type: 'unit',
        ...result,
        subjectName: subject?.name || null,
        subjectColor: subject?.color || null
      };
    });

    // 結果を統合
    const allResults = [
      ...matchingSubjects.slice(0, 3), // 科目は最大3件
      ...enrichedUnitResults
    ];

    return res.status(200).json({
      success: true,
      query,
      results: allResults,
      counts: {
        subjects: matchingSubjects.length,
        units: enrichedUnitResults.length,
        total: allResults.length
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      error: '検索に失敗しました'
    });
  }
}
