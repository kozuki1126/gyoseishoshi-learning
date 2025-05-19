import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 既にログイン済みかチェック
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router]);
  
  // ログイン処理
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // バリデーション
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      setIsLoading(false);
      return;
    }
    
    // 実際のアプリではAPIを呼び出してログイン処理を行う
    // ここではデモのためLocalStorageに情報を保存
    setTimeout(() => {
      // デモログイン情報
      if (email === 'demo@example.com' && password === 'password') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isPremium', 'false');
        router.push('/');
      } else {
        setError('メールアドレスまたはパスワードが正しくありません。');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>ログイン | 行政書士試験対策</title>
        <meta name="description" content="行政書士試験対策サイトへログイン。あなたの学習履歴を記録し、効率的に勉強を進めましょう。" />
      </Head>

      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* ログインカード */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">ログイン</h1>
              <p className="text-gray-600 mt-2">
                アカウントにログインして学習を続けましょう
              </p>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              {/* メールアドレス */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              {/* パスワード */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-gray-700 font-medium">
                    パスワード
                  </label>
                  <Link href="/password-reset" className="text-sm text-indigo-600 hover:text-indigo-800">
                    パスワードをお忘れですか？
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              {/* ログインボタン */}
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-md shadow-sm transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ログイン中...
                  </>
                ) : (
                  'ログイン'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                まだアカウントをお持ちでない方は 
                <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium ml-1">
                  無料会員登録
                </Link>
              </p>
            </div>
            
            {/* デモ用のヒント */}
            <div className="mt-8 text-sm text-center text-gray-500 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">デモアカウント情報:</p>
              <p>メールアドレス: demo@example.com</p>
              <p>パスワード: password</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}