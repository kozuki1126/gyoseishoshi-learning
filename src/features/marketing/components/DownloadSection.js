import Link from 'next/link';

export default function DownloadSection() {
  return (
    <section id="downloads" className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">学習・演習ノート</h2>
          <p className="text-xl text-gray-600">
            行政書士試験の効率的な学習をサポートする各種ノートをダウンロードできます。
            学習ノートと演習ノートを活用して、より効果的に試験対策を進めましょう。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* 学習ノートカード */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-52 bg-indigo-600 flex items-center justify-center">
              <div className="text-center p-6">
                <svg 
                  className="h-16 w-16 text-white opacity-80 mx-auto mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
                <h3 className="text-xl font-bold text-white">学習ノート</h3>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>重要ポイントを体系的に整理</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>暗記しやすい図表やチャート</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>最新の法改正に対応した内容</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mb-6">
                各科目の重要ポイントと頻出論点をまとめた学習ノートです。
                基本から応用までを網羅し、図表やチャートを多用して理解しやすく構成しています。
              </p>
              <Link 
                href="/downloads?tab=study"
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                学習ノートを見る
              </Link>
            </div>
          </div>
          
          {/* 演習ノートカード */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-52 bg-green-600 flex items-center justify-center">
              <div className="text-center p-6">
                <svg 
                  className="h-16 w-16 text-white opacity-80 mx-auto mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                  />
                </svg>
                <h3 className="text-xl font-bold text-white">演習ノート</h3>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>頻出問題と詳細な解説</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>問題を解く際のポイント解説</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>過去問を含む実践的な問題集</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 mb-6">
                各科目の頻出問題を集めた演習問題集です。
                問題を解くための考え方や解法テクニックも解説し、実践力を養成します。
                過去問から予想問題まで幅広く収録しています。
              </p>
              <Link 
                href="/downloads?tab=exercise"
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                演習ノートを見る
              </Link>
            </div>
          </div>
        </div>
        
        {/* 会員限定コンテンツ */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/3 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-white mb-2">プレミアム会員限定ノート</h3>
              <p className="text-white opacity-90 mb-6">
                プレミアム会員になると、より詳細な学習ノートや直近5年間の過去問解説集など、
                豊富な学習資料がすべて無制限でダウンロードできるようになります。
              </p>
              <Link 
                href="/pricing"
                className="inline-block bg-white text-orange-500 hover:bg-gray-100 font-medium py-2 px-6 rounded-md transition-colors"
              >
                会員プランを見る
              </Link>
            </div>
            <div className="md:w-1/3 bg-opacity-20 bg-yellow-300 flex items-center justify-center p-8">
              <svg 
                className="h-20 w-20 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}