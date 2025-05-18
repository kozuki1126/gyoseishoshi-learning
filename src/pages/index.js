import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AIQualitySection from '../components/AIQualitySection';
import SubjectsSection from '../components/SubjectsSection';
import FeaturedContent from '../components/FeaturedContent';
import DownloadSection from '../components/DownloadSection';
import YouTubeSection from '../components/YouTubeSection';
import PricingSection from '../components/PricingSection';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

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