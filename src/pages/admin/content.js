import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { subjects } from '../../data/subjects';

// We'll handle markdown preview without external dependencies initially
// This avoids build errors when react-markdown isn't available

export default function AdminContentManager() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [files, setFiles] = useState({});

  // 単元が選択されたときにコンテンツを読み込む
  useEffect(() => {
    if (selectedUnit) {
      loadUnitContent();
      loadUnitFiles();
    }
  }, [selectedUnit]);

  // コンテンツ読み込み
  const loadUnitContent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/get?unitId=${selectedUnit.id}`);
      const data = await response.json();
      setContent(data.content || '');
    } catch (error) {
      console.error('Error loading content:', error);
      setMessage({ type: 'error', text: 'コンテンツの読み込みに失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  // ファイル情報の読み込み
  const loadUnitFiles = async () => {
    if (!selectedUnit) return;
    
    try {
      console.log('Loading files for unit:', selectedUnit.id);
      const response = await fetch(`/api/content/get-files?unitId=${selectedUnit.id}`);
      console.log('Files response status:', response.status);
      
      const data = await response.json();
      console.log('Files data:', data);
      
      setFiles(data.metadata || {});
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  // コンテンツ保存
  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/content/save?unitId=${selectedUnit.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'コンテンツが保存されました' });
        setIsEditing(false);
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage({ type: 'error', text: 'コンテンツの保存に失敗しました' });
    } finally {
      setSaving(false);
    }
  };

  // ファイルアップロード
  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file || !selectedUnit) return;

    console.log('Uploading file:', file.name, 'Type:', fileType, 'Unit:', selectedUnit.id);
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('unitId', selectedUnit.id);

    try {
      const response = await fetch(`/api/content/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setMessage({ type: 'success', text: `${fileType === 'pdf' ? 'PDF' : '音声'}ファイルがアップロードされました` });
        loadUnitFiles(); // ファイル情報を再読み込み
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'ファイルのアップロードに失敗しました' });
    } finally {
      setUploading(false);
    }
  };

  // メッセージを自動的に消す
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 初期状態のテンプレート
  const handleCreateTemplate = () => {
    const template = `# ${selectedUnit?.title || 'タイトル'}

## 概要
(この単元の概要を記載してください)

## 重要ポイント
1. **ポイント1**: 説明
2. **ポイント2**: 説明
3. **ポイント3**: 説明

## 詳細説明

### 項目1
説明内容

### 項目2
説明内容

## 試験対策のポイント
- 重要な暗記事項
- 引っかけやすい問題
- 間違いやすい概念

## 例題
**問題**: 
**解答**: 
**解説**: 

## まとめ
`;
    setContent(template);
    setIsEditing(true);
  };

  // 簡単なMarkdownプレビュー（react-markdown不要）
  const renderMarkdown = () => {
    // 改行を<br>に変換し、基本的なMarkdown形式を表示
    const lines = content.split('\n');
    const elements = [];
    let currentList = null;
    let currentListType = null;
    
    lines.forEach((line, index) => {
      // 見出しの処理
      if (line.startsWith('# ')) {
        // 現在のリストを閉じる
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(<h1 key={index} className="text-3xl font-bold mt-4 mb-2">{line.substring(2)}</h1>);
      }
      else if (line.startsWith('## ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(<h2 key={index} className="text-2xl font-bold mt-3 mb-2">{line.substring(3)}</h2>);
      }
      else if (line.startsWith('### ')) {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(<h3 key={index} className="text-xl font-bold mt-2 mb-1">{line.substring(4)}</h3>);
      }
      // リストの処理
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (currentListType !== 'ul') {
          if (currentList) elements.push(currentList);
          currentList = <ul key={`ul-${index}`} className="list-disc ml-6 mb-4"></ul>;
          currentListType = 'ul';
        }
        currentList = React.cloneElement(currentList, {
          children: [...(currentList.props.children || []), <li key={index}>{line.substring(2)}</li>]
        });
      }
      // 番号付きリストの処理
      else if (/^\d+\.\s/.test(line)) {
        if (currentListType !== 'ol') {
          if (currentList) elements.push(currentList);
          currentList = <ol key={`ol-${index}`} className="list-decimal ml-6 mb-4"></ol>;
          currentListType = 'ol';
        }
        currentList = React.cloneElement(currentList, {
          children: [...(currentList.props.children || []), <li key={index}>{line}</li>]
        });
      }
      // 通常の行
      else {
        if (currentList) {
          elements.push(currentList);
          currentList = null;
          currentListType = null;
        }
        elements.push(<div key={index}>{line || <br />}</div>);
      }
    });
    
    // 最後のリストを追加
    if (currentList) {
      elements.push(currentList);
    }
    
    return <div className="whitespace-pre-wrap">{elements}</div>;
  };

  return (
    <>
      <Head>
        <title>コンテンツ管理 | 行政書士試験対策</title>
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">学習コンテンツ管理システム</h1>
          {message && (
            <div className={`px-4 py-2 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* 科目選択 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">科目選択</h2>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject);
                    setSelectedUnit(null);
                    setContent('');
                    setIsEditing(false);
                  }}
                  className={`w-full text-left p-2 rounded transition ${
                    selectedSubject?.id === subject.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {subject.title}
                </button>
              ))}
            </div>
          </div>

          {/* 単元選択 */}
          {selectedSubject && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">単元選択</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedSubject.units.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setContent('');
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-2 rounded text-sm transition ${
                      selectedUnit?.id === unit.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {unit.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* コンテンツ編集エリア */}
          {selectedUnit && (
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedUnit.title}</h2>
                {loading ? (
                  <span className="text-gray-500">読み込み中...</span>
                ) : !isEditing ? (
                  <div className="space-x-2">
                    {content.trim() === '' && (
                      <button
                        onClick={handleCreateTemplate}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        テンプレート作成
                      </button>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      編集
                    </button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        loadUnitContent(); // 元のコンテンツに戻す
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSaveContent}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? '保存中...' : '保存'}
                    </button>
                  </div>
                )}
              </div>

              {/* エディター/プレビュー */}
              <div className="mb-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-96 p-4 border rounded font-mono text-sm"
                      placeholder="Markdown形式でコンテンツを記述してください..."
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">Markdown記法の例：</p>
                      <div className="grid grid-cols-2 gap-4">
                        <ul className="space-y-1">
                          <li><code># 見出し1</code></li>
                          <li><code>## 見出し2</code></li>
                          <li><code>**太字**</code></li>
                          <li><code>*イタリック*</code></li>
                        </ul>
                        <ul className="space-y-1">
                          <li><code>- リスト項目</code></li>
                          <li><code>1. 番号付きリスト</code></li>
                          <li><code>[リンク](URL)</code></li>
                          <li><code>`コード`</code></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none border rounded p-4 min-h-[400px]">
                    {content.trim() === '' ? (
                      <p className="text-gray-500 italic">
                        このコンテンツはまだ作成されていません。
                        「テンプレート作成」ボタンで基本構造を作成するか、「編集」でコンテンツを追加してください。
                      </p>
                    ) : (
                      renderMarkdown()
                    )}
                  </div>
                )}
              </div>

              {/* ファイル管理 */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">添付ファイル</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">PDFファイル</h4>
                    {files.pdfUrl ? (
                      <div className="mb-2">
                        <a 
                          href={files.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          現在のPDFを確認する
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-2">PDFファイルがアップロードされていません</p>
                    )}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'pdf')}
                      className="w-full p-2 border rounded"
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">音声ファイル</h4>
                    {files.audioUrl ? (
                      <div className="mb-2">
                        <audio controls className="w-full">
                          <source src={files.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-2">音声ファイルがアップロードされていません</p>
                    )}
                    <input
                      type="file"
                      accept=".mp3,.wav"
                      onChange={(e) => handleFileUpload(e, 'audio')}
                      className="w-full p-2 border rounded"
                      disabled={uploading}
                    />
                  </div>
                </div>
                {uploading && (
                  <div className="mt-4 text-sm text-gray-600">
                    ファイルをアップロード中...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 統計情報 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">総科目数</h3>
            <p className="text-3xl font-bold text-indigo-600">{subjects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">総単元数</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {subjects.reduce((acc, subject) => acc + subject.units.length, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">
              コンテンツステータス
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              ローカルファイルシステム対応
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}