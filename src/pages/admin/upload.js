import { useState, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Upload,
  FileText,
  Music,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  FolderOpen,
  HardDrive
} from 'lucide-react';

// File type configurations
const fileTypes = {
  pdf: {
    label: 'PDF',
    accept: '.pdf',
    maxSize: 10 * 1024 * 1024, // 10MB
    icon: FileText,
    color: 'text-red-600 bg-red-100'
  },
  audio: {
    label: '音声',
    accept: 'audio/*,.mp3,.wav,.m4a',
    maxSize: 50 * 1024 * 1024, // 50MB
    icon: Music,
    color: 'text-green-600 bg-green-100'
  }
};

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// File Item Component
function FileItem({ file, onRemove }) {
  const isAudio = file.type.startsWith('audio') || file.name.match(/\.(mp3|wav|m4a)$/i);
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
  
  const Icon = isAudio ? Music : FileText;
  const colorClass = isAudio ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>
      {file.status === 'uploading' && (
        <div className="w-20">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${file.progress || 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">{file.progress || 0}%</p>
        </div>
      )}
      {file.status === 'success' && (
        <CheckCircle className="w-5 h-5 text-green-600" />
      )}
      {file.status === 'error' && (
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-xs text-red-600">{file.error}</span>
        </div>
      )}
      <button
        onClick={() => onRemove(file.id)}
        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}

// Existing File Component
function ExistingFile({ file, onDelete }) {
  const Icon = file.type === 'audio' ? Music : FileText;
  const colorClass = file.type === 'audio' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)} • {file.unitId ? `単元: ${file.unitId}` : '未割当'}
        </p>
      </div>
      <button
        onClick={() => onDelete(file.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState('upload'); // upload, files
  const [fileType, setFileType] = useState('pdf');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock existing files
  const [existingFiles, setExistingFiles] = useState([
    { id: '1', name: '101_憲法の基本原理.pdf', type: 'pdf', size: 2456789, unitId: '101' },
    { id: '2', name: '101_audio.mp3', type: 'audio', size: 15678901, unitId: '101' },
    { id: '3', name: '201_行政法の基本原理.pdf', type: 'pdf', size: 3567890, unitId: '201' },
    { id: '4', name: '201_audio.mp3', type: 'audio', size: 18901234, unitId: '201' },
    { id: '5', name: '301_民法の基本原理.pdf', type: 'pdf', size: 2890123, unitId: '301' }
  ]);

  const config = fileTypes[fileType];

  const validateFile = (file) => {
    // Check file size
    if (file.size > config.maxSize) {
      return `ファイルサイズが大きすぎます（最大: ${formatFileSize(config.maxSize)}）`;
    }

    // Check file type
    const isValidType = fileType === 'pdf'
      ? file.type === 'application/pdf' || file.name.endsWith('.pdf')
      : file.type.startsWith('audio') || file.name.match(/\.(mp3|wav|m4a)$/i);

    if (!isValidType) {
      return '無効なファイル形式です';
    }

    return null;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => {
      const error = validateFile(file);
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'pending',
        error,
        progress: 0
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [fileType]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setUploading(true);

    for (const fileItem of pendingFiles) {
      // Update status to uploading
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? { ...f, progress: i } : f
        ));
      }

      // Mark as success
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, status: 'success', progress: 100 } : f
      ));

      // Add to existing files
      setExistingFiles(prev => [...prev, {
        id: fileItem.id,
        name: fileItem.name,
        type: fileType,
        size: fileItem.size,
        unitId: null
      }]);
    }

    setUploading(false);
  };

  const deleteExistingFile = (id) => {
    if (!confirm('このファイルを削除してもよろしいですか？')) return;
    setExistingFiles(prev => prev.filter(f => f.id !== id));
  };

  // Calculate storage stats
  const storageUsed = existingFiles.reduce((sum, f) => sum + f.size, 0);
  const storageTotal = 10 * 1024 * 1024 * 1024; // 10GB
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <AdminLayout title="ファイル管理">
      {/* Storage Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">ストレージ使用量</h3>
            <p className="text-sm text-gray-500">
              {formatFileSize(storageUsed)} / {formatFileSize(storageTotal)} 使用中
            </p>
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              storagePercent > 80 ? 'bg-red-500' : storagePercent > 60 ? 'bg-yellow-500' : 'bg-blue-600'
            }`}
            style={{ width: `${storagePercent}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          アップロード
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'files'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FolderOpen className="w-4 h-4 inline mr-2" />
          ファイル一覧 ({existingFiles.length})
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* File Type Selector */}
              <div className="flex gap-4 mb-6">
                {Object.entries(fileTypes).map(([key, type]) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setFileType(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                        fileType === key
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  );
                })}
              </div>

              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept={config.accept}
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    ファイルをドラッグ＆ドロップ
                  </p>
                  <p className="text-sm text-gray-400 mb-4">または</p>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    ファイルを選択
                  </span>
                </label>
                <p className="text-xs text-gray-400 mt-4">
                  {config.label}ファイル • 最大 {formatFileSize(config.maxSize)}
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-gray-800">選択されたファイル</h4>
                  {files.map(file => (
                    <FileItem key={file.id} file={file} onRemove={removeFile} />
                  ))}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setFiles([])}
                      className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      クリア
                    </button>
                    <button
                      onClick={uploadFiles}
                      disabled={uploading || files.filter(f => f.status === 'pending').length === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploading ? 'アップロード中...' : 'アップロード'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-medium text-gray-800 mb-4">ファイル命名規則</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">PDFファイル</p>
                  <code className="text-xs text-blue-600">[単元ID]_[タイトル].pdf</code>
                  <p className="text-xs text-gray-500 mt-1">例: 101_憲法の基本原理.pdf</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">音声ファイル</p>
                  <code className="text-xs text-blue-600">[単元ID]_audio.mp3</code>
                  <p className="text-xs text-gray-500 mt-1">例: 101_audio.mp3</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4">
              <h4 className="font-medium text-yellow-800 mb-2">注意事項</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• PDFは最大10MBまで</li>
                <li>• 音声は最大50MBまで</li>
                <li>• 同名ファイルは上書きされます</li>
                <li>• MP3, WAV, M4A形式に対応</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Files List Tab */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Filter */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              すべて ({existingFiles.length})
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              PDF ({existingFiles.filter(f => f.type === 'pdf').length})
            </button>
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              音声 ({existingFiles.filter(f => f.type === 'audio').length})
            </button>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingFiles.map(file => (
              <ExistingFile
                key={file.id}
                file={file}
                onDelete={deleteExistingFile}
              />
            ))}
          </div>

          {existingFiles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>ファイルがありません</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
