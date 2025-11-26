import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { subjects } from '../../data/subjects';
import {
  Clock,
  BookOpen,
  ChevronRight,
  Target,
  TrendingUp
} from 'lucide-react';

// Subject Card Component
function SubjectCard({ subject }) {
  const Icon = subject.icon;
  const totalUnits = subject.units?.length || 0;
  const lectureUnits = subject.units?.filter(u => u.type === 'lecture').length || 0;
  const practiceUnits = subject.units?.filter(u => u.type === 'practice').length || 0;

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      beginner: '初級',
      intermediate: '中級',
      advanced: '上級'
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Link href={`/subjects/${subject.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${subject.color}`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(subject.difficulty)}`}>
            {getDifficultyLabel(subject.difficulty)}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {subject.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {subject.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>講義 {lectureUnits}単元</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Target className="w-4 h-4 text-purple-500" />
            <span>演習 {practiceUnits}単元</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-green-500" />
            <span>約{subject.estimatedHours}時間</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span>全{totalUnits}単元</span>
          </div>
        </div>

        {/* Progress Bar (placeholder) */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">学習進捗</span>
            <span className="font-medium text-gray-700">0%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
            学習を始める
          </span>
          <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

// Stats Card
function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  // Calculate totals
  const totalUnits = subjects.reduce((sum, s) => sum + (s.units?.length || 0), 0);
  const totalHours = subjects.reduce((sum, s) => sum + s.estimatedHours, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>科目一覧 | 行政書士試験対策</title>
        <meta name="description" content="行政書士試験の全科目を一覧で確認。憲法、行政法、民法など各科目の学習を始めましょう。" />
      </Head>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                科目一覧
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                行政書士試験に必要な全科目を体系的に学習できます。
                各科目の講義と演習で効率的に知識を身につけましょう。
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{subjects.length}</p>
                <p className="text-sm text-blue-100">科目</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{totalUnits}</p>
                <p className="text-sm text-blue-100">単元</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{totalHours}</p>
                <p className="text-sm text-blue-100">学習時間</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">0%</p>
                <p className="text-sm text-blue-100">進捗率</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subjects Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category: 法律科目 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                法律科目
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects
                  .filter(s => s.category === 'law')
                  .map(subject => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))
                }
              </div>
            </div>

            {/* Category: 一般知識 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-purple-600 rounded-full"></span>
                一般知識等
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects
                  .filter(s => s.category === 'general')
                  .map(subject => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))
                }
              </div>
            </div>
          </div>
        </section>

        {/* Study Tips */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              効果的な学習のポイント
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">基礎から着実に</h3>
                <p className="text-sm text-gray-500">
                  各科目の基本原理をしっかり理解してから応用に進みましょう。
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">音声で繰り返し</h3>
                <p className="text-sm text-gray-500">
                  通勤時間や隙間時間に音声学習で知識を定着させましょう。
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">演習で確認</h3>
                <p className="text-sm text-gray-500">
                  講義の後は演習問題で理解度をチェックしましょう。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
