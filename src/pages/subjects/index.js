import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, Clock, CheckCircle2, Play, Lock, Award } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { subjects } from '../../data/subjects';

export default function Subjects() {
  const [userProgress, setUserProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate loading user progress
    const mockProgress = {
      'constitutional-law': { completed: 5, total: 12, score: 85 },
      'administrative-law': { completed: 3, total: 15, score: 78 },
      'civil-law': { completed: 2, total: 18, score: 72 },
      'commercial-law': { completed: 0, total: 8, score: 0 },
      'general-knowledge': { completed: 1, total: 10, score: 90 }
    };
    setUserProgress(mockProgress);
  }, []);

  const categories = [
    { id: 'all', name: '全て', count: subjects.length },
    { id: 'law', name: '法律科目', count: subjects.filter(s => s.category === 'law').length },
    { id: 'general', name: '一般知識', count: subjects.filter(s => s.category === 'general').length }
  ];

  const filteredSubjects = selectedCategory === 'all' 
    ? subjects 
    : subjects.filter(subject => subject.category === selectedCategory);

  const getProgressPercentage = (subjectId) => {
    const progress = userProgress[subjectId];
    if (!progress) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return '初級';
      case 'intermediate':
        return '中級';
      case 'advanced':
        return '上級';
      default:
        return '未設定';
    }
  };

  const getStatusIcon = (subjectId) => {
    const progress = userProgress[subjectId];
    if (!progress || progress.completed === 0) {
      return <Lock className="w-5 h-5 text-gray-400" />;
    } else if (progress.completed === progress.total) {
      return <Award className="w-5 h-5 text-yellow-500" />;
    } else {
      return <Play className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <>
      <Head>
        <title>科目一覧 - 行政書士試験対策オンライン学習システム</title>
        <meta name="description" content="行政書士試験の各科目を学習。憲法、行政法、民法等の法律科目から一般知識まで網羅的にカバーしています。" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto pt-20 pb-12 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">科目一覧</h1>
            <p className="text-gray-600">
              行政書士試験に必要な全科目を系統的に学習できます。各科目の進捗状況やスコアを確認しながら効率的に学習を進めましょう。
            </p>
          </div>

          {/* カテゴリーフィルター */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* 進捗サマリー */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">学習進捗サマリー</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-blue-600 text-sm font-medium">総学習科目</p>
                    <p className="text-2xl font-bold text-blue-900">{subjects.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-green-600 text-sm font-medium">完了科目</p>
                    <p className="text-2xl font-bold text-green-900">
                      {Object.values(userProgress).filter(p => p.completed === p.total).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-orange-600 text-sm font-medium">進行中科目</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {Object.values(userProgress).filter(p => p.completed > 0 && p.completed < p.total).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 科目グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => {
              const progress = userProgress[subject.id];
              const progressPercentage = getProgressPercentage(subject.id);
              const isUnlocked = !progress || progress.completed > 0;

              return (
                <div
                  key={subject.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition duration-200 ${
                    isUnlocked ? 'hover:shadow-lg cursor-pointer' : 'opacity-75'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${subject.color}`}>
                          <subject.icon className="w-6 h-6 text-white" />
                        </div>
                        {getStatusIcon(subject.id)}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(subject.difficulty)}`}
                      >
                        {getDifficultyLabel(subject.difficulty)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{subject.description}</p>

                    {progress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>進捗</span>
                          <span>{progress.completed}/{progress.total} 完了</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        {progress.score > 0 && (
                          <p className="text-sm text-gray-600 mt-2">
                            平均スコア: <span className="font-semibold">{progress.score}%</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{subject.estimatedHours}時間</span>
                      </span>
                      <span>{subject.units?.length || 0}ユニット</span>
                    </div>

                    {isUnlocked ? (
                      <Link href={`/subjects/${subject.id}`}>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                          {progress && progress.completed > 0 ? '続きから学習' : '学習開始'}
                        </button>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        ロック中
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 学習のヒント */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">💡 学習のヒント</h2>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• 憲法から始めて、行政法、民法と基礎的な法律科目を順番に学習しましょう</li>
              <li>• 各科目の基礎ユニットを完了してから応用ユニットに進むことをお勧めします</li>
              <li>• 問題演習では間違えた問題をAI解説でしっかり理解しましょう</li>
              <li>• 定期的に復習ユニットで知識の定着を確認しましょう</li>
            </ul>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
