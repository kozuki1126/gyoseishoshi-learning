import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
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
  Music
} from 'lucide-react';

// Subject options
const subjectOptions = [
  { value: '', label: 'すべての科目' },
  { value: 'constitutional-law', label: '憲法' },
  { value: 'administrative-law', label: '行政法' },
  { value: 'civil-law', label: '民法' },
  { value: 'commercial-law', label: '商法' },
  { value: 'general-knowledge', label: '一般知識等' }
];

const typeOptions = [
  { value: '', label: 'すべてのタイプ' },
  { value: 'lecture', label: '講義' },
  { value: 'practice', label: '演習' }
];

const difficultyOptions = [
  { value: '', label: 'すべての難易度' },
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' }
];

// Content Table Row Component
function ContentRow({ content, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getDifficultyBadge = (difficulty) => {
    const styles = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    const labels = {
      beginner: '初級',
      intermediate: '中級',
      advanced: '上級'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[difficulty]}`}>
        {labels[difficulty]}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      lecture: 'bg-blue-100 text-blue-700',
      practice: 'bg-purple-100 text-purple-700'
    };
    const labels = {
      lecture: '講義',
      practice: '演習'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const getSubjectName = (subjectId) => {
    const names = {
      'constitutional-law': '憲法',
      'administrative-law': '行政法',
      'civil-law': '民法',
      'commercial-law': '商法',
      'general-knowledge': '一般知識等'
    };
    return names[subjectId] || subjectId;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{content.title}</p>
            <p className="text-xs text-gray-500">ID: {content.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{getSubjectName(content.subjectId)}</span>
      </td>
      <td className="px-6 py-4">
        {getTypeBadge(content.type)}
      </td>
      <td className="px-6 py-4">
        {getDifficultyBadge(content.difficulty)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {content.hasAudio && (
            <Music className="w-4 h-4 text-green-600" title="音声あり" />
          )}
          {content.hasPdf && (
            <FileText className="w-4 h-4 text-red-600" title="PDFあり" />
          )}
          {!content.hasAudio && !content.hasPdf && (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-500">{content.updatedAt}</span>
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <Link
                  href={`/subjects/${content.subjectId}/${content.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  プレビュー
                </Link>
                <Link
                  href={`/admin/content/${content.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  編集
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(content.id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                >
                  <Trash2 className="w-4 h-4" />
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
    subject: '',
    type: '',
    difficulty: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    loadContents();
  }, [filters, pagination.page]);

  const loadContents = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock data
      const mockContents = [
        { id: '101', title: '憲法の基本原理', subjectId: 'constitutional-law', type: 'lecture', difficulty: 'beginner', hasAudio: true, hasPdf: true, updatedAt: '2024-01-15' },
        { id: '102', title: '基本的人権の体系', subjectId: 'constitutional-law', type: 'lecture', difficulty: 'intermediate', hasAudio: false, hasPdf: true, updatedAt: '2024-01-16' },
        { id: '103', title: '精神的自由権', subjectId: 'constitutional-law', type: 'lecture', difficulty: 'intermediate', hasAudio: true, hasPdf: false, updatedAt: '2024-01-17' },
        { id: '201', title: '行政法の基本原理', subjectId: 'administrative-law', type: 'lecture', difficulty: 'intermediate', hasAudio: true, hasPdf: true, updatedAt: '2024-01-20' },
        { id: '202', title: '行政行為の概念', subjectId: 'administrative-law', type: 'lecture', difficulty: 'intermediate', hasAudio: false, hasPdf: true, updatedAt: '2024-01-21' },
        { id: '301', title: '民法の基本原理', subjectId: 'civil-law', type: 'lecture', difficulty: 'beginner', hasAudio: false, hasPdf: true, updatedAt: '2024-01-25' },
        { id: '302', title: '民法総則・人', subjectId: 'civil-law', type: 'lecture', difficulty: 'beginner', hasAudio: true, hasPdf: false, updatedAt: '2024-01-26' },
        { id: '401', title: '憲法基礎問題演習', subjectId: 'constitutional-law', type: 'practice', difficulty: 'beginner', hasAudio: false, hasPdf: true, updatedAt: '2024-01-28' },
        { id: '501', title: '商法総論', subjectId: 'commercial-law', type: 'lecture', difficulty: 'beginner', hasAudio: true, hasPdf: true, updatedAt: '2024-01-30' },
        { id: '601', title: '政治学基礎', subjectId: 'general-knowledge', type: 'lecture', difficulty: 'beginner', hasAudio: false, hasPdf: false, updatedAt: '2024-02-01' }
      ];

      // Apply filters
      let filtered = mockContents;
      if (filters.subject) {
        filtered = filtered.filter(c => c.subjectId === filters.subject);
      }
      if (filters.type) {
        filtered = filtered.filter(c => c.type === filters.type);
      }
      if (filters.difficulty) {
        filtered = filtered.filter(c => c.difficulty === filters.difficulty);
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(query) || 
          c.id.includes(query)
        );
      }

      setContents(filtered);
      setPagination(prev => ({
        ...prev,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.limit)
      }));
    } catch (error) {
      console.error('Failed to load contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadContents();
  };

  const handleDelete = async (id) => {
    if (!confirm('このコンテンツを削除してもよろしいですか？')) {
      return;
    }
    // Handle delete
    setContents(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AdminLayout title="コンテンツ管理">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">コンテンツ一覧</h2>
          <p className="text-sm text-gray-500">全 {pagination.total} 件のコンテンツ</p>
        </div>
        <Link
          href="/admin/content/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="タイトルまたはIDで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjectOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficultyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              適用
            </button>
          </div>
        </form>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BookOpen className="w-12 h-12 mb-4 text-gray-300" />
            <p>コンテンツが見つかりません</p>
            <Link
              href="/admin/content/create"
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              新規コンテンツを作成
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイトル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      科目
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイプ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      難易度
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ファイル
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      更新日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contents.map(content => (
                    <ContentRow
                      key={content.id}
                      content={content}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                {pagination.total} 件中 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 件を表示
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  {pagination.page} / {pagination.totalPages || 1}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
