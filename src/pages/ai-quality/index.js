import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AIQualityPage() {
  return (
    <>
      <Head>
        <title>AIによる品質保証 | 行政書士試験対策</title>
        <meta name="description" content="最先端のAI技術を活用した行政書士試験対策サイトの品質保証について詳しく解説します。" />
      </Head>

      <Header />

      <main>
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-b from-indigo-900 to-indigo-700 text-white py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">AIが実現する最高品質の学習体験</h1>
              <p className="text-xl opacity-90 mb-8">
                最先端のAI技術を融合させることで、わかりやすく、効率的な学習体験を実現します。
                私たちが取り入れている技術と品質保証の取り組みについてご紹介します。
              </p>
            </div>
          </div>
        </section>

        {/* コンテンツセクション */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">最新のAI技術による品質保証</h2>
              
              <div className="prose prose-lg mx-auto">
                <p className="lead mb-8">
                  当サイトでは、以下の最先端AI技術を組み合わせることで、行政書士試験のための効率的で質の高い学習体験を提供しています。
                  これらの技術は常に最新の状態に保たれ、最高品質のコンテンツを維持するために活用されています。
                </p>

                {/* VOICEPEAK セクション */}
                <div className="my-12 p-6 bg-blue-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-5">
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-800">VOICEPEAK - 高品質ナレーション生成</h3>
                  </div>
                  
                  <p>
                    VOICEPEAKは、人間の声に極めて近い自然な音声を生成する最先端の音声合成技術です。当サイトでは、
                    このテクノロジーを活用し、聞きやすく、飽きのこない音声講義を実現しています。
                  </p>
                  
                  <h4 className="text-xl font-bold text-blue-700 mt-4 mb-2">主な特徴</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>自然な抑揚とイントネーション</strong> - 機械的な読み上げではなく、自然な抑揚で理解しやすい</li>
                    <li><strong>長時間リスニングでも疲れにくい音質</strong> - 通勤時間や移動中の学習に最適</li>
                    <li><strong>専門用語の正確な発音</strong> - 法律用語や専門用語も正確に発音</li>
                    <li><strong>感情表現が豊か</strong> - 重要ポイントの強調や、例示の際の語調変化により理解を促進</li>
                  </ul>
                  
                  <p className="mt-4">
                    音声学習コンテンツはすべてVOICEPEAKで生成され、プロの音声技術者によって音質チェックが行われています。
                    これにより、長時間の学習でも疲労を感じにくく、集中力を維持したまま学習を進めることができます。
                  </p>
                </div>

                {/* Claude セクション */}
                <div className="my-12 p-6 bg-purple-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-5">
                      <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-purple-800">Claude - 自然で正確な文章生成</h3>
                  </div>
                  
                  <p>
                    Anthropic社のClaudeは、自然言語処理において最高水準の性能を発揮するAIモデルです。
                    当サイトでは、Claudeを活用して、わかりやすく正確な解説文を作成しています。
                  </p>
                  
                  <h4 className="text-xl font-bold text-purple-700 mt-4 mb-2">主な特徴</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>自然で流れるような文章表現</strong> - 読みやすく理解しやすい文章構成</li>
                    <li><strong>法律概念の簡潔かつ正確な説明</strong> - 複雑な法律概念をわかりやすく解説</li>
                    <li><strong>論理的な思考過程の明示</strong> - 解答プロセスを段階的に説明</li>
                    <li><strong>例示の質と適切さ</strong> - 具体例を用いた理解促進</li>
                  </ul>
                  
                  <p className="mt-4">
                    Claudeは膨大な法律文献と専門書を学習しており、行政書士試験に必要な知識を網羅的に把握しています。
                    すべての解説文は法律専門家によって監修され、内容の正確性が保証されています。
                  </p>
                </div>

                {/* ChatGPT & Gemini セクション */}
                <div className="my-12 p-6 bg-green-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-5">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-800">ChatGPT-3 & Gemini 2.5 Pro - 継続的コンテンツ改善</h3>
                  </div>
                  
                  <p>
                    OpenAI社のChatGPT-3とGoogle社のGemini 2.5 Proは、最新の情報収集と高度な推論能力を持つAIモデルです。
                    当サイトでは、これらのモデルを活用して、学習コンテンツの継続的な見直しと最新情報への更新を行っています。
                  </p>
                  
                  <h4 className="text-xl font-bold text-green-700 mt-4 mb-2">主な特徴</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>最新法改正情報の反映</strong> - 法律の改正内容をタイムリーに学習コンテンツへ反映</li>
                    <li><strong>判例情報のアップデート</strong> - 新しい重要判例の追加と解説</li>
                    <li><strong>出題傾向の分析と予測</strong> - 過去問の出題パターン分析による効率的な学習ポイントの提案</li>
                    <li><strong>コンテンツの整合性チェック</strong> - 異なる単元間の説明の一貫性を確保</li>
                  </ul>
                  
                  <p className="mt-4">
                    異なるAIモデルを並行利用することで、単一モデルでは見落とされがちな視点や情報を補完し、より精度の高い
                    情報提供を実現しています。すべての更新内容は法律専門家によって最終確認が行われ、正確性が担保されています。
                  </p>
                </div>

                {/* 品質保証プロセス */}
                <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">品質保証プロセス</h3>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="mb-4">
                    当サイトでは、以下のプロセスによって、コンテンツの品質を常に高い水準で維持しています：
                  </p>
                  
                  <ol className="list-decimal pl-6 space-y-4">
                    <li>
                      <strong>初期コンテンツ作成</strong>
                      <p className="text-gray-700">Claude AIによる専門的かつわかりやすい解説文の生成</p>
                    </li>
                    
                    <li>
                      <strong>専門家レビュー</strong>
                      <p className="text-gray-700">現役行政書士による内容の正確性と最新性の確認</p>
                    </li>
                    
                    <li>
                      <strong>音声コンテンツ生成</strong>
                      <p className="text-gray-700">VOICEPEAKによる高品質ナレーションの生成と音質確認</p>
                    </li>
                    
                    <li>
                      <strong>ユーザーフィードバック収集</strong>
                      <p className="text-gray-700">学習者からのフィードバックによる継続的な改善</p>
                    </li>
                    
                    <li>
                      <strong>定期的な内容更新</strong>
                      <p className="text-gray-700">ChatGPT-3とGemini 2.5 Proによる最新情報のチェックと更新提案</p>
                    </li>
                    
                    <li>
                      <strong>最終品質チェック</strong>
                      <p className="text-gray-700">更新内容に対する専門家の最終確認とフィードバック</p>
                    </li>
                  </ol>
                </div>
                
                <div className="mt-12 text-center">
                  <p className="text-xl font-semibold text-indigo-700">
                    最先端のAI技術と専門家の知見を組み合わせることで、<br />
                    行政書士試験対策に最適な学習環境を提供しています。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}