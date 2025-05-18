import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // ヘッダーの高さ分オフセット
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false); // モバイルメニューを閉じる
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - スマホでは小さめに表示 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-700 whitespace-nowrap">行政書士試験対策</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            <a href="#hero" className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 whitespace-nowrap" onClick={(e) => scrollToSection(e, 'hero')}>
              トップ
            </a>
            <a href="#subjects" className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 whitespace-nowrap" onClick={(e) => scrollToSection(e, 'subjects')}>
              学習内容
            </a>
            <a href="#downloads" className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 whitespace-nowrap" onClick={(e) => scrollToSection(e, 'downloads')}>
              学習ノート
            </a>
            <a href="#pricing" className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 whitespace-nowrap" onClick={(e) => scrollToSection(e, 'pricing')}>
              料金
            </a>
            <a href="#featured" className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 whitespace-nowrap" onClick={(e) => scrollToSection(e, 'featured')}>
              おすすめ
            </a>
            <a href="#contact" className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 whitespace-nowrap" onClick={(e) => scrollToSection(e, 'contact')}>
              お問合せ
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link href="/login" className="text-sm lg:text-base text-gray-700 hover:text-indigo-600 whitespace-nowrap">
              ログイン
            </Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-md shadow-sm text-sm lg:text-base whitespace-nowrap">
              無料登録
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <a href="#hero" className="text-gray-700 hover:text-indigo-600" onClick={(e) => scrollToSection(e, 'hero')}>
                トップページ
              </a>
              <a href="#subjects" className="text-gray-700 hover:text-indigo-600" onClick={(e) => scrollToSection(e, 'subjects')}>
                学習コンテンツ
              </a>
              <a href="#downloads" className="text-gray-700 hover:text-indigo-600" onClick={(e) => scrollToSection(e, 'downloads')}>
                学習ノート
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600" onClick={(e) => scrollToSection(e, 'pricing')}>
                料金プラン
              </a>
              <a href="#featured" className="text-gray-700 hover:text-indigo-600" onClick={(e) => scrollToSection(e, 'featured')}>
                おすすめコンテンツ
              </a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600" onClick={(e) => scrollToSection(e, 'contact')}>
                お問い合わせ
              </a>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link href="/login" className="text-gray-700 hover:text-indigo-600 py-1">
                  ログイン
                </Link>
                <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm text-center">
                  無料登録
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}