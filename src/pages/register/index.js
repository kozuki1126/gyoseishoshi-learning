import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 既にログイン済みかチェック
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      router.push('/');
    }
  }, [router]);
  
  // 会員登録処理
  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // バリデーション
    if (!name || !email || !password || !passwordConfirm) {
      setError('すべての必須項目を入力してください。');
      setIsLoading(false);
      return;
    }
    
    if (password !== passwordConfirm) {
      setError('パスワードが一致しません。');
      setIsLoading(false);
      return;
    }
    
    if (!agreeTerms) {
      setError('利用規約とプライバシーポリシーに同意する必要があります。');
      setIsLoading(false);
      return;
    }
    
    // 実際のアプリではAPIを呼び出して会員登録処理を行う
    // ここではデモのためLocalStorageに情報を保存
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isPremium', 'false');
      router.push('/');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>無料会員登録 | 行政書士試験対策</title>
        <meta name="description" content="行政書士試験対策サイトの無料会員登録。効率的な学習を始めましょう。" />
      </Head>

      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-lg">
          {/* 登録カード */}
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">無料会員登録</h1>
              <p className="text-gray-600 mt-2">
                アカウントを作成して学習を始めましょう
              </p>
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister}>
              {/* 名前 */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  お名前 <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="山田 太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              {/* メールアドレス */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  メールアドレス <span className="text-red-600">*</span>
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
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  パスワード <span className="text-red-600">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="8文字以上の英数字"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  minLength={8}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">※8文字以上の英数字を組み合わせてください</p>
              </div>
              
              {/* パスワード確認 */}
              <div className="mb-6">
                <label htmlFor="passwordConfirm" className="block text-gray-700 font-medium mb-2">
                  パスワード（確認） <span className="text-red-600">*</span>
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="パスワードを再入力"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  minLength={8}
                  required
                />
              </div>
              
              {/* 利用規約同意 */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-600">
                      <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">利用規約</Link>
                      と
                      <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800">プライバシーポリシー</Link>
                      に同意します
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 登録ボタン */}
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
                    登録中...
                  </>
                ) : (
                  '無料会員登録'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                既にアカウントをお持ちの方は
                <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium ml-1">
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}