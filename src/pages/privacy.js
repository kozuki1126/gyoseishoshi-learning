import Head from 'next/head';
import Link from 'next/link';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>プライバシーポリシー | 行政書士試験対策</title>
      </Head>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">プライバシーポリシー</h1>
          <div className="space-y-4 text-sm leading-7 text-gray-600">
            <p>本サービスでは、会員登録情報、学習進捗、利用ログをサービス提供のために利用します。</p>
            <p>取得した情報は学習体験の改善、会員状態の管理、問い合わせ対応に必要な範囲でのみ利用します。</p>
            <p>法令に基づく場合を除き、本人の同意なく第三者へ提供しません。</p>
          </div>
          <Link href="/" className="mt-8 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">
            ホームに戻る
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
