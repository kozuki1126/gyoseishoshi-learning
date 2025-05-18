import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "テキスト&音声で効率的に学習",
      subtitle: "いつでもどこでも、あなたのペースで行政書士試験対策",
      cta: "今すぐ無料で始める",
      bgColor: "from-indigo-600 to-purple-700"
    },
    {
      title: "完全無料で学習開始",
      subtitle: "有料会員はテキスト＆音声ダウンロード可能",
      cta: "学習内容を見る",
      bgColor: "from-blue-600 to-cyan-700"
    },
    {
      title: "ダウンロードして学習可能",
      subtitle: "有料会員なら全ての教材をダウンロードして学習できます",
      cta: "料金プランを見る",
      bgColor: "from-green-600 to-teal-700"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // 特徴セクションの項目 - リアルなビジネス風画像に更新
  const features = [
    {
      title: "徹底解説テキスト",
      description: "試験に出るポイントをわかりやすく解説した学習テキスト",
      imageUrl: "/images/features/textbook-business.jpg"
    },
    {
      title: "音声講義",
      description: "移動中や家事の合間にも学習できる音声講義",
      imageUrl: "/images/features/audio-lecture-business.jpg"
    },
    {
      title: "ダウンロード対応",
      description: "有料会員ならテキストと音声をダウンロードして学習可能",
      imageUrl: "/images/features/download-support-business.jpg"
    }
  ];

  return (
    <>
      {/* ヒーローセクション - 完全に分離した構造に変更 */}
      <section id="hero" className="relative bg-gradient-to-r from-indigo-600 to-purple-700">
        {/* 高さを調整し、背景色をセクション自体に設定 */}
        <div className="relative h-[60vh] min-h-[400px] z-10">
          {/* スライド背景 - z-indexを調整 */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 bg-gradient-to-r ${slide.bgColor} ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* スライドコンテンツ */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-1000 text-white ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 absolute'
                  }`}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">{slide.title}</h1>
                  <p className="text-xl sm:text-2xl md:text-3xl mb-8 max-w-3xl">{slide.subtitle}</p>
                  <Link href="/register" className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center shadow-lg transition transform hover:scale-105">
                    {slide.cta}
                    <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* スライドインジケーター - 位置を上に調整 */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 明確な区切りセクション - 完全に独立した要素として追加 */}
      <div className="w-full h-16 bg-gray-50 shadow-md relative z-20"></div>

      {/* 特徴紹介セクション - z-indexを調整して重なりを防止 */}
      <section id="features" className="bg-gray-50 py-16 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* セクションタイトルを追加 */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">学習スタイルに合わせた機能</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              あなたの学習スタイルや環境に合わせて、様々な機能をご用意しています。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* 画像部分 - リアルなビジネス風画像を表示 */}
                <div className="w-full h-56 sm:h-64 overflow-hidden">
                  <div className="relative w-full h-full">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* テキスト部分 - 画像の下に配置 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}