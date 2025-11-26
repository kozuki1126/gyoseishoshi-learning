import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { subjects, getSubjectById } from '../../data/subjects';
import {
  Clock,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Target,
  Play,
  FileText,
  Music,
  Lock,
  CheckCircle,
  Circle
} from 'lucide-react';

// Unit Card Component
function UnitCard({ unit, subjectId, index, isLocked = false }) {
  const getTypeIcon = (type) => {
    return type === 'lecture' ? BookOpen : Target;
  };

  const getTypeBadge = (type) => {
    return type === 'lecture' 
      ? { label: '講義', color: 'bg-blue-100 text-blue-700' }
      : { label: '演習', color: 'bg-purple-100 text-purple-700' };
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      beginner: { label: '初級', color: 'bg-green-100 text-green-700' },
      intermediate: { label: '中級', color: 'bg-yellow-100 text-yellow-700' },
      advanced: { label: '上級', color: 'bg-red-100 text-red-700' }
    };
    return badges[difficulty] || badges.beginner;
  };

  const TypeIcon = getTypeIcon(unit.type);
  const typeBadge = getTypeBadge(unit.type);
  const diffBadge = getDifficultyBadge(unit.difficulty);

  // Mock completion status
  const isCompleted = false;

  if (isLocked) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 opacity-60">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-400">単元 {index + 1}</span>
            </div>
            <h3 className="font-medium text-gray-400 mb-2">{unit.title}</h3>
            <p className="text-sm text-gray-400">
              プレミアム会員限定コンテンツです
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/subjects/${subjectId}/${unit.id}`}>
      <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {isCompleted ? (
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <TypeIcon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-400">単元 {index + 1}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeBadge.color}`}>
                {typeBadge.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${diffBadge.color}`}>
                {diffBadge.label}
              </span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {unit.title}
            </h3>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                約30分
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                テキスト
              </span>
              <span className="flex items-center gap-1">
                <Music className="w-4 h-4" />
                音声
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 self-center">
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SubjectDetail() {
  const router = useRouter();
  const { subjectId } = router.query;

  // Get subject data
  const subject = getSubjectById(subjectId);

  // If subject not found
  if (!subjectId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">科目が見つかりません</h1>
            <p className="text-gray-500 mb-8">指定された科目は存在しません。</p>
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
  const lectureUnits = subject.units?.filter(u => u.type === 'lecture') || [];
  const practiceUnits = subject.units?.filter(u => u.type === 'practice') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{subject.name} | 行政書士試験対策</title>
        <meta name="description" content={subject.description} />
      </Head>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className={`${subject.color} text-white py-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link href="/" className="hover:text-white">ホーム</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/subjects" className="hover:text-white">科目一覧</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{subject.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Icon */}
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Icon className="w-10 h-10 text-white" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{subject.name}</h1>
                <p className="text-lg text-white/80 mb-4">{subject.description}</p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">講義 {lectureUnits.length}単元</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">演習 {practiceUnits.length}単元</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">約{subject.estimatedHours}時間</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 min-w-[200px]">
                <div className="text-center mb-3">
                  <span className="text-3xl font-bold">0%</span>
                  <p className="text-sm text-white/70">学習進捗</p>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '0%' }} />
                </div>
                <p className="text-xs text-white/70 text-center mt-2">
                  0 / {subject.units?.length || 0} 単元完了
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Units List */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Lecture Units */}
            {lectureUnits.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  講義
                  <span className="text-sm font-normal text-gray-500">
                    ({lectureUnits.length}単元)
                  </span>
                </h2>
                <div className="space-y-4">
                  {lectureUnits.map((unit, index) => (
                    <UnitCard 
                      key={unit.id} 
                      unit={unit} 
                      subjectId={subjectId}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Practice Units */}
            {practiceUnits.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-600" />
                  演習
                  <span className="text-sm font-normal text-gray-500">
                    ({practiceUnits.length}単元)
                  </span>
                </h2>
                <div className="space-y-4">
                  {practiceUnits.map((unit, index) => (
                    <UnitCard 
                      key={unit.id} 
                      unit={unit} 
                      subjectId={subjectId}
                      index={lectureUnits.length + index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/subjects"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
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
