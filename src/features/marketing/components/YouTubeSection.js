import { Play, ExternalLink } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: '行政書士試験 憲法の学習ポイント',
    thumbnail: '/images/video-thumb-1.jpg',
    duration: '15:32',
    views: '12,543',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: '行政法の基本原理をわかりやすく解説',
    thumbnail: '/images/video-thumb-2.jpg',
    duration: '22:18',
    views: '8,721',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 3,
    title: '民法改正のポイント総まとめ',
    thumbnail: '/images/video-thumb-3.jpg',
    duration: '18:45',
    views: '15,892',
    youtubeId: 'dQw4w9WgXcQ'
  }
];

function VideoCard({ video }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3">
        {/* Placeholder for thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Play className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform" />
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
        {video.title}
      </h3>
      <p className="text-sm text-gray-500">
        {video.views} 回視聴
      </p>
    </a>
  );
}

export default function YouTubeSection() {
  return (
    <section id="youtube" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-4">
            YouTube
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            無料動画で学ぶ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            YouTubeチャンネルで行政書士試験のポイントを無料で解説しています。
            チャンネル登録して最新の動画をチェックしましょう。
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="https://www.youtube.com/@gyoseishoshi-learning"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            YouTubeチャンネルを見る
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
