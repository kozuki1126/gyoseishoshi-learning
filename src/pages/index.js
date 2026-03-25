import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '@/shared/layout/Header';
import HeroSection from '@/features/marketing/components/HeroSection';
import AIQualitySection from '@/features/marketing/components/AIQualitySection';
import SubjectsSection from '@/features/marketing/components/SubjectsSection';
import FeaturedContent from '@/features/marketing/components/FeaturedContent';
import DownloadSection from '@/features/marketing/components/DownloadSection';
import YouTubeSection from '@/features/marketing/components/YouTubeSection';
import PricingSection from '@/features/marketing/components/PricingSection';
import CallToAction from '@/features/marketing/components/CallToAction';
import Footer from '@/shared/layout/Footer';

export default function Home() {
  // スムーズスクロールのためのフック
  useEffect(() => {
    // ハッシュによるスクロール処理
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          // ヘッダーの高さ分オフセット
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    // 初期ロード時とハッシュ変更時にスクロール
    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>行政書士試験対策 | テキスト&音声で効率学習</title>
        <meta name="description" content="行政書士試験合格を目指す受験生のための学習プラットフォーム。テキストと音声で効率的に学習できます。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main>
        <HeroSection />
        <AIQualitySection />
        <SubjectsSection />
        <FeaturedContent />
        <DownloadSection />
        <YouTubeSection />
        <PricingSection />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
