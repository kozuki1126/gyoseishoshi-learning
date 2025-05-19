import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Lightbulb, BookOpen, ArrowRight, FileText, ExternalLink } from 'lucide-react';

export default function UnitContent({ content, onComplete, isCompleted = false }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [readingSections, setReadingSections] = useState(new Set());
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Initialize section refs
    if (content?.sections) {
      sectionRefs.current = content.sections.map(() => React.createRef());
    }
  }, [content]);

  useEffect(() => {
    // Intersection Observer to track reading progress
    const observers = sectionRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setReadingSections(prev => new Set([...prev, index]));
            setCurrentSection(index);
          }
        },
        { threshold: 0.5 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [content]);

  const handleSectionClick = (index) => {
    const ref = sectionRefs.current[index];
    if (ref?.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const calculateReadingProgress = () => {
    if (!content?.sections) return 0;
    return Math.round((readingSections.size / content.sections.length) * 100);
  };

  const isAllSectionsRead = () => {
    return content?.sections ? readingSections.size >= content.sections.length : false;
  };

  if (!content) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">コンテンツが読み込めませんでした。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress Bar */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">読み進み度</span>
          <span className="text-sm text-gray-600">
            {calculateReadingProgress()}% ({readingSections.size}/{content.sections?.length || 0})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateReadingProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Content Navigation */}
      {content.sections && content.sections.length > 1 && (
        <div className="p-4 bg-white border-b">
          <h3 className="text-sm font-medium text-gray-700 mb-3">目次</h3>
          <div className="space-y-2">
            {content.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => handleSectionClick(index)}
                className={`flex items-center space-x-3 w-full text-left p-2 rounded-lg transition-colors ${
                  currentSection === index
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  readingSections.has(index)
                    ? 'bg-green-500 border-green-500'
                    : currentSection === index
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {readingSections.has(index) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {/* Introduction */}
        {content.introduction && (
          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">はじめに</h2>
            <p className="text-gray-700 leading-relaxed">{content.introduction}</p>
          </div>
        )}

        {/* Sections */}
        {content.sections && (
          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <section
                key={index}
                ref={sectionRefs.current[index]}
                className="scroll-mt-20"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>{section.title}</span>
                </h2>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {section.content}
                  </p>

                  {/* Subsections */}
                  {section.subsections && (
                    <div className="space-y-6 ml-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="border-l-2 border-gray-200 pl-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {subsection.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {subsection.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Section Examples */}
                  {section.examples && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-green-800 mb-2">💡 例</h4>
                      <div className="space-y-2">
                        {section.examples.map((example, exampleIndex) => (
                          <p key={exampleIndex} className="text-sm text-green-700">
                            {example}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section Notes */}
                  {section.notes && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-yellow-800 mb-2">📝 注意点</h4>
                      <div className="space-y-2">
                        {section.notes.map((note, noteIndex) => (
                          <p key={noteIndex} className="text-sm text-yellow-700">
                            {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Key Points */}
        {content.keyPoints && (
          <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-indigo-900 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>重要ポイント</span>
              </h3>
              <button
                onClick={() => setShowKeyPoints(!showKeyPoints)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showKeyPoints ? '非表示' : '表示'}
              </button>
            </div>
            
            {showKeyPoints && (
              <ul className="space-y-2">
                {content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="text-indigo-800">{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Conclusion */}
        {content.conclusion && (
          <div className="mt-8 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">まとめ</h3>
            <p className="text-gray-700 leading-relaxed">{content.conclusion}</p>
          </div>
        )}

        {/* References */}
        {content.references && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>参考文献・リンク</span>
            </h3>
            <ul className="space-y-2">
              {content.references.map((ref, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                  <a 
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {ref.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Completion Section */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              読み進み度: {calculateReadingProgress()}%
            </div>
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">完了済み</span>
              </div>
            )}
          </div>

          {isAllSectionsRead() && !isCompleted && (
            <button
              onClick={onComplete}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>ユニットを完了</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {!isAllSectionsRead() && (
            <div className="text-sm text-gray-500">
              すべてのセクションを読み終えると完了ボタンが表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
