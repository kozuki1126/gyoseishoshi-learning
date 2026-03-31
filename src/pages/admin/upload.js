import { useEffect, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import { Upload, FileText, Music, Trash2, FolderOpen, HardDrive, AlertCircle, CheckCircle } from 'lucide-react';

const fileTypes = {
  pdf: { label: 'PDF', accept: '.pdf', icon: FileText, color: 'text-red-600 bg-red-100' },
  audio: { label: '音声', accept: 'audio/*,.mp3,.wav,.m4a', icon: Music, color: 'text-green-600 bg-green-100' },
};

function formatFileSize(bytes) {
  if (!bytes) {
    return '0 Bytes';
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / 1024 ** index).toFixed(2))} ${sizes[index]}`;
}

function ExistingFile({ file, onDelete }) {
  const Icon = file.type === 'audio' ? Music : FileText;
  const colorClass = file.type === 'audio' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">{file.name}</p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)} • {file.unitTitle ? `${file.unitTitle} (${file.unitId})` : '未割当'}
        </p>
      </div>
      <button onClick={() => onDelete(file.path)} className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [fileType, setFileType] = useState('pdf');
  const [unitId, setUnitId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);

  async function loadFiles() {
    const res = await fetch('/api/upload');
    const data = await res.json();
    if (res.ok && data.success) {
      setExistingFiles(data.files);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function uploadFile() {
    if (!selectedFile) {
      setNotice({ type: 'error', text: 'アップロードするファイルを選択してください' });
      return;
    }

    setUploading(true);
    setNotice(null);

    const payload = new FormData();
    payload.append('type', fileType);
    payload.append('unitId', unitId || 'manual');
    payload.append('file', selectedFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: payload,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'アップロードに失敗しました');
      }

      setNotice({ type: 'success', text: 'ファイルをアップロードしました' });
      setSelectedFile(null);
      setUnitId('');
      await loadFiles();
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'アップロードに失敗しました' });
    } finally {
      setUploading(false);
    }
  }

  async function deleteFile(filePath) {
    if (!confirm('このファイルを削除しますか？')) {
      return;
    }

    const res = await fetch(`/api/upload?path=${encodeURIComponent(filePath)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setNotice({ type: 'error', text: data.error || '削除に失敗しました' });
      return;
    }

    setNotice({ type: 'success', text: 'ファイルを削除しました' });
    await loadFiles();
  }

  const storageUsed = existingFiles.reduce((sum, file) => sum + file.size, 0);
  const storageTotal = 10 * 1024 * 1024 * 1024;
  const storagePercent = (storageUsed / storageTotal) * 100;
  const config = fileTypes[fileType];

  return (
    <AdminLayout title="ファイル管理">
      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <HardDrive className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">ストレージ使用量</h3>
            <p className="text-sm text-gray-500">{formatFileSize(storageUsed)} / {formatFileSize(storageTotal)} 使用中</p>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div className={`h-full rounded-full ${storagePercent > 80 ? 'bg-red-500' : storagePercent > 60 ? 'bg-yellow-500' : 'bg-blue-600'}`} style={{ width: `${storagePercent}%` }} />
        </div>
      </div>

      <div className="mb-6 flex border-b border-gray-200">
        <button onClick={() => setActiveTab('upload')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          <Upload className="mr-2 inline h-4 w-4" />
          アップロード
        </button>
        <button onClick={() => setActiveTab('files')} className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'files' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          <FolderOpen className="mr-2 inline h-4 w-4" />
          ファイル一覧 ({existingFiles.length})
        </button>
      </div>

      {notice && (
        <div className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${notice.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {notice.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          {notice.text}
        </div>
      )}

      {activeTab === 'upload' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex gap-4">
              {Object.entries(fileTypes).map(([key, value]) => {
                const Icon = value.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setFileType(key)}
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors ${fileType === key ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {value.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <input value={unitId} onChange={(event) => setUnitId(event.target.value)} placeholder="関連する単元ID（任意）" className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <label className="block rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400">
                <input type="file" accept={config.accept} className="hidden" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
                {selectedFile ? (
                  <div className="text-green-600">
                    <CheckCircle className="mx-auto mb-2 h-10 w-10" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-green-700">{formatFileSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Upload className="mx-auto mb-4 h-12 w-12" />
                    <p>{config.label}ファイルを選択</p>
                    <p className="mt-2 text-sm text-gray-400">クリックしてアップロード対象を指定します</p>
                  </div>
                )}
              </label>
              <div className="flex justify-end">
                <button onClick={uploadFile} disabled={uploading || !selectedFile} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                  {uploading ? 'アップロード中...' : 'アップロード'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-medium text-gray-800">アップロードメモ</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>音声・PDF は保存後すぐ一覧に反映されます。</li>
                <li>コンテンツ編集画面から添付したファイルもここに表示されます。</li>
                <li>不要なファイルは一覧タブから削除できます。</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {existingFiles.map((file) => <ExistingFile key={file.id} file={file} onDelete={deleteFile} />)}
          </div>
          {existingFiles.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <FolderOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p>ファイルがありません</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
