import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import { getSubjectById } from '@/features/content/lib/subjects';
import contentManager from '@/features/content/lib/contentManager';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  FileText,
  Download,
  BookOpen,
  Clock,
  CheckCircle,
  List,
  X,
  Menu,
  Bookmark,
  Share2,
  Printer
} from 'lucide-react';

// Audio Player Component
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
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const skip = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={changePlaybackRate}
            className="px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700 rounded transition-colors"
          >
            {playbackRate}x
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => skip(-10)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          <button
            onClick={() => skip(10)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Table of Contents Component
function TableOfContents({ sections, activeSection, onSectionClick }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <List className="w-5 h-5" />
        目次
      </h3>
      <nav className="space-y-2">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => onSectionClick(index)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeSection === index
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function UnitPage() {
  const router = useRouter();
  const { subjectId, unitId } = router.query;
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const contentRef = useRef(null);

  const subject = getSubjectById(subjectId);

  useEffect(() => {
    if (unitId) {
      loadUnit();
    }
  }, [unitId]);

  const loadUnit = async () => {
    setLoading(true);
    try {
      const data = await contentManager.getUnit(unitId);
      setUnit(data);
    } catch (error) {
      console.error('Failed to load unit:', error);
    } finally {
      setLoading(false);
    }
  };

  // Find current unit index and navigation
  const currentUnitIndex = subject?.units?.findIndex(u => u.id === unitId) ?? -1;
  const prevUnit = currentUnitIndex > 0 ? subject?.units[currentUnitIndex - 1] : null;
  const nextUnit = currentUnitIndex < (subject?.units?.length || 0) - 1 
    ? subject?.units[currentUnitIndex + 1] 
    : null;

  if (loading || !subjectId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">単元が見つかりません</h1>
            <p className="text-gray-500 mb-8">指定された単元は存在しないか、まだ作成されていません。</p>
            <Link href={`/subjects/${subjectId}`} className="text-blue-600 hover:text-blue-700">
              科目ページに戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sections = unit.content?.sections || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{unit.title} | {subject?.name} | 行政書士試験対策</title>
        <meta name="description" content={unit.content?.introduction || unit.title} />
      </Head>

      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 pt-4 flex-wrap">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/subjects" className="hover:text-blue-600">科目一覧</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/subjects/${subjectId}`} className="hover:text-blue-600">
              {subject?.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800">{unit.title}</span>
          </nav>

          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Unit Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {unit.type === 'lecture' ? '講義' : '演習'}
                      </span>
                      <span className="text-sm text-gray-500">
                        単元 {currentUnitIndex + 1}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {unit.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    約{unit.estimatedTime || 30}分
                  </span>
                  {unit.hasAudio && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Volume2 className="w-4 h-4" />
                      音声あり
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    テキストあり
                  </span>
                </div>
              </div>

              {/* Audio Player */}
              {unit.hasAudio && (
                <div className="mb-6">
                  <AudioPlayer audioUrl={unit.audioUrl || '/audio/sample.mp3'} />
                </div>
              )}

              {/* Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8" ref={contentRef}>
                {/* Introduction */}
                {unit.content?.introduction && (
                  <div className="mb-8 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                    <p className="text-gray-700">{unit.content.introduction}</p>
                  </div>
                )}

                {/* Sections */}
                <div className="prose prose-lg max-w-none">
                  {sections.map((section, index) => (
                    <div key={index} id={`section-${index}`} className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        {section.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {section.content}
                      </p>
                      
                      {/* Subsections */}
                      {section.subsections?.map((sub, subIndex) => (
                        <div key={subIndex} className="ml-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {sub.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Key Points */}
                {unit.content?.keyPoints && unit.content.keyPoints.length > 0 && (
                  <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-yellow-600" />
                      重要ポイント
                    </h3>
                    <ul className="space-y-2">
                      {unit.content.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                            {index + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conclusion */}
                {unit.content?.conclusion && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-800 mb-2">まとめ</h3>
                    <p className="text-gray-700">{unit.content.conclusion}</p>
                  </div>
                )}
              </div>

              {/* Unit Navigation */}
              <div className="mt-8 flex items-center justify-between">
                {prevUnit ? (
                  <Link
                    href={`/subjects/${subjectId}/${prevUnit.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">前の単元</p>
                      <p className="text-sm font-medium text-gray-800">{prevUnit.title}</p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextUnit ? (
                  <Link
                    href={`/subjects/${subjectId}/${nextUnit.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <div className="text-right">
                      <p className="text-xs text-blue-200">次の単元</p>
                      <p className="text-sm font-medium">{nextUnit.title}</p>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    href={`/subjects/${subjectId}`}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>科目完了！</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar - Table of Contents */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <TableOfContents
                  sections={sections}
                  activeSection={activeSection}
                  onSectionClick={(index) => {
                    const element = document.getElementById(`section-${index}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setActiveSection(index);
                    }
                  }}
                />

                {/* Related Units */}
                {unit.relatedUnits && unit.relatedUnits.length > 0 && (
                  <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="font-bold text-gray-800 mb-4">関連する単元</h3>
                    <div className="space-y-2">
                      {unit.relatedUnits.slice(0, 3).map((related) => (
                        <Link
                          key={related.id}
                          href={`/subjects/${subjectId}/${related.id}`}
                          className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
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

          {/* Mobile TOC Button */}
          <button
            onClick={() => setShowToc(true)}
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile TOC Modal */}
          {showToc && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
              <div className="bg-white w-full max-h-[70vh] rounded-t-2xl overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">目次</h3>
                  <button onClick={() => setShowToc(false)}>
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="p-4">
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const element = document.getElementById(`section-${index}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            setActiveSection(index);
                          }
                          setShowToc(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                      >
                        {section.title}
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
