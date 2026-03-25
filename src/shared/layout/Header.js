import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/features/auth/context/AuthContext';
import { User, LogOut, Settings, BookOpen, ChevronDown, Menu, X, Crown } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  // トップページかどうかを判定
  const isHomePage = router.pathname === '/';

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800 whitespace-nowrap">
                行政書士試験対策
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {isHomePage ? (
              <>
                <a href="#subjects" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={(e) => scrollToSection(e, 'subjects')}>
                  学習内容
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={(e) => scrollToSection(e, 'pricing')}>
                  料金
                </a>
                <a href="#featured" className="text-gray-600 hover:text-blue-600 transition-colors" onClick={(e) => scrollToSection(e, 'featured')}>
                  おすすめ
                </a>
              </>
            ) : (
              <>
                <Link href="/subjects" className="text-gray-600 hover:text-blue-600 transition-colors">
                  科目一覧
                </Link>
                <Link href="/#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                  料金
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  {user?.isPremium && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/mypage"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        マイページ
                      </Link>
                      <Link
                        href="/subjects"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <BookOpen className="w-4 h-4" />
                        学習を始める
                      </Link>
                      <Link
                        href="/mypage/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        設定
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          ログアウト
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  ログイン
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  無料登録
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {isHomePage ? (
                <>
                  <a href="#subjects" className="text-gray-700 hover:text-blue-600 py-2" onClick={(e) => scrollToSection(e, 'subjects')}>
                    学習内容
                  </a>
                  <a href="#pricing" className="text-gray-700 hover:text-blue-600 py-2" onClick={(e) => scrollToSection(e, 'pricing')}>
                    料金プラン
                  </a>
                  <a href="#featured" className="text-gray-700 hover:text-blue-600 py-2" onClick={(e) => scrollToSection(e, 'featured')}>
                    おすすめ
                  </a>
                </>
              ) : (
                <>
                  <Link href="/subjects" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                    科目一覧
                  </Link>
                  <Link href="/#pricing" className="text-gray-700 hover:text-blue-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                    料金プラン
                  </Link>
                </>
              )}

              <div className="border-t border-gray-200 pt-4 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/mypage"
                      className="flex items-center gap-3 text-gray-700 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      マイページ
                    </Link>
                    <Link
                      href="/mypage/settings"
                      className="flex items-center gap-3 text-gray-700 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      設定
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 text-red-600 hover:text-red-700 py-2 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      ログアウト
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      href="/auth/login" 
                      className="text-gray-700 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-center font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      無料登録
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
