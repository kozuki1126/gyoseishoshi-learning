import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import { useAuth, withAuth } from '@/features/auth/context/AuthContext';
import {
  BookOpen,
  Target,
  Clock,
  Award,
  ChevronRight,
  Settings,
  LogOut,
  Crown,
  BarChart3,
  Play,
} from 'lucide-react';

function MyPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/user/progress', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const formatTime = (seconds) => {
    if (!seconds) {
      return '0分';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  };

  const resumeUnit = summary?.recent?.[0]?.unit;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>マイページ | 行政書士試験対策</title>
        <meta name="description" content="学習進捗の確認とアカウント設定" />
      </Head>

      <Header />

      <main className="pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">こんにちは、{user?.name}さん</h1>
                  <div className="mt-1 flex items-center gap-2">
                    {user?.isPremium ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-700">
                        <Crown className="h-4 w-4" />
                        プレミアム会員
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
                        無料会員
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/mypage/settings"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5" />
                  設定
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5" />
                  ログアウト
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">学習した単元</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary?.overall?.totalUnits || 0}</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">完了した単元</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary?.overall?.completedUnits || 0}</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">総学習時間</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatTime(summary?.overall?.totalTimeSpent)}</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">平均スコア</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary?.overall?.averageScore || 0}%</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  学習進捗
                </h2>
                <Link href="/subjects" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                  科目一覧へ
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">全体の進捗率</span>
                  <span className="font-medium text-gray-900">{summary?.overall?.completionRate || 0}%</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${summary?.overall?.completionRate || 0}%` }}
                  />
                </div>
              </div>

              <h3 className="mb-3 text-sm font-medium text-gray-700">最近の学習</h3>
              {loading ? (
                <div className="py-8 text-center text-gray-500">読み込み中...</div>
              ) : summary?.recent?.length > 0 ? (
                <div className="space-y-3">
                  {summary.recent.map((item) => (
                    <Link
                      key={item.unitId}
                      href={item.unit ? `/subjects/${item.unit.subjectId}/${item.unit.id}` : '/subjects'}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${item.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm text-gray-700">{item.unit?.title || `単元 ${item.unitId}`}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {item.score !== undefined && <span>{item.score}点</span>}
                        <span>{formatTime(item.timeSpent)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p>まだ学習履歴がありません</p>
                  <Link href="/subjects" className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Play className="h-4 w-4" />
                    学習を始める
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <h2 className="mb-3 text-lg font-bold">学習を続ける</h2>
                <p className="mb-4 text-sm text-blue-100">
                  {resumeUnit ? '前回の続きからすぐ再開できます。' : '最初の単元から学習を始めましょう。'}
                </p>
                <Link
                  href={resumeUnit ? `/subjects/${resumeUnit.subjectId}/${resumeUnit.id}` : '/subjects'}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Play className="h-5 w-5" />
                  {resumeUnit ? '前回の続きを開く' : '学習を始める'}
                </Link>
              </div>

              {!user?.isPremium && (
                <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-white">
                  <div className="mb-3 flex items-center gap-2">
                    <Crown className="h-6 w-6" />
                    <h2 className="text-lg font-bold">プレミアム会員</h2>
                  </div>
                  <p className="mb-4 text-sm text-yellow-100">
                    全単元、演習、PDF・音声ダウンロード、詳細な学習分析を利用できます。
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 font-medium text-orange-600 transition-colors hover:bg-orange-50"
                  >
                    詳細を見る
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">クイックリンク</h2>
                <div className="space-y-2">
                  <Link href="/subjects" className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">科目一覧</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link href="/mypage/settings" className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">アカウント設定</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
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

export default withAuth(MyPage);
