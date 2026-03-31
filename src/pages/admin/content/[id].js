import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/features/admin/components/AdminLayout';
import {
  ACCESS_LEVEL_OPTIONS,
  CONTENT_FORMAT_OPTIONS,
  CONTENT_HTML_TEMPLATE,
  CONTENT_MARKDOWN_TEMPLATE,
  CONTENT_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
  getSubjectOptions,
  unitToEditorFormData,
} from '@/features/content/lib/contentMetadata';
import { Save, Eye, ArrowLeft, Trash2, Upload, FileText, Music, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import HtmlContentRenderer from '@/features/content/components/HtmlContentRenderer';
import { parseHtmlContentDocument } from '@/features/content/lib/htmlUtils';

const subjectOptions = getSubjectOptions();

export default function EditContent() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subjectId: subjectOptions[0]?.value || '',
    type: 'lecture',
    difficulty: 'beginner',
    estimatedTime: 30,
    accessLevel: 'free',
    status: 'draft',
    contentFormat: 'markdown',
    content: '',
    audioFile: null,
    pdfFile: null,
    htmlFile: null,
    hasAudio: false,
    hasPdf: false,
    audioUrl: null,
    pdfUrl: null,
  });

  useEffect(() => {
    async function loadContent() {
      if (!id) {
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/admin/content/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'コンテンツの読み込みに失敗しました');
        }

        setFormData({
          ...unitToEditorFormData(data.unit),
          audioUrl: data.unit.audioUrl,
          pdfUrl: data.unit.pdfUrl,
        });
      } catch (error) {
        setMessage({ type: 'error', text: error.message || 'コンテンツの読み込みに失敗しました' });
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [id]);

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleFormatChange(nextFormat) {
    setFormData((prev) => {
      let nextContent = prev.content;
      if (nextFormat === 'html' && (!prev.content || prev.content === CONTENT_MARKDOWN_TEMPLATE)) {
        nextContent = CONTENT_HTML_TEMPLATE;
      }
      if (nextFormat === 'markdown' && (!prev.content || prev.content === CONTENT_HTML_TEMPLATE)) {
        nextContent = CONTENT_MARKDOWN_TEMPLATE;
      }

      return {
        ...prev,
        contentFormat: nextFormat,
        content: nextContent,
        htmlFile: nextFormat === 'html' ? prev.htmlFile : null,
      };
    });
  }

  async function handleHtmlFileChange(event) {
    const file = event.target.files?.[0] || null;
    if (!file) {
      handleChange('htmlFile', null);
      return;
    }

    const html = await file.text();
    setFormData((prev) => ({
      ...prev,
      contentFormat: 'html',
      content: html,
      htmlFile: file,
    }));
    setActiveTab('preview');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = new FormData();
    Object.entries({
      title: formData.title,
      subjectId: formData.subjectId,
      type: formData.type,
      difficulty: formData.difficulty,
      estimatedTime: String(formData.estimatedTime),
      accessLevel: formData.accessLevel,
      status: formData.status,
      contentFormat: formData.contentFormat,
      content: formData.content,
    }).forEach(([key, value]) => payload.append(key, value));

    if (formData.audioFile) {
      payload.append('audioFile', formData.audioFile);
    }
    if (formData.pdfFile) {
      payload.append('pdfFile', formData.pdfFile);
    }
    if (formData.contentFormat === 'html' && formData.htmlFile) {
      payload.append('htmlFile', formData.htmlFile);
    }

    try {
      const res = await fetch(`/api/admin/content/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: payload,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setFormData((prev) => ({
        ...prev,
        hasAudio: data.unit.hasAudio,
        hasPdf: data.unit.hasPdf,
        audioUrl: data.unit.audioUrl,
        pdfUrl: data.unit.pdfUrl,
        audioFile: null,
        pdfFile: null,
        htmlFile: null,
      }));
      setMessage({ type: 'success', text: 'コンテンツを更新しました' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || '更新に失敗しました' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('このコンテンツを削除しますか？')) {
      return;
    }

    const res = await fetch(`/api/admin/content/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      setMessage({ type: 'error', text: data.error || '削除に失敗しました' });
      return;
    }

    router.push('/admin/content');
  }

  const htmlPreview = formData.contentFormat === 'html' ? parseHtmlContentDocument(formData.content) : null;

  if (loading) {
    return (
      <AdminLayout title="コンテンツ編集">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="コンテンツ編集">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4" />
          戻る
        </button>
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleDelete} className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
            削除
          </button>
          <button type="button" onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')} className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
            <Eye className="h-4 w-4" />
            {activeTab === 'edit' ? 'プレビュー' : '編集'}
          </button>
          <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? '保存中...' : '更新'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${message.type === 'error' ? 'bg-red-50 text-red-700' : message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
          {message.type === 'error' ? <AlertCircle className="h-5 w-5" /> : message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-gray-700">タイトル</label>
              <input data-testid="content-title-input" value={formData.title} onChange={(event) => handleChange('title', event.target.value)} className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p className="mt-2 text-xs text-gray-400">ID: {id}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">コンテンツ ({formData.contentFormat === 'html' ? 'HTML' : 'Markdown'})</label>
                <div className="flex overflow-hidden rounded-lg border border-gray-200">
                  <button type="button" onClick={() => setActiveTab('edit')} className={`px-4 py-1.5 text-sm ${activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>編集</button>
                  <button type="button" onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 text-sm ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>プレビュー</button>
                </div>
              </div>
              {activeTab === 'edit' ? (
                <textarea data-testid="content-edit-textarea" value={formData.content} onChange={(event) => handleChange('content', event.target.value)} rows={20} className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              ) : (
                formData.contentFormat === 'html' ? (
                  <div className="min-h-[400px] rounded-lg border border-gray-200 p-4">
                    <HtmlContentRenderer
                      html={htmlPreview?.html || ''}
                      css={htmlPreview?.css || ''}
                      stylesheets={htmlPreview?.stylesheets || []}
                    />
                  </div>
                ) : (
                  <div className="prose prose-sm min-h-[400px] max-w-none rounded-lg border border-gray-200 p-4">
                    <ReactMarkdown>{formData.content}</ReactMarkdown>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-medium text-gray-700">基本設定</h3>
              <div className="space-y-4">
                <select data-testid="content-subject-select" value={formData.subjectId} onChange={(event) => handleChange('subjectId', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {subjectOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <select value={formData.type} onChange={(event) => handleChange('type', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {CONTENT_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <select value={formData.difficulty} onChange={(event) => handleChange('difficulty', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {DIFFICULTY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <select data-testid="content-access-level-select" value={formData.accessLevel} onChange={(event) => handleChange('accessLevel', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {ACCESS_LEVEL_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <select data-testid="content-status-select" value={formData.status} onChange={(event) => handleChange('status', event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <select data-testid="content-format-select" value={formData.contentFormat} onChange={(event) => handleFormatChange(event.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {CONTENT_FORMAT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <input type="number" min="1" max="180" value={formData.estimatedTime} onChange={(event) => handleChange('estimatedTime', Number(event.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-medium text-gray-700">ファイル添付</h3>
              <div className="space-y-4">
                <label className="block rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:border-gray-300">
                  <input data-testid="html-file-input" type="file" accept=".html,.htm,text/html" className="hidden" onChange={handleHtmlFileChange} />
                  {formData.htmlFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600"><CheckCircle className="h-5 w-5" /><span className="text-sm">{formData.htmlFile.name}</span></div>
                  ) : (
                    <div className="text-gray-500"><FileText className="mx-auto mb-2 h-6 w-6" /><span className="text-sm">HTMLファイルを差し替え</span></div>
                  )}
                </label>
                {formData.audioUrl && (
                  <a href={formData.audioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    <Music className="h-4 w-4" />
                    現在の音声ファイルを確認
                  </a>
                )}
                <label className="block rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:border-gray-300">
                  <input type="file" accept="audio/*" className="hidden" onChange={(event) => handleChange('audioFile', event.target.files?.[0] || null)} />
                  {formData.audioFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600"><CheckCircle className="h-5 w-5" /><span className="text-sm">{formData.audioFile.name}</span></div>
                  ) : (
                    <div className="text-gray-500"><Music className="mx-auto mb-2 h-6 w-6" /><span className="text-sm">音声ファイルを差し替え</span></div>
                  )}
                </label>

                {formData.pdfUrl && (
                  <a href={formData.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                    <FileText className="h-4 w-4" />
                    現在のPDFファイルを確認
                  </a>
                )}
                <label className="block rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:border-gray-300">
                  <input type="file" accept=".pdf" className="hidden" onChange={(event) => handleChange('pdfFile', event.target.files?.[0] || null)} />
                  {formData.pdfFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600"><CheckCircle className="h-5 w-5" /><span className="text-sm">{formData.pdfFile.name}</span></div>
                  ) : (
                    <div className="text-gray-500"><FileText className="mx-auto mb-2 h-6 w-6" /><span className="text-sm">PDFファイルを差し替え</span></div>
                  )}
                </label>

                <div className="rounded-xl bg-blue-50 p-4 text-xs text-blue-700">
                  <div className="flex items-center gap-2"><Upload className="h-4 w-4" />更新時に HTML・音声・PDF の差し替えをまとめて反映できます。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
