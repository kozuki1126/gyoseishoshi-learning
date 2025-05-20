import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CallToAction() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // ログイン状態を確認
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsLoggedIn(loggedIn);
    setIsPremium(premium);
  }, []);

  // CTAの表示内容を決定
  const getCTAContent = () => {
    if (isPremium) {
      return {
        title: "学習を続けましょう",
        description: "プレミアム会員として、すべての機能をご利用いただけます。学習を続けて、合格を目指しましょう。",
        buttonText: "学習コンテンツを見る",
        buttonLink: "/subjects"
      };
    } else if (isLoggedIn) {
      return {
        title: "プレミアム会員にアップグレード",
        description: "PDFと音声のダウンロード、詳細な過去問解説など、より効率的な学習機能をご利用いただけます。",
        buttonText: "料金プランを見る",
        buttonLink: "/pricing"
      };
    } else {
      return {
        title: "今すぐ無料会員登録",
        description: "会員登録をして、行政書士試験対策をスタートしましょう。基本的な学習コンテンツは無料でご利用いただけます。",
        buttonText: "無料会員登録",
        buttonLink: "/register"
      };
    }
  };

  const ctaContent = getCTAContent();

  return (
    <section id="cta" className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {ctaContent.title}
          </h2>
          <p className="text-lg sm:text-xl text-indigo-100 mb-8">
            {ctaContent.description}
          </p>
          <Link href={ctaContent.buttonLink} className="inline-flex items-center bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-4 rounded-lg shadow-lg transform transition hover:scale-105">
            {ctaContent.buttonText}
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          {/* 学習進捗ステータス（プレミアム会員のみ） */}
          {isPremium && (
            <div className="mt-12 bg-white bg-opacity-10 rounded-lg p-6 text-left">
              <h3 className="text-xl font-bold text-white mb-4">あなたの学習状況</h3>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">全体の進捗状況</span>
                  <span className="text-white font-bold">25%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5">
                  <div className="bg-white h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-indigo-100 text-sm mb-1">最近の学習</div>
                  <div className="text-white font-bold">憲法の基本原理</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-indigo-100 text-sm mb-1">次の推奨学習</div>
                  <div className="text-white font-bold">天皇の地位と権能</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Link href="/dashboard" className="inline-flex items-center text-white hover:text-indigo-200 font-medium">
                  学習ダッシュボードを見る
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 波形デザイン要素 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,53.3C672,53,768,75,864,80C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
}