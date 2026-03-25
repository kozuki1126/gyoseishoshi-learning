import { Check, X, Star } from 'lucide-react';

const plans = [
  {
    name: '無料プラン',
    price: '0',
    period: '永久無料',
    description: 'まずは無料で始めてみましょう',
    features: [
      { text: '基礎講義（一部）', included: true },
      { text: 'サンプル音声', included: true },
      { text: '学習進捗管理', included: true },
      { text: '全講義コンテンツ', included: false },
      { text: '演習問題', included: false },
      { text: 'ダウンロード機能', included: false },
      { text: '質問サポート', included: false }
    ],
    buttonText: '無料で始める',
    buttonStyle: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    popular: false
  },
  {
    name: 'プレミアムプラン',
    price: '2,980',
    period: '月額',
    description: '本格的に合格を目指す方へ',
    features: [
      { text: '全講義コンテンツ', included: true },
      { text: '全音声教材', included: true },
      { text: '学習進捗管理', included: true },
      { text: '演習問題（500問以上）', included: true },
      { text: 'PDFダウンロード', included: true },
      { text: '音声ダウンロード', included: true },
      { text: 'メールサポート', included: true }
    ],
    buttonText: '今すぐ申し込む',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    popular: true
  },
  {
    name: '年間プラン',
    price: '24,800',
    period: '年額',
    description: '年間プランでお得に学習',
    savings: '月額換算 約2,067円（31%OFF）',
    features: [
      { text: '全講義コンテンツ', included: true },
      { text: '全音声教材', included: true },
      { text: '学習進捗管理', included: true },
      { text: '演習問題（500問以上）', included: true },
      { text: 'PDFダウンロード', included: true },
      { text: '音声ダウンロード', included: true },
      { text: '優先サポート', included: true }
    ],
    buttonText: '年間プランで申し込む',
    buttonStyle: 'bg-green-600 text-white hover:bg-green-700',
    popular: false
  }
];

function PricingCard({ plan }) {
  return (
    <div className={`relative bg-white rounded-2xl shadow-sm border-2 p-8 ${
      plan.popular ? 'border-blue-600' : 'border-gray-100'
    }`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
            <Star className="w-4 h-4 fill-current" />
            人気No.1
          </span>
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-800">¥{plan.price}</span>
        <span className="text-gray-500 ml-2">/ {plan.period}</span>
        {plan.savings && (
          <p className="text-sm text-green-600 mt-1">{plan.savings}</p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
            <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}>
        {plan.buttonText}
      </button>
    </div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            料金プラン
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            あなたに合ったプランを選ぶ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            まずは無料プランでお試しください。
            本格的に学習を始める際は、プレミアムプランがおすすめです。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            ご不明な点がございましたら、
            <a href="#faq" className="text-blue-600 hover:underline">よくある質問</a>
            をご覧ください。
          </p>
        </div>
      </div>
    </section>
  );
}
