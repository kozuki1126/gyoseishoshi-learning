import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/features/admin/components/AdminLayout';
import {
  ACCESS_LEVEL_BADGE_CLASSES,
  ACCESS_LEVEL_OPTIONS,
  CONTENT_TYPE_BADGE_CLASSES,
  CONTENT_TYPE_OPTIONS,
  DIFFICULTY_BADGE_CLASSES,
  DIFFICULTY_OPTIONS,
  STATUS_BADGE_CLASSES,
  STATUS_OPTIONS,
  getAccessLevelLabel,
  getDifficultyLabel,
  getStatusLabel,
  getSubjectName,
  getSubjectOptions,
  getTypeLabel,
} from '@/features/content/lib/contentMetadata';
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Music,
  AlertCircle,
  Info,
} from 'lucide-react';

const subjectOptions = getSubjectOptions({ includeAll: true });
const typeOptions = [{ value: '', label: 'すべてのタイプ' }, ...CONTENT_TYPE_OPTIONS];
const difficultyOptions = [{ value: '', label: 'すべての難易度' }, ...DIFFICULTY_OPTIONS];
const accessLevelOptions = [{ value: '', label: 'すべての公開範囲' }, ...ACCESS_LEVEL_OPTIONS];
const statusOptions = [{ value: '', label: 'すべての状態' }, ...STATUS_OPTIONS];
const PAGE_SIZE = 10;

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('ja-JP');
}

function ContentRow({ content, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const previewHref = `/subjects/${content.subjectId}/${content.id}?adminPreview=1`;

  function handlePreviewClick() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('admin-unit-preview', '1');
    }
    setMenuOpen(false);
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{content.title}</p>
            <p className="text-xs text-gray-500">ID: {content.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{getSubjectName(content.subjectId)}</td>
      <td className="px-6 py-4">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${CONTENT_TYPE_BADGE_CLASSES[content.type] || 'bg-gray-100 text-gray-700'}`}>
          {getTypeLabel(content.type)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${DIFFICULTY_BADGE_CLASSES[content.difficulty] || 'bg-gray-100 text-gray-700'}`}>
          {getDifficultyLabel(content.difficulty)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${ACCESS_LEVEL_BADGE_CLASSES[content.accessLevel] || 'bg-gray-100 text-gray-700'}`}>
          {getAccessLevelLabel(content.accessLevel)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_BADGE_CLASSES[content.status] || 'bg-gray-100 text-gray-700'}`}>
          {getStatusLabel(content.status)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {content.hasAudio && <Music className="h-4 w-4 text-green-600" title="音声あり" />}
          {content.hasPdf && <FileText className="h-4 w-4 text-red-600" title="PDFあり" />}
          {!content.hasAudio && !content.hasPdf && <span className="text-xs text-gray-400">-</span>}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(content.updatedAt)}</td>
      <td className="px-6 py-4">
        <div className="relative">
          <button onClick={() => setMenuOpen((prev) => !prev)} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
                <Link href={previewHref} onClick={handlePreviewClick} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Eye className="h-4 w-4" />
                  プレビュー
                </Link>
                <Link href={`/admin/content/${content.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Edit className="h-4 w-4" />
                  編集
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(content.id);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  削除
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function ContentList() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subjectId: '',
    type: '',
    difficulty: '',
    accessLevel: '',
    status: '',
  });
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [notice, setNotice] = useState(null);

  const loadContents = useCallback(async () => {
    setLoading(true);
    setNotice(null);

    try {
      const params = new URLSearchParams({
        includeDraft: 'true',
        limit: '500',
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const res = await fetch(`/api/admin/content?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'コンテンツの取得に失敗しました');
      }

      const query = searchQuery.trim().toLowerCase();
      const matched = query
        ? data.units.filter((unit) =>
            [unit.title, getSubjectName(unit.subjectId), unit.id].join(' ').toLowerCase().includes(query)
          )
        : data.units;

      const total = matched.length;
      const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      const page = Math.min(pagination.page, totalPages);
      const start = (page - 1) * PAGE_SIZE;

      setContents(matched.slice(start, start + PAGE_SIZE));
      setPagination({ page, total, totalPages });
    } catch (error) {
      console.error('Failed to load contents:', error);
      setNotice({ type: 'error', text: error.message || 'コンテンツの読み込みに失敗しました' });
      setContents([]);
      setPagination({ page: 1, total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, searchQuery]);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  async function handleDelete(id) {
    if (!confirm('このコンテンツを削除しますか？')) {
      return;
    }

    const res = await fetch(`/api/admin/content/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      setNotice({ type: 'error', text: data.error || '削除に失敗しました' });
      return;
    }

    setNotice({ type: 'info', text: 'コンテンツを削除しました' });
    loadContents();
  }

  return (
    <AdminLayout title="コンテンツ管理">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">コンテンツ一覧</h2>
          <p className="text-sm text-gray-500">全 {pagination.total} 件のコンテンツ</p>
        </div>
        <Link href="/admin/content/create" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          新規作成
        </Link>
      </div>

      {notice && (
        <div className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${notice.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {notice.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
          {notice.text}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="タイトルまたはIDで検索..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onBlur={loadContents}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select value={filters.subjectId} onChange={(event) => setFilters((prev) => ({ ...prev, subjectId: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {subjectOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={filters.difficulty} onChange={(event) => setFilters((prev) => ({ ...prev, difficulty: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {difficultyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={filters.accessLevel} onChange={(event) => setFilters((prev) => ({ ...prev, accessLevel: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {accessLevelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <button onClick={loadContents} className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200">
              <Filter className="h-4 w-4" />
              適用
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : contents.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500">
            <BookOpen className="mb-4 h-12 w-12 text-gray-300" />
            <p>コンテンツが見つかりません</p>
            <Link href="/admin/content/create" className="mt-4 text-blue-600 hover:text-blue-700">
              新規コンテンツを作成
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">タイトル</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">科目</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">タイプ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">難易度</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">公開範囲</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">状態</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ファイル</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">更新日</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contents.map((content) => <ContentRow key={content.id} content={content} onDelete={handleDelete} />)}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                {pagination.total} 件中 {(pagination.page - 1) * PAGE_SIZE + 1} - {Math.min(pagination.page * PAGE_SIZE, pagination.total)} 件を表示
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={pagination.page === 1} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">{pagination.page} / {pagination.totalPages}</span>
                <button onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))} disabled={pagination.page >= pagination.totalPages} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
