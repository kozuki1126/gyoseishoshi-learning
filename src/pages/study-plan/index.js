import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Calendar, Clock, Target, BookOpen, CheckCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function StudyPlan() {
  const [user] = useState({
    name: '山田太郎',
    targetExamDate: '2025年11月',
    studyGoal: 'current-year',
    currentProgress: 35,
    studyDaysPerWeek: 5,
    studyHoursPerDay: 3
  });

  const [studyPlan, setStudyPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateStudyPlan();
  }, []);

  const generateStudyPlan = async () => {
    setIsGenerating(true);
    // Simulate AI-generated study plan
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const plan = {
      totalDaysRemaining: 210,
      totalStudyHours: 450,
      planSections: [
        {
          title: '基礎知識習得期間',
          duration: '8週間',
          period: '2025年5月 - 6月',
          subjects: ['憲法', '行政法基礎', '民法基礎'],
          goals: [
            '憲法の基本原則と人権の理解',
            '行政法の基本概念の習得',
            '民法の基本原理の理解'
          ]
        },
        {
          title: '実力向上期間',
          duration: '12週間',
          period: '2025年7月 - 9月',
          subjects: ['行政法発展', '地方自治法', '商法', '一般知識'],
          goals: [
            '行政法の応用問題への対応',
            '地方自治法の詳細理解',
            '商法の基本制度の習得',
            '一般知識の幅広い学習'
          ]
        },
        {
          title: '総仕上げ期間',
          duration: '6週間',
          period: '2025年10月 - 11月',
          subjects: ['全科目総復習', '過去問演習', '模擬試験'],
          goals: [
            '全科目の総復習',
            '過去問での実戦練習',
            '模擬試験での最終確認'
          ]
        }
      ],
      weeklySchedule: [
        { day: '月曜日', time: '19:00-22:00', subject: '憲法', type: 'lecture' },
        { day: '火曜日', time: '19:00-22:00', subject: '行政法', type: 'lecture' },
        { day: '水曜日', time: '19:00-21:00', subject: '復習', type: 'review' },
        { day: '木曜日', time: '19:00-22:00', subject: '民法', type: 'lecture' },
        { day: '金曜日', time: '19:00-22:00', subject: '問題演習', type: 'practice' },
        { day: '土曜日', time: '09:00-12:00', subject: '週次復習', type: 'review' },
        { day: '日曜日', time: '休息日', subject: '-', type: 'rest' }
      ]
    };
    
    setStudyPlan(plan);
    setIsGenerating(false);
  };

  const getSubjectColor = (subject) => {
    const colors = {
      '憲法': 'bg-blue-100 text-blue-800',
      '行政法': 'bg-green-100 text-green-800',
      '民法': 'bg-purple-100 text-purple-800',
      '地方自治法': 'bg-orange-100 text-orange-800',
      '商法': 'bg-pink-100 text-pink-800',
      '一般知識': 'bg-gray-100 text-gray-800',
      '復習': 'bg-yellow-100 text-yellow-800',
      '問題演習': 'bg-red-100 text-red-800',
      '週次復習': 'bg-indigo-100 text-indigo-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Head>
        <title>学習計画 - 行政書士試験対策オンライン学習システム</title>
        <meta name="description" content="AI が生成するあなた専用の学習計画。目標達成に向けた効率的な学習スケジュールを確認できます。" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto pt-20 pb-12 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI学習計画</h1>
            <p className="text-gray-600">
              あなたの目標と学習状況に合わせて、AIが最適な学習計画を作成しました。
            </p>
          </div>

          {/* ユーザー情報サマリー */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">学習状況</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">目標試験日</p>
                  <p className="font-semibold">{user.targetExamDate}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">進捗状況</p>
                  <p className="font-semibold">{user.currentProgress}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">週の学習日数</p>
                  <p className="font-semibold">{user.studyDaysPerWeek}日</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">一日の学習時間</p>
                  <p className="font-semibold">{user.studyHoursPerDay}時間</p>
                </div>
              </div>
            </div>
          </div>

          {isGenerating ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">最適な学習計画を生成中...</p>
            </div>
          ) : studyPlan && (
            <>
              {/* 学習計画概要 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">計画概要</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 font-semibold">残り日数</p>
                    <p className="text-2xl font-bold text-blue-900">{studyPlan.totalDaysRemaining}日</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 font-semibold">総学習時間</p>
                    <p className="text-2xl font-bold text-green-900">{studyPlan.totalStudyHours}時間</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-600 font-semibold">学習段階</p>
                    <p className="text-2xl font-bold text-purple-900">3段階</p>
                  </div>
                </div>
              </div>

              {/* 学習段階 */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">学習段階</h2>
                <div className="space-y-6">
                  {studyPlan.planSections.map((section, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        <div className="text-sm text-gray-600">
                          {section.duration} • {section.period}
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">重点科目:</p>
                        <div className="flex flex-wrap gap-2">
                          {section.subjects.map((subject, subIndex) => (
                            <span
                              key={subIndex}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getSubjectColor(subject)}`}
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">学習目標:</p>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                          {section.goals.map((goal, goalIndex) => (
                            <li key={goalIndex}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 週間スケジュール */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">週間スケジュール</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {studyPlan.weeklySchedule.map((schedule, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        schedule.type === 'rest' 
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{schedule.day}</h3>
                      <p className="text-sm text-gray-600 mb-2">{schedule.time}</p>
                      {schedule.type !== 'rest' && (
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSubjectColor(schedule.subject)}`}
                        >
                          {schedule.subject}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* アクションボタン */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={generateStudyPlan}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  計画を再生成
                </button>
                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
                  計画をダウンロード
                </button>
                <a
                  href="/subjects"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-center"
                >
                  学習を開始
                </a>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
