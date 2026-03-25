import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/features/admin/components/AdminLayout';
import {
  CONTENT_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  createEmptyContentFormData,
  getSubjectOptions,
} from '@/features/content/lib/contentMetadata';
import {
  Save,
  Eye,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  Music,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const subjectOptions = getSubjectOptions();

export default function CreateContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState(createEmptyContentFormData());

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleKeyPointChange(index, value) {
    setFormData((prev) => {
      const newKeyPoints = [...prev.keyPoints];
      newKeyPoints[index] = value;
      return { ...prev, keyPoints: newKeyPoints };
    });
  }

  function addKeyPoint() {
    setFormData((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, ''],
    }));
  }

  function removeKeyPoint(index) {
    setFormData((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function handleFileChange(field, file) {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'タイトルを入力してください' });
      return;
    }

    setSaving(true);
    setMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 300));

    setSaving(false);
    setMessage({
      type: 'info',
      text: '新規作成 API はまだ未接続です。静的な科目一覧と動的データの統合後に有効化してください。',
    });
  }

  return (
    <AdminLayout title="新規コンテンツ作成">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" />
            {activeTab === 'edit' ? 'プレビュー' : '編集'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${
            message.type === 'error'
              ? 'bg-red-50 text-red-700'
              : message.type === 'info'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-green-50 text-green-700'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="h-5 w-5" />
          ) : message.type === 'info' ? (
            <Info className="h-5 w-5" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                placeholder="例: 憲法の基本原理"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">コンテンツ (Markdown)</label>
                <div className="flex overflow-hidden rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={`px-4 py-1.5 text-sm ${
                      activeTab === 'edit'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-1.5 text-sm ${
                      activeTab === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    プレビュー
                  </button>
                </div>
              </div>

              {activeTab === 'edit' ? (
                <textarea
                  value={formData.content}
                  onChange={(event) => handleChange('content', event.target.value)}
                  rows={20}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Markdownでコンテンツを記述..."
                />
              ) : (
                <div className="prose prose-sm min-h-[400px] max-w-none overflow-y-auto rounded-lg border border-gray-200 p-4">
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <label className="mb-4 block text-sm font-medium text-gray-700">重要ポイント</label>
              <div className="space-y-3">
                {formData.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(event) => handleKeyPointChange(index, event.target.value)}
                      placeholder={`ポイント ${index + 1}`}
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.keyPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyPoint(index)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addKeyPoint}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  ポイントを追加
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-medium text-gray-700">基本設定</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">科目</label>
                  <select
                    value={formData.subjectId}
                    onChange={(event) => handleChange('subjectId', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">タイプ</label>
                  <select
                    value={formData.type}
                    onChange={(event) => handleChange('type', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CONTENT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">難易度</label>
                  <select
                    value={formData.difficulty}
                    onChange={(event) => handleChange('difficulty', event.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DIFFICULTY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">学習時間（分）</label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(event) => handleChange('estimatedTime', parseInt(event.target.value, 10) || 0)}
                    min="1"
                    max="180"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-medium text-gray-700">ファイル添付</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-600">
                    <Music className="mr-1 inline h-4 w-4" />
                    音声ファイル
                  </label>
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center transition-colors hover:border-gray-300">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(event) => handleFileChange('audioFile', event.target.files[0])}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer">
                      {formData.audioFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm">{formData.audioFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Upload className="mx-auto mb-2 h-6 w-6" />
                          <span className="text-sm">クリックしてアップロード</span>
                          <p className="mt-1 text-xs text-gray-400">MP3, WAV (50MB以下)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-600">
                    <FileText className="mr-1 inline h-4 w-4" />
                    PDFファイル
                  </label>
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center transition-colors hover:border-gray-300">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(event) => handleFileChange('pdfFile', event.target.files[0])}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      {formData.pdfFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm">{formData.pdfFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Upload className="mx-auto mb-2 h-6 w-6" />
                          <span className="text-sm">クリックしてアップロード</span>
                          <p className="mt-1 text-xs text-gray-400">PDF (10MB以下)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-blue-800">Markdownの使い方</h4>
              <ul className="space-y-1 text-xs text-blue-700">
                <li><code className="bg-blue-100 px-1"># 見出し1</code></li>
                <li><code className="bg-blue-100 px-1">## 見出し2</code></li>
                <li><code className="bg-blue-100 px-1">**太字**</code></li>
                <li><code className="bg-blue-100 px-1">*斜体*</code></li>
                <li><code className="bg-blue-100 px-1">- リスト項目</code></li>
                <li><code className="bg-blue-100 px-1">1. 番号付きリスト</code></li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
