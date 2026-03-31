import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import { getSubjectById } from '@/features/content/lib/subjects';
import { useAuth } from '@/features/auth/context/AuthContext';
import { hasPremiumAccess, getEntitlementLabel } from '@/shared/lib/entitlements';
import {
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Target,
  FileText,
  Music,
  Lock,
  CheckCircle,
  Crown,
} from 'lucide-react';

function UnitCard({ unit, subjectId, index, progress, isLocked }) {
  const isCompleted = Boolean(progress?.completed);

  if (isLocked) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm text-amber-700">単元 {index + 1}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-amber-700">
                プレミアム限定
              </span>
            </div>
            <h3 className="font-medium text-gray-800">{unit.title}</h3>
            <p className="mt-2 text-sm text-amber-800">
              この単元はプレミアム会員向けです。無料会員でも学習一覧までは確認できます。
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800"
            >
              <Crown className="h-4 w-4" />
              プランを見る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/subjects/${subjectId}/${unit.id}`}>
      <div className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {isCompleted ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-600">
                {unit.type === 'lecture' ? (
                  <BookOpen className="h-5 w-5 text-blue-600 group-hover:text-white" />
                ) : (
                  <Target className="h-5 w-5 text-blue-600 group-hover:text-white" />
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">単元 {index + 1}</span>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${unit.type === 'lecture' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {unit.type === 'lecture' ? '講義' : '演習'}
              </span>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${unit.accessLevel === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {getEntitlementLabel(unit.accessLevel)}
              </span>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${unit.status === 'draft' ? 'bg-gray-100 text-gray-700' : 'bg-slate-100 text-slate-700'}`}>
                {unit.status === 'draft' ? '下書き' : '公開中'}
              </span>
            </div>
            <h3 className="mb-2 font-medium text-gray-800 transition-colors group-hover:text-blue-600">{unit.title}</h3>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                約{unit.estimatedTime}分
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                テキスト
              </span>
              {unit.hasAudio && (
                <span className="flex items-center gap-1">
                  <Music className="h-4 w-4" />
                  音声
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="h-5 w-5 flex-shrink-0 self-center text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600" />
        </div>
      </div>
    </Link>
  );
}

export default function SubjectDetail() {
  const router = useRouter();
  const { subjectId } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [units, setUnits] = useState([]);
  const [progressByUnit, setProgressByUnit] = useState({});
  const [loading, setLoading] = useState(true);

  const subject = getSubjectById(subjectId);

  useEffect(() => {
    if (!subjectId) {
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const unitsRes = await fetch(`/api/content/units?subjectId=${encodeURIComponent(subjectId)}`);
        const unitsData = await unitsRes.json();
        if (unitsRes.ok && unitsData.success) {
          setUnits(unitsData.units);
        }

        if (isAuthenticated) {
          const token = localStorage.getItem('token');
          const progressRes = await fetch('/api/user/progress', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const progressData = await progressRes.json();
          if (progressRes.ok && progressData.success) {
            setProgressByUnit(progressData.byUnit || {});
          }
        } else {
          setProgressByUnit({});
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [subjectId, isAuthenticated]);

  const lectureUnits = useMemo(() => units.filter((unit) => unit.type === 'lecture'), [units]);
  const practiceUnits = useMemo(() => units.filter((unit) => unit.type === 'practice'), [units]);

  const progressStats = useMemo(() => {
    const completed = units.filter((unit) => progressByUnit[unit.id]?.completed).length;
    const total = units.length;
    return {
      completed,
      total,
      percentage: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [units, progressByUnit]);

  if (loading || !subjectId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-12">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">科目が見つかりません</h1>
            <p className="mb-8 text-gray-500">指定された科目は存在しません。</p>
            <Link href="/subjects" className="text-blue-600 hover:text-blue-700">
              科目一覧に戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = subject.icon;
  const premium = hasPremiumAccess(user);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{subject.name} | 行政書士試験対策</title>
        <meta name="description" content={subject.description} />
      </Head>

      <Header />

      <main className="pt-20">
        <section className={`${subject.color} py-12 text-white`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white">ホーム</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/subjects" className="hover:text-white">科目一覧</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{subject.name}</span>
            </nav>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <Icon className="h-10 w-10 text-white" />
              </div>

              <div className="flex-1">
                <h1 className="mb-3 text-3xl font-bold md:text-4xl">{subject.name}</h1>
                <p className="mb-4 text-lg text-white/80">{subject.description}</p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">講義 {lectureUnits.length}単元</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
                    <Target className="h-4 w-4" />
                    <span className="text-sm">演習 {practiceUnits.length}単元</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">約{subject.estimatedHours}時間</span>
                  </div>
                </div>
              </div>

              <div className="min-w-[220px] rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="mb-3 text-center">
                  <span className="text-3xl font-bold">{progressStats.percentage}%</span>
                  <p className="text-sm text-white/70">学習進捗</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: `${progressStats.percentage}%` }} />
                </div>
                <p className="mt-2 text-center text-xs text-white/70">
                  {progressStats.completed} / {progressStats.total} 単元完了
                </p>
                {!premium && (
                  <p className="mt-3 text-xs text-white/80">
                    無料会員では一部講義と進捗管理が利用できます。
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {lectureUnits.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-800">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  講義
                  <span className="text-sm font-normal text-gray-500">({lectureUnits.length}単元)</span>
                </h2>
                <div className="space-y-4">
                  {lectureUnits.map((unit, index) => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      subjectId={subjectId}
                      index={index}
                      progress={progressByUnit[unit.id]}
                      isLocked={unit.accessLevel === 'premium' && !premium}
                    />
                  ))}
                </div>
              </div>
            )}

            {practiceUnits.length > 0 && (
              <div>
                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-800">
                  <Target className="h-6 w-6 text-purple-600" />
                  演習
                  <span className="text-sm font-normal text-gray-500">({practiceUnits.length}単元)</span>
                </h2>
                <div className="space-y-4">
                  {practiceUnits.map((unit, index) => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      subjectId={subjectId}
                      index={lectureUnits.length + index}
                      progress={progressByUnit[unit.id]}
                      isLocked={unit.accessLevel === 'premium' && !premium}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 border-t border-gray-200 pt-8">
              <Link href="/subjects" className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-blue-600">
                <ChevronLeft className="h-5 w-5" />
                科目一覧に戻る
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
