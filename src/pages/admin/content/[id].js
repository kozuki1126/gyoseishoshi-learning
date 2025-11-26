import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/admin/AdminLayout';
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
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Options (same as create page)
const subjectOptions = [
  { value: 'constitutional-law', label: '憲法' },
  { value: 'administrative-law', label: '行政法' },
  { value: 'civil-law', label: '民法' },
  { value: 'commercial-law', label: '商法' },
  { value: 'general-knowledge', label: '一般知識等' }
];

const typeOptions = [
  { value: 'lecture', label: '講義' },
  { value: 'practice', label: '演習' }
];

const difficultyOptions = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' }
];

export default function EditContent() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: 'constitutional-law',
    type: 'lecture',
    difficulty: 'beginner',
    estimatedTime: 30,
    content: '',
    keyPoints: [''],
    hasAudio: false,
    hasPdf: false,
    audioFile: null,
    pdfFile: null
  });

  useEffect(() => {
    if (id) {
      loadContent();
    }
  }, [id]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data - in production, fetch from API
      const mockContent = {
        id: id,
        title: '憲法の基本原理',
        subjectId: 'constitutional-law',
        type: 'lecture',
        difficulty: 'beginner',
        estimatedTime: 30,
        content: `# 憲法の基本原理

## 概要

この単元では、日本国憲法の基本原理について学習します。

## 学習内容

### 1. 国民主権

国民主権とは、国家の主権が国民に存することを意味します。

#### 直接民主制と間接民主制

民主政治の形態には直接民主制と間接民主制があります。

### 2. 基本的人権の尊重

基本的人権の尊重は、個人の尊厳を基礎とします。

### 3. 平和主義

日本国憲法は平和主義を基本原理の一つとしています。

## ポイント

- 国民主権は憲法の基本原理の一つ
- 基本的人権は個人の尊厳に基づく
- 平和主義は戦争放棄を含む

## まとめ

三つの基本原理は相互に関連し合っています。`,
        keyPoints: [
          '国民主権は憲法の基本原理の一つ',
          '基本的人権は個人の尊厳に基づく',
          '平和主義は戦争放棄を含む'
        ],
        hasAudio: true,
        hasPdf: true
      };

      setFormData(mockContent);
    } catch (error) {
      console.error('Failed to load content:', error);
      setMessage({ type: 'error', text: 'コンテンツの読み込みに失敗しました' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeyPointChange = (index, value) => {
    setFormData(prev => {
      const newKeyPoints = [...prev.keyPoints];
      newKeyPoints[index] = value;
      return { ...prev, keyPoints: newKeyPoints };
    });
  };

  const addKeyPoint = () => {
    setFormData(prev => ({
      ...prev,
      keyPoints: [...prev.keyPoints, '']
    }));
  };

  const removeKeyPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'タイトルを入力してください' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // In production, send to API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage({ type: 'success', text: 'コンテンツを更新しました' });
    } catch (error) {
      setMessage({ type: 'error', text: '更新に失敗しました' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このコンテンツを削除してもよろしいですか？この操作は取り消せません。')) {
      return;
    }

    try {
      // In production, send delete request to API
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/admin/content');
    } catch (error) {
      setMessage({ type: 'error', text: '削除に失敗しました' });
    }
  };

  if (loading) {
    return (
      <AdminLayout title="コンテンツ編集">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="コンテンツ編集">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            削除
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            {activeTab === 'edit' ? 'プレビュー' : '編集'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? '保存中...' : '更新'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message.type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="例: 憲法の基本原理"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-2">ID: {id}</p>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">
                  コンテンツ (Markdown)
                </label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
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
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Markdownでコンテンツを記述..."
                />
              ) : (
                <div className="prose prose-sm max-w-none p-4 border border-gray-200 rounded-lg min-h-[400px] overflow-y-auto">
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Key Points */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                重要ポイント
              </label>
              <div className="space-y-3">
                {formData.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => handleKeyPointChange(index, e.target.value)}
                      placeholder={`ポイント ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.keyPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyPoint(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addKeyPoint}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  ポイントを追加
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Basic Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">基本設定</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">科目</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => handleChange('subjectId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjectOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">タイプ</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {typeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">難易度</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {difficultyOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    学習時間（分）
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) => handleChange('estimatedTime', parseInt(e.target.value) || 0)}
                    min="1"
                    max="180"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">ファイル添付</h3>
              
              <div className="space-y-4">
                {/* Current Audio Status */}
                {formData.hasAudio && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Music className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">音声ファイルあり</span>
                  </div>
                )}

                {/* Audio Upload */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    <Music className="w-4 h-4 inline mr-1" />
                    音声ファイル {formData.hasAudio ? '(置き換え)' : ''}
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange('audioFile', e.target.files[0])}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label htmlFor="audio-upload" className="cursor-pointer">
                      {formData.audioFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm">{formData.audioFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Upload className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm">クリックしてアップロード</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Current PDF Status */}
                {formData.hasPdf && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">PDFファイルあり</span>
                  </div>
                )}

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    PDFファイル {formData.hasPdf ? '(置き換え)' : ''}
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange('pdfFile', e.target.files[0])}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      {formData.pdfFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm">{formData.pdfFile.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <Upload className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm">クリックしてアップロード</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
