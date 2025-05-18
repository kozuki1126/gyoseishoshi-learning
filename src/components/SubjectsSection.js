import { useState } from 'react';
import Link from 'next/link';
import { subjects } from '../data/subjects';
import * as Icons from './icons';

export default function SubjectsSection() {
  // 開いている科目のID
  const [openCategory, setOpenCategory] = useState(null);

  // カテゴリの開閉を切り替える関数
  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  // アイコンコンポーネントを取得する関数
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'PersonIcon':
        return <Icons.PersonIcon />;
      case 'ScaleIcon':
        return <Icons.ScaleIcon />;
      case 'ShieldIcon':
        return <Icons.ShieldIcon />;
      case 'PlusIcon':
        return <Icons.PlusIcon />;
      case 'OfficeIcon':
        return <Icons.OfficeIcon />;
      case 'BriefcaseIcon':
        return <Icons.BriefcaseIcon />;
      case 'BuildingIcon':
        return <Icons.BuildingIcon />;
      case 'ComputerIcon':
        return <Icons.ComputerIcon />;
      default:
        return <Icons.PersonIcon />;
    }
  };

  // カテゴリごとのデータを整理
  const categories = [
    {
      id: "minpo",
      title: "民法",
      color: "bg-green-600",
      icon: "PersonIcon",
      description: "権利の主体、物権、債権、親族・相続など民法の全範囲を学びます。",
      subjects: [subjects.find(s => s.id === 1)], // 民法
    },
    {
      id: "kenpo",
      title: "憲法",
      color: "bg-red-600",
      icon: "ScaleIcon",
      description: "基本的人権の保障、統治機構など憲法の基礎を学びます。",
      subjects: [subjects.find(s => s.id === 2)], // 憲法
    },
    {
      id: "gyoseiho",
      title: "行政法",
      color: "bg-blue-600",
      icon: "ShieldIcon",
      description: "行政法の一般原則、行政手続法、行政不服審査法、行政事件訴訟法を学びます。",
      subjects: [
        subjects.find(s => s.id === 3), // 行政法の一般的な法理論
        subjects.find(s => s.id === 4), // 行政手続法・行政不服審査法・行政事件訴訟法
      ],
    },
    {
      id: "chihoujichi",
      title: "地方自治法",
      color: "bg-pink-600",
      icon: "OfficeIcon",
      description: "地方公共団体の組織、権能、住民参加などを学びます。",
      subjects: [subjects.find(s => s.id === 5)], // 地方自治法
    },
    {
      id: "shoho",
      title: "商法・会社法",
      color: "bg-purple-600",
      icon: "BriefcaseIcon",
      description: "法人制度、株式会社の設立・運営・組織再編に関する法律を学びます。",
      subjects: [subjects.find(s => s.id === 6)], // 民法・商法上の法人と会社法
    },
    {
      id: "joho",
      title: "情報通信",
      color: "bg-gray-600",
      icon: "ComputerIcon",
      description: "インターネットの基礎知識と法令用語を学びます。",
      subjects: [subjects.find(s => s.id === 8)], // 情報通信（インターネット・法令用語）
    },
    {
      id: "gyoseishoshi",
      title: "行政書士法",
      color: "bg-indigo-600",
      icon: "BuildingIcon",
      description: "行政書士の主な業務分野に関連する個別行政法を学びます。",
      subjects: [subjects.find(s => s.id === 7)], // 個別行政法
    },
  ];

  return (
    <section id="subjects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">学習コンテンツ</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            行政書士試験の全科目をカバーする、充実した学習コンテンツをご用意しています。
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* カテゴリバナー（クリック可能） */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-5 focus:outline-none"
              >
                <div className="flex items-center">
                  <div className={`rounded-lg text-white p-3 ${category.color} mr-4`}>
                    {getIconComponent(category.icon)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                <svg
                  className={`w-6 h-6 text-gray-400 transform transition-transform ${
                    openCategory === category.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* コンテンツ（カテゴリが開いている場合のみ表示） */}
              {openCategory === category.id && (
                <div className="p-5 bg-gray-50 border-t border-gray-200">
                  {category.subjects.map((subject) => (
                    <div key={subject?.id} className="mb-6 last:mb-0">
                      {/* 科目が複数ある場合のみサブタイトルを表示 */}
                      {category.subjects.length > 1 && (
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">{subject?.title}</h4>
                      )}
                      
                      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subject?.units.map((unit) => (
                          <li key={unit.id}>
                            <Link 
                              href={`/units/${unit.id}`} 
                              className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-md transition"
                            >
                              <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="line-clamp-2">{unit.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      
                      {/* 科目が複数ある場合、区切り線を表示 */}
                      {category.subjects.length > 1 && category.subjects.indexOf(subject) < category.subjects.length - 1 && (
                        <hr className="my-6 border-gray-200" />
                      )}
                    </div>
                  ))}
                  
                  {/* 学習支援リンク */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href={`/subjects?category=${category.id}`}
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      すべての単元を見る
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                    <Link
                      href={`/downloads?category=${category.id}`}
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      関連学習ノート
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </Link>
                    <Link
                      href={`/practice?category=${category.id}`}
                      className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      練習問題
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/subjects" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
            >
              全科目を見る
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link 
              href="/study-plan" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-md"
            >
              おすすめ学習プラン
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}