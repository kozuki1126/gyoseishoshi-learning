import { useState } from 'react';

export default function YouTubeSection() {
  // 動画データ
  const videos = [
    {
      id: 'video1',
      title: '行政書士試験 憲法の要点解説',
      description: '憲法の基本的な考え方や重要ポイントをわかりやすく解説します。',
      thumbnailUrl: null,
      embedId: 'sample-video-id-1'
    },
    {
      id: 'video2',
      title: '行政書士試験 民法の出題傾向と対策',
      description: '民法の最近の出題傾向と効率的な学習方法を解説します。',
      thumbnailUrl: null,
      embedId: 'sample-video-id-2'
    },
    {
      id: 'video3',
      title: '行政書士試験 合格者インタビュー',
      description: '実際に試験に合格した先輩からの学習アドバイスをお届けします。',
      thumbnailUrl: null,
      embedId: 'sample-video-id-3'
    }
  ];

  // 選択された動画を管理するステート
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  return (
    <section id="youtube" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">動画コンテンツ</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            YouTube無料公開中の学習動画をご覧いただけます。チャンネル登録で最新動画をお見逃しなく。
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン動画エリア */}
          <div className="lg:col-span-2">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-center bg-gray-800 h-full">
                {/* 実際のYouTube埋め込み */}
                <div className="w-full h-full flex items-center justify-center">
                  {/* 注意: 実際の実装では、以下のようなYouTube埋め込みコードを使用します */}
                  {/* <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${selectedVideo.embedId}`} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe> */}
                  
                  {/* デモ用のプレースホルダー */}
                  <div className="text-center text-white p-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
                    <p className="text-gray-300">{selectedVideo.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h3>
              <p className="text-gray-600">{selectedVideo.description}</p>
            </div>
          </div>
          
          {/* サムネイルリスト */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4">その他の動画</h3>
            <div className="space-y-4">
              {videos.map((video) => (
                <div 
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`cursor-pointer group ${
                    selectedVideo.id === video.id 
                      ? 'bg-indigo-50 border-indigo-500' 
                      : 'bg-white hover:bg-gray-50'
                  } border rounded-lg overflow-hidden shadow-sm transition`}
                >
                  <div className="p-4 flex">
                    <div className="flex-shrink-0 w-24 h-16 mr-4 bg-gray-200 rounded overflow-hidden">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-800 text-white">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        selectedVideo.id === video.id 
                          ? 'text-indigo-800' 
                          : 'text-gray-900 group-hover:text-indigo-600'
                      } line-clamp-2`}>
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* YouTubeチャンネルボタン */}
            <div className="mt-6">
              <a 
                href="https://www.youtube.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none w-full justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                YouTubeチャンネルを見る
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}