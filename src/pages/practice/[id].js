import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowLeft, Clock, CheckCircle, X, RotateCcw } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PracticeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [practiceSet, setPracticeSet] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPracticeSet(id);
    }
  }, [id]);

  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isCompleted) {
      handleTimeUp();
    }
  }, [timeRemaining, isCompleted]);

  const loadPracticeSet = async (practiceId) => {
    setIsLoading(true);
    
    // Mock practice set data
    const mockPracticeSet = {
      id: practiceId,
      title: '憲法基礎問題集',
      subjectName: '憲法',
      difficulty: 'beginner',
      estimatedTime: 60,
      description: '憲法の基本原理と基本的人権に関する基礎的な問題です。'
    };

    // Mock questions
    const mockQuestions = [
      {
        id: 1,
        question: '日本国憲法の三大原理として正しいものはどれか。',
        options: [
          '国民主権、基本的人権の尊重、平和主義',
          '国民主権、法の支配、三権分立',
          '基本的人権の尊重、法の支配、平和主義',
          '国民主権、三権分立、平和主義'
        ],
        correctAnswer: 0,
        explanation: '日本国憲法の三大原理は、国民主権、基本的人権の尊重、平和主義です。これらは憲法の根本的な価値として位置づけられています。'
      },
      {
        id: 2,
        question: '基本的人権の中で、「国家からの自由」を意味するものはどれか。',
        options: [
          '自由権',
          '社会権',
          '参政権',
          '請求権'
        ],
        correctAnswer: 0,
        explanation: '自由権は「国家からの自由」を意味し、国家権力からの干渉を排除する消極的権利です。思想・良心の自由、表現の自由、身体の自由などが含まれます。'
      },
      {
        id: 3,
        question: '憲法第21条で保障される表現の自由について、最高裁判所が採用している基準はどれか。',
        options: [
          '明白かつ現在の危険の原則',
          '事前抑制の禁止',
          '内容中立規制',
          '比較衡量論'
        ],
        correctAnswer: 3,
        explanation: '最高裁判所は表現の自由の制約について比較衡量論を採用しており、表現の自由の価値と制約の必要性を具体的に比較衡量して判断します。'
      }
    ];

    setPracticeSet(mockPracticeSet);
    setQuestions(mockQuestions);
    setTimeRemaining(mockPracticeSet.estimatedTime * 60); // Convert to seconds
    setIsLoading(false);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setShowResults(true);
  };

  const handleTimeUp = () => {
    setIsCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const restart = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setIsCompleted(false);
    setShowResults(false);
    setTimeRemaining(practiceSet.estimatedTime * 60);
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
              <p className="text-gray-600">問題を読み込み中...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!practiceSet) {
    return (
      <>
        <Head>
          <title>エラー - 行政書士試験対策オンライン学習システム</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto pt-20 pb-12 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-red-600 mb-4">問題集が見つかりません。</p>
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

  const score = calculateScore();

  return (
    <>
      <Head>
        <title>{practiceSet.title} - 行政書士試験対策オンライン学習システム</title>
        <meta name="description" content={practiceSet.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto pt-20 pb-12 px-4">
          {!showResults ? (
            <>
              {/* Header */}
              <div className="mb-6">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  問題演習に戻る
                </button>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{practiceSet.title}</h1>
                      <p className="text-gray-600">{practiceSet.subjectName} • {practiceSet.difficulty === 'beginner' ? '初級' : practiceSet.difficulty === 'intermediate' ? '中級' : '上級'}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-orange-600">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">{formatTime(timeRemaining)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      問題 {currentQuestion + 1} / {questions.length}
                    </span>
                    <div className="w-64 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {questions[currentQuestion]?.question}
                </h2>
                
                <div className="space-y-3">
                  {questions[currentQuestion]?.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition duration-200 ${
                        userAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium text-gray-700 mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  前の問題
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={userAnswers[currentQuestion] === undefined}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {currentQuestion === questions.length - 1 ? '完了' : '次の問題'}
                </button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4">
                  {score.percentage >= 70 ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  ) : (
                    <X className="w-16 h-16 text-red-500" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">結果</h2>
                <p className="text-gray-600">{practiceSet.title}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{score.percentage}%</div>
                  <div className="text-gray-600">スコア</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{score.correct}</div>
                  <div className="text-gray-600">正解数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-2">{score.total}</div>
                  <div className="text-gray-600">問題数</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">解答結果</h3>
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">問題 {index + 1}: {question.question}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            あなたの回答: {userAnswer !== undefined ? question.options[userAnswer] : '未回答'}
                          </p>
                          <p className="text-sm text-green-600 mb-2">
                            正解: {question.options[question.correctAnswer]}
                          </p>
                          <p className="text-sm text-gray-600">
                            解説: {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={restart}
                  className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-200"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  再挑戦
                </button>
                <button
                  onClick={() => router.push('/practice')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  問題演習一覧に戻る
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
