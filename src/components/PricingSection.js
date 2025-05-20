import React from 'react';
import Link from 'next/link';

export default function PricingSection() {
  const plans = [
    {
      name: 'ベーシック',
      price: '¥0',
      period: '無料',
      description: '基本的な学習コンテンツにアクセス',
      features: [
        '科目別の基本コンテンツ',
        '学習進捗管理',
        'コミュニティ機能',
        '無料の模試（月1回）',
        'アプリ対応',
      ],
      limitations: [
        'PDF教材のダウンロード制限',
        '音声講義の視聴制限'
      ],
      buttonText: '無料で始める',
      highlighted: false,
      color: 'indigo'
    },
    {
      name: 'スタンダード',
      price: '¥1,980',
      period: '月額',
      description: '充実したコンテンツと便利機能',
      features: [
        'すべての学習コンテンツ',
        'PDF教材ダウンロード無制限',
        '音声講義すべて視聴可能',
        '詳細な学習分析',
        '月4回の模試受験',
        'オフライン学習対応',
        'メールサポート'
      ],
      limitations: [],
      buttonText: '7日間無料体験',
      highlighted: true,
      color: 'indigo'
    },
    {
      name: 'プレミアム',
      price: '¥3,980',
      period: '月額',
      description: '最高の学習体験と個別サポート',
      features: [
        'スタンダードプランの全機能',
        '個別学習計画の作成',
        '専属チューターのサポート',
        '過去問解説動画（直近10年分）',
        '模試受験回数無制限',
        '合格保証制度',
        '専用の質問掲示板',
        '試験直前対策講座'
      ],
      limitations: [],
      buttonText: '14日間無料体験',
      highlighted: false,
      color: 'indigo'
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            あなたに最適な料金プラン
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            学習の進度や目標に合わせて選べる3つのプラン。
            すべてのプランで高品質な学習コンテンツをご利用いただけます。
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <span className="text-sm text-gray-500">✓ いつでもプラン変更可能</span>
            <span className="text-sm text-gray-500">✓ 自動更新なし</span>
            <span className="text-sm text-gray-500">✓ クレジットカード・コンビニ決済対応</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg shadow-lg overflow-hidden ${
                plan.highlighted
                  ? 'ring-2 ring-indigo-500 transform scale-105 z-10'
                  : 'border border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 w-full bg-indigo-500 text-white text-center py-2 text-sm font-semibold">
                  おすすめ
                </div>
              )}
              
              <div className={`px-6 py-8 ${plan.highlighted ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm font-medium text-gray-500 ml-1">{plan.period}</span>
                </div>
              </div>

              <div className="px-6 py-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">含まれる機能：</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">制限事項：</h4>
                    <ul className="space-y-3">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <svg
                            className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="ml-3 text-sm text-gray-700">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="px-6 py-6 bg-gray-50">
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {plan.buttonText}
                </Link>
                {plan.price !== '¥0' && (
                  <p className="mt-3 text-xs text-center text-gray-500">
                    いつでもキャンセル可能
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 料金に関する追加情報 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              よくある質問
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900">支払い方法は？</h4>
                <p className="mt-1 text-sm text-gray-600">
                  クレジットカード、コンビニ決済、銀行振込に対応しています。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">解約はいつでもできますか？</h4>
                <p className="mt-1 text-sm text-gray-600">
                  はい、マイページからいつでも解約可能です。更新日前までの利用料金のみ請求されます。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">プラン変更は可能ですか？</h4>
                <p className="mt-1 text-sm text-gray-600">
                  はい、いつでもプランの変更が可能です。差額は次回請求時に調整されます。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">合格保証制度とは？</h4>
                <p className="mt-1 text-sm text-gray-600">
                  プレミアムプランで指定条件を満たしていれば、不合格時に翌年の受験まで無料でサポートを継続します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}