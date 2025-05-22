import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { ArrowLeft, FileText, Headphones, Play, CheckCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import UnitContent from '../../components/units/UnitContent';
import AudioPlayer from '../../components/units/AudioPlayer';
import ProgressTracker from '../../components/units/ProgressTracker';
import RelatedUnits from '../../components/units/RelatedUnits';

// Dynamically import content service to avoid SSR issues
const contentService = dynamic(() => import('../../lib/contentService'), { ssr: false });

export default function UnitDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [unit, setUnit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  useEffect(() => {
    if (id) {
      loadUnit(id);
    }
  }, [id]);

  const loadUnit = async (unitId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock unit data - in real implementation, this would come from API
      const mockUnit = {
        id: unitId,
        title: `第${unitId}章 行政法の基本原理`,
        subjectId: 'administrative-law',
        subjectName: '行政法',
        difficulty: 'intermediate',
        estimatedTime: 45,
        type: 'lecture',
        content: {
          introduction: '本章では、行政法の基本原理について学習します。',
          sections: [
            {
              title: '1. 行政法とは',
              content: '行政法は、国や地方公共団体などの行政機関の活動について定めた法律です。',
              subsections: [
                {
                  title: '1.1 行政法の定義',
                  content: '行政法は、行政権の行使に関する法規範の総称です。'
                },
                {
                  title: '1.2 行政法の特色',
                  content: '行政法は公法の一分野であり、権力関係を規律する法律です。'
                }
              ]
            },
            {
              title: '2. 行政法の体系',
              content: '行政法は様々な法律から構成される複合的な法体系です。',
              subsections: [
                {
                  title: '2.1 行政組織法',
                  content: '行政機関の組織や権限について定める法律です。'
                },
                {
                  title: '2.2 行政作用法',
                  content: '行政機関の活動や手続きについて定める法律です。'
                }
              ]
            }
          ],
          conclusion: '行政法の基本原理を理解することで、より具体的な条文の解釈が可能になります。',
          keyPoints: [
            '行政法は公法の一分野である',
            '行政組織法と行政作用法に大別される',
            '権力関係を規律する法律である'
          ]
        },
        audioUrl: `/audio/units/${unitId}.mp3`,
        hasAudio: true,
        relatedUnits: [
          { id: '102', title: '行政行為の概念', type: 'lecture' },
          { id: '103', title: '行政裁量論', type: 'lecture' },
          { id: '201', title: '行政法基礎問題演習', type: 'practice' }
        ],
        prev: { id: '100', title: '行政法入門' },
        next: { id: '102', title: '行政行為の概念' }
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUnit(mockUnit);
      
      // Load user progress
      const userProgress = Math.floor(Math.random() * 100);
      setProgress(userProgress);
      setIsCompleted(userProgress === 100);
      
    } catch (error) {
      console.error('Error loading unit:', error);
      setError('ユニットの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = (newProgress) => {
    setProgress(newProgress);
    if (newProgress === 100) {
      setIsCompleted(true);
    }
  };

  const handleComplete = async () => {
    try {
      // Mark unit as completed
      setProgress(100);
      setIsCompleted(true);
      
      // Show success message
      alert('ユニットを完了しました！次のユニットに進みますか？');
      
      // Redirect to next unit if available
      if (unit.next) {
        router.push(`/units/${unit.next.id}`);
      }
    } catch (error) {
      console.error('Error completing unit:', error);
      alert('完了の記録に失敗しました。');
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>読み込み中... - 行政書士試験対策オンライン学習システム</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto pt-20 pb-12 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">ユニットを読み込み中...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (error || !unit) {
    return (
      <>
        <Head>
          <title>エラー - 行政書士試験対策オンライン学習システム</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto pt-20 pb-12 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-red-600 mb-4">{error || 'ユニットが見つかりません。'}</p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                戻る
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{unit.title} - 行政書士試験対策オンライン学習システム</title>
        <meta name="description" content={`${unit.subjectName}の学習ユニット: ${unit.title}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-6xl mx-auto pt-20 pb-12 px-4">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {unit.subjectName}に戻る
            </button>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">{unit.subjectName}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(unit.difficulty)}`}
                  >
                    {getDifficultyLabel(unit.difficulty)}
                  </span>
                  <span className="text-sm text-gray-500">
                    約{unit.estimatedTime}分
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {unit.hasAudio && (
                    <button
                      onClick={() => setShowAudio(!showAudio)}
                      className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>音声</span>
                    </button>
                  )}
                  {isCompleted && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">完了</span>
                    </div>
                  )}
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{unit.title}</h1>
              
              {/* Progress Tracker */}
              <ProgressTracker 
                progress={progress}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Audio Player */}
              {showAudio && unit.hasAudio && (
                <div className="mb-6">
                  <AudioPlayer audioUrl={unit.audioUrl} />
                </div>
              )}
              
              {/* Unit Content */}
              <UnitContent 
                content={unit.content}
                onComplete={handleComplete}
                isCompleted={isCompleted}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Navigation */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">ナビゲーション</h3>
                <div className="space-y-3">
                  {unit.prev && (
                    <button
                      onClick={() => router.push(`/units/${unit.prev.id}`)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="text-sm text-gray-600">前のユニット</div>
                      <div className="font-medium">{unit.prev.title}</div>
                    </button>
                  )}
                  {unit.next && (
                    <button
                      onClick={() => router.push(`/units/${unit.next.id}`)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="text-sm text-gray-600">次のユニット</div>
                      <div className="font-medium">{unit.next.title}</div>
                    </button>
                  )}
                </div>
              </div>

              {/* Related Units */}
              <RelatedUnits units={unit.relatedUnits} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
