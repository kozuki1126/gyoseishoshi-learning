import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import HtmlContentRenderer from '@/features/content/components/HtmlContentRenderer';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import { getSubjectById } from '@/features/content/lib/subjects';
import { useAuth } from '@/features/auth/context/AuthContext';
import { hasPremiumAccess } from '@/shared/lib/entitlements';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Gavel,
  GitBranch,
  History,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Lightbulb,
  Link as LinkIcon,
  Volume2,
  VolumeX,
  FileText,
  Download,
  Clock,
  CheckCircle,
  List,
  School,
  X,
  Menu,
  Bookmark,
  Share2,
  Printer,
  Crown,
  AlertTriangle,
} from 'lucide-react';

const ANCHOR_SCROLL_OFFSET = 112;

function headingId(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="rounded-xl bg-gray-800 p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={(event) => {
            const nextTime = Number(event.target.value);
            setCurrentTime(nextTime);
            if (audioRef.current) {
              audioRef.current.currentTime = nextTime;
            }
          }}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-600 accent-blue-500"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!audioRef.current) {
                return;
              }
              audioRef.current.muted = !isMuted;
              setIsMuted((prev) => !prev);
            }}
            className="p-2 text-gray-400 transition-colors hover:text-white"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              const rates = [0.75, 1, 1.25, 1.5, 2];
              const currentIndex = rates.indexOf(playbackRate);
              const nextRate = rates[(currentIndex + 1) % rates.length];
              setPlaybackRate(nextRate);
              if (audioRef.current) {
                audioRef.current.playbackRate = nextRate;
              }
            }}
            className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400 transition-colors hover:text-white"
          >
            {playbackRate}x
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, currentTime - 10);
              }
            }}
            className="p-2 text-gray-400 transition-colors hover:text-white"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-1 h-5 w-5" />}
          </button>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(duration, currentTime + 10);
              }
            }}
            className="p-2 text-gray-400 transition-colors hover:text-white"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <a href={audioUrl} download className="p-2 text-gray-400 transition-colors hover:text-white">
          <Download className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}

function TocMaterialIcon({ iconName }) {
  const iconClassName = 'mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600';
  const iconMap = {
    history: History,
    link: LinkIcon,
    auto_stories: BookOpen,
    gavel: Gavel,
    school: School,
    account_tree: GitBranch,
    lightbulb: Lightbulb,
    warning: AlertTriangle,
  };

  const Icon = iconMap[iconName];
  return Icon ? <Icon className={iconClassName} /> : null;
}

function TableOfContents({ sections, activeSection, onSectionClick }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
        <List className="h-5 w-5" />
        目次
      </h3>
      <nav className="space-y-2">
        {sections.map((section, index) => (
          <button
            key={`${section.id}-${index}`}
            onClick={() => onSectionClick(index)}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              activeSection === index ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-start gap-2">
              {section.number ? (
                <span className="min-w-7 rounded bg-blue-600 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-5 text-white">
                  {section.number}
                </span>
              ) : null}
              {section.iconName ? <TocMaterialIcon iconName={section.iconName} /> : null}
              <span>{section.title}</span>
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function UnitPage() {
  const router = useRouter();
  const { subjectId, unitId } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [unitProgress, setUnitProgress] = useState(null);
  const [scoreInput, setScoreInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const sessionSecondsRef = useRef(0);
  const contentReadyRef = useRef(false);
  const contentRendererRef = useRef(null);

  const subject = getSubjectById(subjectId);
  const sections = useMemo(() => unit?.content?.sections || [], [unit?.content?.sections]);
  const premium = hasPremiumAccess(user);
  const adminPreview = router.query.adminPreview === '1';

  const scrollToSection = useCallback((index) => {
    const targetId = sections[index]?.id;
    if (!targetId) {
      return;
    }

    if (unit?.contentFormat === 'html') {
      contentRendererRef.current?.scrollToHeading(targetId, ANCHOR_SCROLL_OFFSET);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - ANCHOR_SCROLL_OFFSET;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth',
        });
      }
    }

    setActiveSection(index);
  }, [sections, unit?.contentFormat]);

  const persistProgress = useCallback(async ({ completed, score, silent = false } = {}) => {
    if (!isAuthenticated || !unitId) {
      return;
    }

    const token = localStorage.getItem('token');
    const nextTimeSpent = Number(unitProgress?.timeSpent || 0) + sessionSecondsRef.current;
    sessionSecondsRef.current = 0;

    const response = await fetch('/api/user/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        unitId,
        completed: completed ?? unitProgress?.completed ?? false,
        score: score ?? (scoreInput === '' ? unitProgress?.score : Number(scoreInput)),
        timeSpent: nextTimeSpent,
        currentPosition: activeSection,
      }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      setUnitProgress(data.progress);
      if (!silent) {
        setSaveMessage('進捗を保存しました');
      }
    } else if (!silent) {
      setSaveMessage(data.error || '進捗の保存に失敗しました');
    }
  }, [activeSection, isAuthenticated, scoreInput, unitId, unitProgress]);

  useEffect(() => {
    contentReadyRef.current = false;
    sessionSecondsRef.current = 0;
    setUnitProgress(null);
    setScoreInput('');
  }, [unitId]);

  useEffect(() => {
    if (!unitId) {
      return;
    }

    async function load() {
      setLoading(true);
      setSaveMessage('');

      const headers = {};
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const hasAdminPreviewSession =
        adminPreview &&
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem('admin-unit-preview') === '1';

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      if (hasAdminPreviewSession) {
        headers['X-Admin-Preview'] = '1';
      }

      try {
        const params = new URLSearchParams();
        if (adminPreview) {
          params.set('adminPreview', '1');
        }

        const unitRes = await fetch(
          `/api/content/units/${encodeURIComponent(unitId)}${params.toString() ? `?${params.toString()}` : ''}`,
          { headers }
        );
        const unitData = await unitRes.json();

        if (hasAdminPreviewSession && unitRes.ok) {
          window.sessionStorage.removeItem('admin-unit-preview');
        }

        if (!unitRes.ok) {
          setUnit({
            locked: unitRes.status === 403,
            error: unitData.error,
            preview: unitData.unit || null,
          });
          return;
        }

        setUnit(unitData.unit);

        if (token) {
          const progressRes = await fetch(`/api/user/progress?unitId=${encodeURIComponent(unitId)}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const progressData = await progressRes.json();
          if (progressRes.ok && progressData.success) {
            setUnitProgress(progressData.progress);
            setScoreInput(progressData.progress?.score !== undefined ? String(progressData.progress.score) : '');
          }

          await fetch('/api/user/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              unitId,
              currentPosition: progressData?.progress?.currentPosition || 0,
              timeSpent: progressData?.progress?.timeSpent || 0,
            }),
          });
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [adminPreview, unitId]);

  useEffect(() => {
    if (!isAuthenticated || !unit || unit.locked) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      sessionSecondsRef.current += 15;
      persistProgress({ silent: true });
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, persistProgress, unit]);

  useEffect(() => {
    if (!unit || contentReadyRef.current || unit.locked || !sections.length) {
      return;
    }

    if (typeof unitProgress?.currentPosition === 'number') {
      window.setTimeout(() => {
        scrollToSection(unitProgress.currentPosition);
      }, 200);
    }

    contentReadyRef.current = true;
  }, [scrollToSection, sections.length, unit, unitProgress?.currentPosition]);

  const currentUnitIndex = subject?.units?.findIndex((candidate) => candidate.id === unitId) ?? -1;
  const prevUnit = currentUnitIndex > 0 ? subject?.units[currentUnitIndex - 1] : null;
  const nextUnit = currentUnitIndex < (subject?.units?.length || 0) - 1 ? subject?.units[currentUnitIndex + 1] : null;

  if (loading || !subjectId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (unit?.locked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-12">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Crown className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">{unit.preview?.title || 'プレミアム限定コンテンツ'}</h1>
            <p className="mb-8 text-gray-600">{unit.error}</p>
            <div className="flex justify-center gap-4">
              <Link href="/pricing" className="rounded-xl bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600">
                プレミアムプランを見る
              </Link>
              <Link href={`/subjects/${subjectId}`} className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50">
                科目ページへ戻る
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-12">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">単元が見つかりません</h1>
            <p className="mb-8 text-gray-500">指定された単元は存在しないか、まだ作成されていません。</p>
            <Link href={`/subjects/${subjectId}`} className="text-blue-600 hover:text-blue-700">
              科目ページに戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{unit.title} | {subject?.name} | 行政書士試験対策</title>
        <meta name="description" content={unit.content?.summary || unit.title} />
      </Head>

      <Header />

      <main className="pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 pt-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/subjects" className="hover:text-blue-600">科目一覧</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/subjects/${subjectId}`} className="hover:text-blue-600">{subject?.name}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-800">{unit.title}</span>
          </nav>

          <div className="flex gap-8">
            <div className="min-w-0 flex-1">
              <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded px-2 py-1 text-xs font-medium ${unit.type === 'lecture' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {unit.type === 'lecture' ? '講義' : '演習'}
                      </span>
                      <span className={`rounded px-2 py-1 text-xs font-medium ${unit.accessLevel === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {unit.accessLevel === 'premium' ? 'プレミアム限定' : '無料公開'}
                      </span>
                      <span className="text-sm text-gray-500">単元 {currentUnitIndex + 1}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">{unit.title}</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 transition-colors hover:text-gray-600"><Bookmark className="h-5 w-5" /></button>
                    <button className="p-2 text-gray-400 transition-colors hover:text-gray-600"><Share2 className="h-5 w-5" /></button>
                    <button className="p-2 text-gray-400 transition-colors hover:text-gray-600"><Printer className="h-5 w-5" /></button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    約{unit.estimatedTime || 30}分
                  </span>
                  {unit.hasAudio && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Volume2 className="h-4 w-4" />
                      音声あり
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    テキストあり
                  </span>
                  {unit.hasPdf && premium && (
                    <a href={unit.pdfUrl} download className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700">
                      <Download className="h-4 w-4" />
                      PDFをダウンロード
                    </a>
                  )}
                </div>

                {isAuthenticated ? (
                  <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                    前回の続き: {typeof unitProgress?.currentPosition === 'number' ? `目次 ${unitProgress.currentPosition + 1} から再開` : 'この単元は初回学習です'}
                    {saveMessage ? <span className="ml-3 font-medium">{saveMessage}</span> : null}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    ログインすると学習時間、完了状況、演習スコアを保存できます。
                  </div>
                )}
              </div>

              {unit.hasAudio && <div className="mb-6"><AudioPlayer audioUrl={unit.audioUrl || '/audio/sample.mp3'} /></div>}

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                {unit.contentFormat === 'html' ? (
                  <HtmlContentRenderer
                    ref={contentRendererRef}
                    html={unit.content?.html || ''}
                    css={unit.content?.css || ''}
                    stylesheets={unit.content?.stylesheets || []}
                  />
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ node, className = '', ...props }) => (
                          <h2
                            id={headingId(String(props.children))}
                            className={`scroll-mt-28 ${className}`.trim()}
                            {...props}
                          />
                        ),
                        h3: ({ node, className = '', ...props }) => (
                          <h3
                            id={headingId(String(props.children))}
                            className={`scroll-mt-28 ${className}`.trim()}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {unit.content?.markdown || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => persistProgress({ completed: true })}
                      className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
                    >
                      完了として記録
                    </button>
                    {unit.type === 'practice' && (
                      <>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={scoreInput}
                          onChange={(event) => setScoreInput(event.target.value)}
                          placeholder="演習スコア"
                          className="rounded-xl border border-gray-200 px-4 py-3"
                        />
                        <button
                          onClick={() => persistProgress({ score: Number(scoreInput) })}
                          className="rounded-xl border border-blue-200 px-5 py-3 font-medium text-blue-700 hover:bg-blue-50"
                        >
                          スコアを保存
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                {prevUnit ? (
                  <Link
                    href={`/subjects/${subjectId}/${prevUnit.id}`}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">前の単元</p>
                      <p className="text-sm font-medium text-gray-800">{prevUnit.title}</p>
                    </div>
                  </Link>
                ) : <div />}

                {nextUnit ? (
                  <Link
                    href={`/subjects/${subjectId}/${nextUnit.id}`}
                    onClick={() => persistProgress({ silent: true })}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    <div className="text-right">
                      <p className="text-xs text-blue-200">次の単元</p>
                      <p className="text-sm font-medium">{nextUnit.title}</p>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    href={`/subjects/${subjectId}`}
                    onClick={() => persistProgress({ completed: true, silent: true })}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>科目完了！</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden w-72 flex-shrink-0 lg:block">
              <div className="sticky top-24">
                <TableOfContents
                  sections={sections}
                  activeSection={activeSection}
                  onSectionClick={scrollToSection}
                />

                {unit.relatedUnits?.length > 0 && (
                  <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="mb-4 font-bold text-gray-800">関連する単元</h3>
                    <div className="space-y-2">
                      {unit.relatedUnits.slice(0, 3).map((related) => (
                        <Link
                          key={related.id}
                          href={`/subjects/${subjectId}/${related.id}`}
                          className="block rounded-lg p-2 transition-colors hover:bg-gray-50"
                        >
                          <p className="text-sm font-medium text-gray-800">{related.title}</p>
                          <p className="text-xs text-gray-500">
                            {related.type === 'lecture' ? '講義' : '演習'} • 約{related.estimatedTime || 30}分
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowToc(true)}
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {showToc && (
            <div className="fixed inset-0 z-50 flex items-end bg-black/50 lg:hidden">
              <div className="max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-white">
                <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4">
                  <h3 className="font-bold text-gray-800">目次</h3>
                  <button onClick={() => setShowToc(false)}>
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <div className="p-4">
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <button
                        key={`${section.id}-${index}`}
                        onClick={() => {
                          scrollToSection(index);
                          setShowToc(false);
                        }}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <span className="flex items-start gap-2">
                          {section.number ? (
                            <span className="min-w-7 rounded bg-blue-600 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-5 text-white">
                              {section.number}
                            </span>
                          ) : null}
                          {section.iconName ? <TocMaterialIcon iconName={section.iconName} /> : null}
                          <span>{section.title}</span>
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
