import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { subjects } from '../../data/subjects';

export default function DownloadsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('study');
  
  // URLのクエリパラメータからタブを設定
  useEffect(() => {
    if (router.query.tab) {
      if (router.query.tab === 'exercise') {
        setActiveTab('exercise');
      } else {
        setActiveTab('study');
      }
    }
  }, [router.query.tab]);
  
  // ダウンロードリソースデータ
  const studyNotes = [
    {
      id: 'sn001',
      title: '憲法 総合学習ノート',
      description: '憲法の基本概念から判例まで体系的にまとめた学習ノートです。',
      category: '学習ノート',
      fileType: 'PDF',
      fileSize: '3.4 MB',
      subjectId: 2,
      premium: false,
      downloadUrl: '/pdf/study_notes/constitutional_study_notes.pdf'
    },
    {
      id: 'sn002',
      title: '民法 総合学習ノート',
      description: '民法の総則、物権、債権、親族・相続まで幅広くカバーした学習ノートです。',
      category: '学習ノート',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      subjectId: 1,
      premium: false,
      downloadUrl: '/pdf/study_notes/civil_law_study_notes.pdf'
    },
    {
      id: 'sn003',
      title: '行政法 総合学習ノート',
      description: '行政法の一般理論から具体的な法律の解説まで詳細に解説した学習ノートです。',
      category: '学習ノート',
      fileType: 'PDF',
      fileSize: '3.8 MB',
      subjectId: 3,
      premium: true,
      downloadUrl: '/pdf/study_notes/administrative_law_study_notes.pdf'
    },
    {
      id: 'sn004',
      title: '商法・会社法 総合学習ノート',
      description: '会社法の基本概念から組織再編までをカバーした学習ノートです。',
      category: '学習ノート',
      fileType: 'PDF',
      fileSize: '2.9 MB',
      subjectId: 6,
      premium: true,
      downloadUrl: '/pdf/study_notes/company_law_study_notes.pdf'
    },
    {
      id: 'sn005',
      title: '行政手続法・行政不服審査法 学習ノート',
      description: '行政手続法と行政不服審査法の重要ポイントをまとめた学習ノートです。',
      category: '学習ノート',
      fileType: 'PDF',
      fileSize: '3.1 MB',
      subjectId: 4,
      premium: true,
      downloadUrl: '/pdf/study_notes/administrative_procedure_study_notes.pdf'
    }
  ];
  
  const exerciseNotes = [
    {
      id: 'en001',
      title: '憲法 演習問題集',
      description: '過去問からよく出題されるテーマを中心に編集した演習問題集です。',
      category: '演習ノート',
      fileType: 'PDF',
      fileSize: '2.7 MB',
      subjectId: 2,
      premium: false,
      downloadUrl: '/pdf/exercise_notes/constitutional_exercises.pdf'
    },
    {
      id: 'en002',
      title: '民法 演習問題集',
      description: '頻出論点を中心に問題と解説をセットにした演習問題集です。',
      category: '演習ノート',
      fileType: 'PDF',
      fileSize: '3.5 MB',
      subjectId: 1,
      premium: false,
      downloadUrl: '/pdf/exercise_notes/civil_law_exercises.pdf'
    },
    {
      id: 'en003',
      title: '行政法 一般理論 演習問題集',
      description: '行政法の一般理論に関する重要問題をまとめた演習問題集です。',
      category: '演習ノート',
      fileType: 'PDF',
      fileSize: '2.8 MB',
      subjectId: 3,
      premium: true,
      downloadUrl: '/pdf/exercise_notes/administrative_law_exercises.pdf'
    },
    {
      id: 'en004',
      title: '過去問解説集 直近5年',
      description: '直近5年間の行政書士試験の問題と詳細な解説をまとめたノートです。',
      category: '演習ノート',
      fileType: 'PDF',
      fileSize: '5.6 MB',
      subjectId: null, // 全科目
      premium: true,
      downloadUrl: '/pdf/exercise_notes/past_exams_5years.pdf'
    },
    {
      id: 'en005',
      title: '法令用語・インターネット知識 問題集',
      description: '情報通信と法令用語の頻出分野をまとめた問題集です。',
      category: '演習ノート',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      subjectId: 8,
      premium: true,
      downloadUrl: '/pdf/exercise_notes/it_legal_terms_exercises.pdf'
    }
  ];
  
  // タブの内容を取得する関数
  const getTabContent = () => {
    if (activeTab === 'study') {
      return studyNotes;
    } else {
      return exerciseNotes;
    }
  };
  
  // 科目名を取得する関数
  const getSubjectName = (subjectId) => {
    if (!subjectId) return '全科目';
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.title : '不明';
  };
  
  // 科目の色を取得する関数
  const getSubjectColor = (subjectId) => {
    if (!subjectId) return 'bg-gray-600';
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.color : 'bg-gray-600';
  };
  
  return (
    <>
      <Head>
        <title>学習ノート・演習ノートダウンロード | 行政書士試験対策</title>
        <meta name="description" content="行政書士試験対策のための学習ノートと演習ノートをダウンロードできるページです。" />
      </Head>
      
      <Header />
      
      <main>
        <section className="bg-gradient-to-b from-indigo-900 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">学習サポート資料ダウンロード</h1>
              <p className="text-xl opacity-90 mb-8">
                効率的な学習をサポートする学習ノートと演習問題集をダウンロードできます。
                <br />
                <span className="text-yellow-300">
                  <svg className="inline-block h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  有料会員限定コンテンツには<strong>プレミアム</strong>マークがついています。
                </span>
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* タブナビゲーション */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setActiveTab('study')}
                  className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                    activeTab === 'study'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  学習ノート
                </button>
                <button
                  onClick={() => setActiveTab('exercise')}
                  className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                    activeTab === 'exercise'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  演習ノート
                </button>
              </div>
            </div>
            
            {/* ダウンロードリスト */}
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-6">
                {getTabContent().map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getSubjectColor(item.subjectId)}`}></span>
                          <span className="text-sm text-gray-600">{getSubjectName(item.subjectId)}</span>
                          {item.premium && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              プレミアム
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center mr-4">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {item.fileType}
                          </span>
                          <span className="inline-flex items-center">
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {item.fileSize}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <a
                          href={item.downloadUrl}
                          className={`inline-flex items-center justify-center px-6 py-3 rounded-md shadow-sm text-white font-medium ${
                            item.premium 
                              ? 'bg-yellow-600 hover:bg-yellow-700' 
                              : 'bg-indigo-600 hover:bg-indigo-700'
                          } transition ${item.premium ? 'cursor-not-allowed' : ''}`}
                          onClick={(e) => {
                            if (item.premium) {
                              e.preventDefault();
                              alert('このコンテンツは有料会員限定です。会員登録をお願いします。');
                            }
                          }}
                        >
                          {item.premium ? (
                            <>
                              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              会員限定
                            </>
                          ) : (
                            <>
                              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              ダウンロード
                            </>
                          )}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 注意事項 */}
              <div className="mt-12 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm leading-5 font-medium text-blue-800">
                      ダウンロードに関する注意事項
                    </h3>
                    <div className="mt-2 text-sm leading-5 text-blue-700">
                      <p>
                        ダウンロードしたPDF資料は個人利用に限定されており、無断での複製や再配布は禁止されています。
                        最新の法改正に対応した資料は定期的に更新されますので、マイページで最新版を確認してください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* プレミアム会員勧誘 */}
              <div className="mt-8 text-center">
                <a href="/pricing" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  <span className="font-medium">プレミアム会員について詳しく見る</span>
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}