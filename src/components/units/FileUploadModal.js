import { useState } from 'react';
import { X, Upload, FileText, Headphones, Check, AlertCircle } from 'lucide-react';

export default function FileUploadModal({ unitId, isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ファイルサイズチェック (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('ファイルサイズは10MB以下にしてください。');
      return;
    }

    // ファイルタイプの自動判定
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension === 'pdf') {
      setFileType('pdf');
    } else if (['mp3', 'wav', 'm4a', 'ogg'].includes(fileExtension)) {
      setFileType('audio');
    } else {
      setError('対応していないファイル形式です。PDF、またはオーディオファイルを選択してください。');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileType) {
      setError('ファイルを選択してください。');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileType', fileType);
      formData.append('unitId', unitId);

      // アップロード進捗のシミュレーション
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`/api/content/upload?unitId=${unitId}`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'アップロードに失敗しました。');
      }

      const data = await response.json();
      
      setSuccess(true);
      
      // 成功後、親コンポーネントに通知
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }

      // 2秒後に自動的にモーダルを閉じる
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'アップロードに失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileType('');
    setUploadProgress(0);
    setError('');
    setSuccess(false);
    onClose();
  };

  const getFileIcon = () => {
    if (fileType === 'pdf') {
      return <FileText className="w-12 h-12 text-red-500" />;
    } else if (fileType === 'audio') {
      return <Headphones className="w-12 h-12 text-purple-500" />;
    }
    return <Upload className="w-12 h-12 text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            学習資料のアップロード
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* File Drop Zone */}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className={`relative cursor-pointer bg-gray-50 rounded-lg border-2 border-dashed ${
                selectedFile ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
              } p-6 hover:border-blue-400 transition-colors`}
            >
              <div className="text-center">
                {getFileIcon()}
                
                {selectedFile ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">
                        クリックしてファイルを選択
                      </span>
                      {' '}またはドラッグ＆ドロップ
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF、MP3、WAV、M4A (最大10MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.mp3,.wav,.m4a,.ogg"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">アップロード中...</span>
                <span className="text-sm font-medium text-gray-900">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-green-600">
                ファイルが正常にアップロードされました！
              </p>
            </div>
          )}

          {/* File Type Info */}
          {selectedFile && !isUploading && !success && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {fileType === 'pdf' ? (
                  <>このPDFファイルは学習資料として保存されます。</>
                ) : (
                  <>この音声ファイルは講義音声として保存されます。</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isUploading}
          >
            キャンセル
          </button>
          <button
            onClick={handleUpload}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              selectedFile && !isUploading && !success
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedFile || isUploading || success}
          >
            {isUploading ? 'アップロード中...' : 'アップロード'}
          </button>
        </div>
      </div>
    </div>
  );
}
