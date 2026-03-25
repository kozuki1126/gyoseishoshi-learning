import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import { useAuth, withAuth } from '@/features/auth/context/AuthContext';
import {
  User,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Settings,
  LogOut,
  Crown,
  BarChart3,
  Play
} from 'lucide-react';

function MyPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentUnits, setRecentUnits] = useState([]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data);

        // 最近アクセスした単元を抽出
        if (data.progress) {
          const units = Object.entries(data.progress)
            .map(([unitId, prog]) => ({ unitId, ...prog }))
            .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
            .slice(0, 5);
          setRecentUnits(units);
        }
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // 学習時間をフォーマット
  const formatTime = (seconds) => {
    if (!seconds) return '0分';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>マイページ | 行政書士試験対策</title>
        <meta name="description" content="学習進捗の確認とアカウント設定" />
      </Head>

      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    こんにちは、{user?.name}さん
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {user?.isPremium ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                        <Crown className="w-4 h-4" />
                        プレミアム会員
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                        無料会員
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  href="/mypage/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  設定
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  ログアウト
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">学習した単元</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {progress?.overall?.totalUnits || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">完了した単元</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {progress?.overall?.completedUnits || 0}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">総学習時間</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatTime(progress?.overall?.totalTimeSpent)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">平均スコア</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {progress?.overall?.averageScore || 0}%
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progress Overview */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  学習進捗
                </h2>
                <Link
                  href="/subjects"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  科目一覧へ
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">全体の進捗率</span>
                  <span className="font-medium text-gray-900">
                    {progress?.overall?.completionRate || 0}%
                  </span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress?.overall?.completionRate || 0}%` }}
                  />
                </div>
              </div>

              {/* Recent Activity */}
              <h3 className="text-sm font-medium text-gray-700 mb-3">最近の学習</h3>
              {recentUnits.length > 0 ? (
                <div className="space-y-3">
                  {recentUnits.map((unit) => (
                    <div
                      key={unit.unitId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${unit.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm text-gray-700">単元 {unit.unitId}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {unit.score !== undefined && (
                          <span>{unit.score}点</span>
                        )}
                        <span>{formatTime(unit.timeSpent)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>まだ学習履歴がありません</p>
                  <Link
                    href="/subjects"
                    className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700"
                  >
                    <Play className="w-4 h-4" />
                    学習を始める
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Continue Learning */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <h2 className="text-lg font-bold mb-3">学習を続ける</h2>
                <p className="text-blue-100 text-sm mb-4">
                  前回の続きから学習を再開しましょう
                </p>
                <Link
                  href="/subjects"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  学習を始める
                </Link>
              </div>

              {/* Upgrade to Premium */}
              {!user?.isPremium && (
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-6 h-6" />
                    <h2 className="text-lg font-bold">プレミアム会員</h2>
                  </div>
                  <p className="text-yellow-100 text-sm mb-4">
                    全コンテンツへのアクセス、音声ダウンロード、詳細な進捗分析が利用可能に
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors"
                  >
                    詳細を見る
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">クイックリンク</h2>
                <div className="space-y-2">
                  <Link
                    href="/subjects"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">科目一覧</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  <Link
                    href="/mypage/settings"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">アカウント設定</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// 認証必須のページとしてエクスポート
export default withAuth(MyPage);
