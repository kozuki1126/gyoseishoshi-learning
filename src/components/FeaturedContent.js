import { useState } from 'react';
import Link from 'next/link';

export default function FeaturedContent() {
  // おすすめコンテンツデータ
  const featuredItems = [
    {
      id: 1,
      title: '憲法総論',
      description: '憲法の基本的な概念、成立過程、立憲主義について学習します。',
      unitId: 201,
      imageUrl: null,
      category: '人気コンテンツ',
      studyTime: '30分',
      level: '初級'
    },
    {
      id: 2,
      title: '行政手続法の目的と適用範囲',
      description: '行政手続法の目的、適用範囲、基本的な考え方について学習します。',
      unitId: 401,
      imageUrl: null,
      category: '新着コンテンツ',
      studyTime: '45分',
      level: '中級'
    },
    {
      id: 3,
      title: '地方自治の本旨',
      description: '地方自治の本旨、団体自治と住民自治の考え方について学習します。',
      unitId: 501,
      imageUrl: null,
      category: '新着コンテンツ',
      studyTime: '40分',
      level: '中級'
    },
    {
      id: 4,
      title: '民法の基本原則',
      description: '民法の基本原則である私的自治の原則、権利濫用の禁止等について学習します。',
      unitId: 101,
      imageUrl: null,
      category: '人気コンテンツ',
      studyTime: '35分',
      level: '初級'
    }
  ];

  // タブの状態管理
  const [activeTab, setActiveTab] = useState('all');
  
  // タブによるフィルタリング
  const getFilteredItems = () => {
    if (activeTab === 'all') return featuredItems;
    if (activeTab === 'popular') return featuredItems.filter(item => item.category === '人気コンテンツ');
    if (activeTab === 'new') return featuredItems.filter(item => item.category === '新着コンテンツ');
    return featuredItems;
  };

  return (
    <section id="featured" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">おすすめコンテンツ</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            初学者から上級者まで、あなたのレベルに合わせた最適な学習コンテンツをご紹介します。
          </p>
        </div>
        
        {/* タブナビゲーション */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-6 py-2 text-sm font-medium ${
                activeTab === 'popular'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              人気
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'new'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              新着
            </button>
          </div>
        </div>
        
        {/* コンテンツカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {getFilteredItems().map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <Link href={`/units/${item.unitId}`} className="block">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="object-cover w-full h-48"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
                      <span className="text-white text-lg font-medium">
                        {item.title}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-100 text-indigo-600">
                      {item.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.studyTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center text-sm text-gray-500">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {item.level}
                    </span>
                    
                    <span className="font-medium text-indigo-600 hover:text-indigo-800 transition inline-flex items-center">
                      学習する
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* もっと見るボタン */}
        <div className="text-center mt-12 space-y-4">
          <Link href="/subjects" className="inline-flex items-center bg-white hover:bg-gray-50 text-indigo-600 font-medium px-6 py-3 rounded-md shadow-sm border border-gray-200 mr-4">
            すべてのコンテンツを見る
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link href="/downloads" className="inline-flex items-center bg-white hover:bg-gray-50 text-green-600 font-medium px-6 py-3 rounded-md shadow-sm border border-gray-200">
            学習ノート・演習問題集
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            科目別の学習ノートと演習問題集をダウンロードして効率的に学習を進めることができます。
          </p>
        </div>
      </div>
    </section>
  );
}