import Head from 'next/head';
import Link from 'next/link';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>利用規約 | 行政書士試験対策</title>
      </Head>
      <Header />
      <main className="mx-auto max-w-4xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">利用規約</h1>
          <div className="space-y-4 text-sm leading-7 text-gray-600">
            <p>本サービスは、行政書士試験の学習支援を目的として提供します。</p>
            <p>学習コンテンツ、進捗データ、会員機能は予告なく更新される場合があります。</p>
            <p>法改正や試験制度の変更には継続的に対応しますが、最終的な受験判断は利用者自身で行ってください。</p>
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
