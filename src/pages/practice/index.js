import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock, Target, Zap, Award } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { subjects } from '../../data/subjects';

export default function Practice() {
  const [practiceData, setPracticeData] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    // Mock practice data
    const mockPracticeData = [
      {
        id: 'constitutional-basic',
        title: '憲法基礎問題集',
        subjectId: 'constitutional-law',
        subjectName: '憲法',
        difficulty: 'beginner',
        questionCount: 50,
        estimatedTime: 90,
        topics: ['基本的人権', '国民主権', '平和主義'],
        description: '憲法の基本原理と基本的人権に関する基礎的な問題を集めました。',
        color: 'bg-blue-100 border-blue-300 text-blue-800'
      },
      {
        id: 'constitutional-advanced',
        title: '憲法応用問題集',
        subjectId: 'constitutional-law',
        subjectName: '憲法',
        difficulty: 'advanced',
        questionCount: 30,
        estimatedTime: 120,
        topics: ['統治機構', '人権の制約', '違憲審査制'],
        description: '憲法の統治機構と高度な人権論について学習します。',
        color: 'bg-blue-100 border-blue-300 text-blue-800'
      },
      {
        id: 'administrative-basic',
        title: '行政法基礎問題集',
        subjectId: 'administrative-law',
        subjectName: '行政法',
        difficulty: 'beginner',
        questionCount: 60,
        estimatedTime: 100,
        topics: ['行政行為', '行政手続', '行政救済'],
        description: '行政法の基本概念と行政手続きに関する問題を学習します。',
        color: 'bg-green-100 border-green-300 text-green-800'
      },
      {
        id: 'administrative-advanced',
        title: '行政法応用問題集',
        subjectId: 'administrative-law',
        subjectName: '行政法',
        difficulty: 'advanced',
        questionCount: 40,
        estimatedTime: 150,
        topics: ['行政事件訴訟', '国家賠償', '損失補償'],
        description: '行政救済制度の詳細と実務的な問題を扱います。',
        color: 'bg-green-100 border-green-300 text-green-800'
      },
      {
        id: 'civil-basic',
        title: '民法基礎問題集',
        subjectId: 'civil-law',
        subjectName: '民法',
        difficulty: 'beginner',
        questionCount: 80,
        estimatedTime: 120,
        topics: ['総則', '物権', '債権総論'],
        description: '民法の基本原理と基礎的な制度について学習します。',
        color: 'bg-purple-100 border-purple-300 text-purple-800'
      },
      {
        id: 'commercial-basic',
        title: '商法基礎問題集',
        subjectId: 'commercial-law',
        subjectName: '商法',
        difficulty: 'beginner',
        questionCount: 40,
        estimatedTime: 80,
        topics: ['会社法', '手形法', '保険法'],
        description: '商法の基本的な制度と概念を学習します。',
        color: 'bg-orange-100 border-orange-300 text-orange-800'
      },
      {
        id: 'general-knowledge',
        title: '一般知識問題集',
        subjectId: 'general-knowledge',
        subjectName: '一般知識',
        difficulty: 'intermediate',
        questionCount: 60,
        estimatedTime: 90,
        topics: ['政治・経済', '情報通信', '文章理解'],
        description: '一般知識分野の幅広い問題を学習します。',
        color: 'bg-gray-100 border-gray-300 text-gray-800'
      }
    ];

    // Mock user stats
    const mockUserStats = {
      'constitutional-basic': { completed: true, score: 85, attempts: 2 },
      'administrative-basic': { completed: true, score: 78, attempts: 1 },
      'civil-basic': { completed: false, score: 0, attempts: 0 },
      'commercial-basic': { completed: false, score: 0, attempts: 0 },
      'general-knowledge': { completed: true, score: 92, attempts: 1 }
    };

    setPracticeData(mockPracticeData);
    setUserStats(mockUserStats);
  }, []);

  const filteredPractice = selectedSubject === 'all'
    ? practiceData
    : practiceData.filter(practice => practice.subjectId === selectedSubject);

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'intermediate':
        return <Target className="w-4 h-4 text-yellow-600" />;
      case 'advanced':
        return <Award className="w-4 h-4 text-red-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      default: return '';
    }
  };

  const getProgressStats = () => {
    const completed = Object.values(userStats).filter(stat => stat.completed).length;
    const total = practiceData.length;
    const avgScore = completed > 0
      ? Math.round(Object.values(userStats)
          .filter(stat => stat.completed)
          .reduce((sum, stat) => sum + stat.score, 0) / completed)
      : 0;
    
    return { completed, total, avgScore };
  };

  const { completed, total, avgScore } = getProgressStats();

  return (
    <>
      <Head>
        <title>問題演習 - 行政書士試験対策オンライン学習システム</title>
        <meta name="description" content="行政書士試験の問題演習。各科目ごとの練習問題で実戦力を身につけましょう。" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto pt-20 pb-12 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">問題演習</h1>
            <p className="text-gray-600">
              各科目の問題集で実戦的な練習を行いましょう。解説付きで理解を深めながら実力を向上させることができます。
            </p>
          </div>

          {/* 進捗サマリー */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">学習進捗</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-blue-600 text-sm font-medium">完了した問題集</p>
                    <p className="text-2xl font-bold text-blue-900">{completed}/{total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-green-600 text-sm font-medium">平均スコア</p>
                    <p className="text-2xl font-bold text-green-900">{avgScore}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-purple-600 text-sm font-medium">完了率</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {total > 0 ? Math.round((completed / total) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 科目フィルター */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubject('all')}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  selectedSubject === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                全て
              </button>
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    selectedSubject === subject.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>

          {/* 問題集一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractice.map((practice) => {
              const stats = userStats[practice.id] || { completed: false, score: 0, attempts: 0 };
              
              return (
                <div
                  key={practice.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getDifficultyIcon(practice.difficulty)}
                        <span className="text-sm font-medium text-gray-600">
                          {getDifficultyLabel(practice.difficulty)}
                        </span>
                      </div>
                      {stats.completed && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">完了</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{practice.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{practice.description}</p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {practice.topics.map((topic, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-xs font-medium ${practice.color}`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{practice.questionCount}問</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{practice.estimatedTime}分</span>
                      </span>
                    </div>

                    {stats.completed && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>スコア: <span className="font-semibold">{stats.score}%</span></span>
                          <span>挑戦回数: {stats.attempts}回</span>
                        </div>
                      </div>
                    )}

                    <Link href={`/practice/${practice.id}`}>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                        {stats.completed ? '再挑戦する' : '開始する'}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 学習のヒント */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">💡 問題演習のコツ</h2>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• まずは基礎問題から順番に取り組みましょう</li>
              <li>• 間違えた問題は解説をしっかり読んで理解しましょう</li>
              <li>• 定期的に復習して知識の定着を図りましょう</li>
              <li>• 時間を意識して本番に近い形で練習しましょう</li>
            </ul>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
