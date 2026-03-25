import Head from 'next/head';
import Link from 'next/link';
import Header from '@/shared/layout/Header';
import Footer from '@/shared/layout/Footer';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  Check,
  X,
  Star,
  Crown,
  Zap,
  Shield,
  Clock,
  BookOpen,
  Music,
  Download,
  HeadphonesIcon,
  ChevronRight
} from 'lucide-react';

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();

  const plans = [
    {
      id: 'free',
      name: '無料プラン',
      price: 0,
      period: '永久無料',
      description: 'まずは試してみたい方に',
      features: [
        { text: '基礎講義の一部', included: true },
        { text: 'サンプル音声教材', included: true },
        { text: '学習進捗管理', included: true },
        { text: '全講義コンテンツ', included: false },
        { text: '演習問題500問以上', included: false },
        { text: '音声ダウンロード', included: false },
        { text: 'メールサポート', included: false },
        { text: '優先サポート', included: false }
      ],
      cta: isAuthenticated ? '現在のプラン' : '無料で始める',
      ctaLink: isAuthenticated ? '/mypage' : '/auth/register',
      popular: false,
      current: isAuthenticated && !user?.isPremium
    },
    {
      id: 'premium',
      name: 'プレミアム',
      price: 2980,
      period: '月額',
      description: '本格的に学習したい方に',
      features: [
        { text: '基礎講義の一部', included: true },
        { text: 'サンプル音声教材', included: true },
        { text: '学習進捗管理', included: true },
        { text: '全講義コンテンツ', included: true },
        { text: '演習問題500問以上', included: true },
        { text: '音声ダウンロード', included: true },
        { text: 'メールサポート', included: true },
        { text: '優先サポート', included: false }
      ],
      cta: user?.isPremium ? '現在のプラン' : 'プレミアムに登録',
      ctaLink: '/checkout/premium',
      popular: true,
      current: user?.isPremium
    },
    {
      id: 'annual',
      name: '年間プラン',
      price: 24800,
      period: '年額',
      monthlyPrice: 2067,
      discount: '31%OFF',
      description: '長期的に学習する方に',
      features: [
        { text: '基礎講義の一部', included: true },
        { text: 'サンプル音声教材', included: true },
        { text: '学習進捗管理', included: true },
        { text: '全講義コンテンツ', included: true },
        { text: '演習問題500問以上', included: true },
        { text: '音声ダウンロード', included: true },
        { text: 'メールサポート', included: true },
        { text: '優先サポート', included: true }
      ],
      cta: '年間プランに登録',
      ctaLink: '/checkout/annual',
      popular: false,
      current: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>料金プラン | 行政書士試験対策</title>
        <meta name="description" content="行政書士試験対策の料金プラン。無料プランから年間プランまで、あなたに合ったプランをお選びください。" />
      </Head>

      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              シンプルで分かりやすい料金プラン
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              目標に合わせて最適なプランをお選びください。
              すべてのプランで学習進捗の管理が可能です。
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                    plan.popular 
                      ? 'border-blue-500 scale-105 z-10' 
                      : plan.current 
                        ? 'border-green-500' 
                        : 'border-gray-100'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                        <Star className="w-4 h-4" />
                        人気No.1
                      </span>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {plan.current && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                        <Check className="w-4 h-4" />
                        現在のプラン
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                      
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          ¥{plan.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500">/{plan.period}</span>
                      </div>

                      {plan.monthlyPrice && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">
                            月額換算 ¥{plan.monthlyPrice.toLocaleString()}
                          </span>
                          <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                            {plan.discount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
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

                    {/* CTA Button */}
                    <Link
                      href={plan.ctaLink}
                      className={`block w-full py-3 px-4 rounded-xl text-center font-medium transition-all ${
                        plan.current
                          ? 'bg-gray-100 text-gray-500 cursor-default'
                          : plan.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              プレミアムプランの特典
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">全講義アクセス</h3>
                <p className="text-sm text-gray-600">
                  80以上の講義動画・テキストに無制限アクセス
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">音声ダウンロード</h3>
                <p className="text-sm text-gray-600">
                  通勤・通学中にオフラインで学習可能
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">演習問題500問以上</h3>
                <p className="text-sm text-gray-600">
                  本試験形式の問題で実践力を養成
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">サポート体制</h3>
                <p className="text-sm text-gray-600">
                  学習に関する質問をメールで対応
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              よくある質問
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">
                  無料プランで何ができますか？
                </h3>
                <p className="text-gray-600">
                  無料プランでは、各科目の基礎講義の一部とサンプル音声教材を視聴できます。
                  また、学習進捗の管理機能もご利用いただけます。
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">
                  プランの変更はできますか？
                </h3>
                <p className="text-gray-600">
                  はい、いつでもプランの変更が可能です。
                  月額プランから年間プランへの変更や、その逆も可能です。
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">
                  解約はいつでもできますか？
                </h3>
                <p className="text-gray-600">
                  はい、いつでも解約可能です。解約後も、支払い済みの期間が終了するまでサービスをご利用いただけます。
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-2">
                  支払い方法は何がありますか？
                </h3>
                <p className="text-gray-600">
                  クレジットカード（Visa、Mastercard、JCB、American Express）に対応しています。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Crown className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
            <h2 className="text-3xl font-bold mb-4">
              今すぐ学習を始めましょう
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              無料プランから始めて、いつでもアップグレード可能です。
            </p>
            {isAuthenticated ? (
              <Link
                href="/subjects"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
              >
                学習を始める
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
              >
                無料で始める
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
