import Link from 'next/link';
import { subjects } from '../../data/subjects';

// 関連単元を表示するコンポーネント
export default function RelatedUnits({ unit }) {
  // 単元IDから単元詳細を取得する関数
  const getUnitDetails = (unitId) => {
    for (const subject of subjects) {
      for (const u of subject.units) {
        if (u.id === unitId) {
          return {
            title: u.title,
            subject: subject.title
          };
        }
      }
    }
    
    return { title: `単元 ${unitId}`, subject: '不明' };
  };

  // 関連単元がない場合
  if (!unit.relatedUnits || unit.relatedUnits.length === 0) {
    return (
      <p className="text-gray-500 italic">関連単元はありません</p>
    );
  }

  return (
    <ul className="space-y-2">
      {unit.relatedUnits.map((unitId) => {
        const details = getUnitDetails(unitId);
        
        return (
          <li key={unitId}>
            <Link href={`/units/${unitId}`} className="flex items-center p-2 rounded-md hover:bg-gray-100 transition">
              <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <span className="block text-sm font-medium text-gray-900">{details.title}</span>
                <span className="block text-xs text-gray-500">{details.subject}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}