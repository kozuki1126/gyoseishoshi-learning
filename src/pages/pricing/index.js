import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PricingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  
  // ログイン状態を確認
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const premium = localStorage.getItem('isPremium') === 'true';
    setIsLoggedIn(loggedIn);
    setIsPremium(premium);
  }, []);
  
  // プレミアム会員登録処理
  const handleUpgrade = (plan) => {
    // 実際のアプリでは支払いページに遷移
    if (!isLoggedIn) {
      router.push('/login?redirect=/pricing');
      return;
    }
    
    // デモ用：即時プレミアム会員に変更
    localStorage.setItem('isPremium', 'true');
    setIsPremium(true);
    alert(`${plan}プランへアップグレードしました！\nこれはデモ用のメッセージです。実際のアプリでは決済ページに遷移します。`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>料金プラン | 行政書士試験対策</title>
        <meta name="description" content="行政書士試験対策サイトの料金プラン。無料会員と有料会員の違いをご確認ください。" />
      </Head>

      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* ページヘッダー */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">料金プラン</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              あなたの学習スタイルに合わせて、最適なプランをお選びください。
              どのプランでも、基本的な機能はご利用いただけます。
            </p>
            
            {/* 支払いサイクル切り替え */}
            <div className="mt-8 inline-flex items-center bg-gray-200 p-1 rounded-lg">
              <button
                onClick={() => setIsAnnual(true)}
                className={`py-2 px-4 rounded-md ${
                  isAnnual 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                年間プラン（20%OFF）
              </button>
              <button
                onClick={() => setIsAnnual(false)}
                className={`py-2 px-4 rounded-md ${
                  !isAnnual 
                    ? 'bg-white shadow-sm text-indigo-600' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                月間プラン
              </button>
            </div>
          </div>
          
          {/* プランカード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* 無料プラン */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">無料プラン</h2>
                <p className="text-gray-600 mb-6">
                  行政書士試験を目指す方へ、基本的な学習コンテンツを無料でご提供します。
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">¥0</span>
                  <span className="text-gray-600">/永久無料</span>
                </div>
                
                <button
                  className={`w-full py-3 px-4 rounded-md font-medium ${
                    isLoggedIn
                      ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  }`}
                  onClick={() => !isLoggedIn && router.push('/register')}
                  disabled={isLoggedIn}
                >
                  {isLoggedIn ? '現在ご利用中' : '無料会員登録'}
                </button>
              </div>
              
              <div className="border-t border-gray-200 p-8">
                <h3 className="font-semibold text-gray-900 mb-4">含まれる機能</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">基本的な学習コンテンツ</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">学習進捗の記録</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">基本的な演習問題</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">無料PDFダウンロード（一部）</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">コミュニティへのアクセス</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="ml-3 text-gray-500">専門分野のコンテンツ</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="ml-3 text-gray-500">詳細な過去問解説</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="ml-3 text-gray-500">音声教材の利用</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* スタンダードプラン */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-indigo-500 transform scale-105 z-10">
              <div className="bg-indigo-500 py-2 text-center">
                <span className="text-sm font-semibold text-white uppercase tracking-wide">人気プラン</span>
              </div>
              
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">スタンダードプラン</h2>
                <p className="text-gray-600 mb-6">
                  充実したコンテンツとダウンロード機能を備えた、最もバランスの取れたプランです。
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ¥{isAnnual ? '19,800' : '1,980'}
                  </span>
                  <span className="text-gray-600">
                    /{isAnnual ? '年' : '月'}
                  </span>
                </div>
                
                <button
                  className={`w-full py-3 px-4 rounded-md font-medium shadow-sm ${
                    isPremium
                      ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  onClick={() => !isPremium && handleUpgrade('スタンダード')}
                  disabled={isPremium}
                >
                  {isPremium ? '現在ご利用中' : '今すぐアップグレード'}
                </button>
                
                {isAnnual && (
                  <p className="text-sm text-center text-indigo-600 mt-2">
                    月額1,650円相当（年払いで4ヶ月分無料）
                  </p>
                )}
              </div>
              
              <div className="border-t border-gray-200 p-8">
                <h3 className="font-semibold text-gray-900 mb-4">含まれる機能</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">無料プランのすべての機能</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">すべての学習コンテンツ</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">PDF教材ダウンロード無制限</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">音声講義すべて視聴可能</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">詳細な学習分析</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">過去問解説（直近3年分）</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="ml-3 text-gray-500">専属チューターサポート</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="ml-3 text-gray-500">合格保証制度</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* プレミアムプラン */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">プレミアムプラン</h2>
                <p className="text-gray-600 mb-6">
                  合格を確実にするための最高級プラン。チューターサポートと合格保証付き。
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ¥{isAnnual ? '39,800' : '3,980'}
                  </span>
                  <span className="text-gray-600">
                    /{isAnnual ? '年' : '月'}
                  </span>
                </div>
                
                <button
                  className={`w-full py-3 px-4 rounded-md font-medium shadow-sm ${
                    isPremium
                      ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  onClick={() => !isPremium && handleUpgrade('プレミアム')}
                  disabled={isPremium}
                >
                  {isPremium ? '現在ご利用中' : '今すぐアップグレード'}
                </button>
                
                {isAnnual && (
                  <p className="text-sm text-center text-indigo-600 mt-2">
                    月額3,317円相当（年払いで4ヶ月分無料）
                  </p>
                )}
              </div>
              
              <div className="border-t border-gray-200 p-8">
                <h3 className="font-semibold text-gray-900 mb-4">含まれる機能</h3>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">スタンダードプランのすべての機能</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">専属チューターによる学習サポート</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">週1回のZoomミーティング</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">個別学習計画作成</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">過去問解説（直近10年分）</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">模試受験回数無制限</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">合格保証制度</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">試験直前対策講座（1週間）</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 合格保証制度の説明 */}
          <div className="max-w-4xl mx-auto mt-16 bg-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4">合格保証制度について</h2>
            <p className="text-indigo-800 mb-6">
              プレミアムプランに加入して以下の条件を満たした方が、万が一不合格だった場合、
              翌年の試験まで無料でプレミアムプランをご利用いただけます。
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-indigo-800 mb-3">適用条件</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">試験日から逆算して3ヶ月以上継続してプレミアム会員であること</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">提供される模試をすべて受験していること</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">週1回のZoomミーティングに80%以上参加していること</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">受験票と成績通知書のコピーを提出すること</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-indigo-800 mb-3">保証内容</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">不合格通知から翌年の試験日まで、プレミアムプランを無料で延長</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">専属チューターによる弱点分析と改善プランの作成</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-700">追加の特別講座へのアクセス権</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* よくある質問 */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">よくある質問</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  途中でプランを変更することはできますか？
                </h3>
                <p className="text-gray-700">
                  はい、いつでもプランの変更が可能です。アップグレードの場合は即時反映され、
                  ダウングレードの場合は現在の請求サイクルの終了時に反映されます。
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  支払い方法にはどのようなものがありますか？
                </h3>
                <p className="text-gray-700">
                  クレジットカード（Visa、Mastercard、American Express、JCB）、
                  PayPal、銀行振込、コンビニ決済に対応しています。
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  解約するにはどうすればよいですか？
                </h3>
                <p className="text-gray-700">
                  マイページの「アカウント設定」から簡単に解約手続きができます。
                  解約後も、請求サイクルの終了時までサービスをご利用いただけます。
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  無料トライアルはありますか？
                </h3>
                <p className="text-gray-700">
                  はい、スタンダードプランとプレミアムプランには7日間の無料トライアルがあります。
                  トライアル期間中にキャンセルすれば、料金は一切発生しません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}