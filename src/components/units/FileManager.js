import { useState, useEffect } from 'react';
import { Download, FileText, Headphones, Upload, Trash2, ExternalLink } from 'lucide-react';

export default function FileManager({ unitId, onUploadClick }) {
  const [files, setFiles] = useState({ pdfUrl: null, audioUrl: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (unitId) {
      loadFiles();
    }
  }, [unitId]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/content/get-files?unitId=${unitId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load files');
      }

      const data = await response.json();
      if (data.metadata) {
        setFiles({
          pdfUrl: data.metadata.pdfUrl || null,
          audioUrl: data.metadata.audioUrl || null,
        });
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url, fileName) => {
    // ダウンロード用のリンクを作成
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportProgress = async () => {
    try {
      // 進捗データを取得
      const progress = JSON.parse(localStorage.getItem('unitProgress') || '{}');
      const unitProgress = progress[unitId] || {};

      // JSONファイルとしてダウンロード
      const dataStr = JSON.stringify(unitProgress, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `unit_${unitId}_progress.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('進捗データをエクスポートしました。');
    } catch (error) {
      console.error('Error exporting progress:', error);
      alert('進捗データのエクスポートに失敗しました。');
    }
  };

  const handleExportNotes = async () => {
    try {
      // ユニットのコンテンツを取得
      const response = await fetch(`/api/content/get?unitId=${unitId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load content');
      }

      const data = await response.json();
      const content = data.content || '';

      // テキストファイルとしてダウンロード
      const dataBlob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `unit_${unitId}_notes.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('学習ノートをエクスポートしました。');
    } catch (error) {
      console.error('Error exporting notes:', error);
      alert('学習ノートのエクスポートに失敗しました。');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-900 mb-4">学習資料</h3>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">学習資料</h3>
        <button
          onClick={onUploadClick}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Upload className="w-4 h-4" />
          アップロード
        </button>
      </div>

      <div className="space-y-3">
        {/* PDF File */}
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">PDF資料</p>
                <p className="text-sm text-gray-500">
                  {files.pdfUrl ? 'アップロード済み' : '未アップロード'}
                </p>
              </div>
            </div>
            {files.pdfUrl && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open(files.pdfUrl, '_blank')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="新しいタブで開く"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(files.pdfUrl, `unit_${unitId}.pdf`)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                  title="ダウンロード"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Audio File */}
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones className="w-8 h-8 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900">音声講義</p>
                <p className="text-sm text-gray-500">
                  {files.audioUrl ? 'アップロード済み' : '未アップロード'}
                </p>
              </div>
            </div>
            {files.audioUrl && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(files.audioUrl, `unit_${unitId}_audio.mp3`)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                  title="ダウンロード"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-3 mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">データエクスポート</p>
          
          {/* Export Progress */}
          <button
            onClick={handleExportProgress}
            className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50 mb-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded">
                  <Download className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">進捗データ</p>
                  <p className="text-xs text-gray-500">学習進捗をJSONでエクスポート</p>
                </div>
              </div>
            </div>
          </button>

          {/* Export Notes */}
          <button
            onClick={handleExportNotes}
            className="w-full text-left border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded">
                  <Download className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">学習ノート</p>
                  <p className="text-xs text-gray-500">ユニット内容をテキストでエクスポート</p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
