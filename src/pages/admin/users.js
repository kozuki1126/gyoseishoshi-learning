import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';

// Role options
const roleOptions = [
  { value: '', label: 'すべての権限' },
  { value: 'admin', label: '管理者' },
  { value: 'premium', label: 'プレミアム会員' },
  { value: 'user', label: '一般会員' }
];

const statusOptions = [
  { value: '', label: 'すべてのステータス' },
  { value: 'active', label: 'アクティブ' },
  { value: 'inactive', label: '非アクティブ' },
  { value: 'suspended', label: '停止中' }
];

// User Row Component
function UserRow({ user, onEdit, onDelete, onToggleStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700',
      premium: 'bg-yellow-100 text-yellow-700',
      user: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      admin: '管理者',
      premium: 'プレミアム',
      user: '一般会員'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700'
    };
    const labels = {
      active: 'アクティブ',
      inactive: '非アクティブ',
      suspended: '停止中'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {getRoleBadge(user.role)}
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(user.status)}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          <div>{user.progress}%</div>
          <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${user.progress}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-500">{user.lastLogin}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-500">{user.registeredAt}</span>
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
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(user);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                >
                  <Edit className="w-4 h-4" />
                  編集
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    // Open email client
                    window.location.href = `mailto:${user.email}`;
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                >
                  <Mail className="w-4 h-4" />
                  メール送信
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onToggleStatus(user);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                >
                  {user.status === 'active' ? (
                    <>
                      <UserX className="w-4 h-4" />
                      アカウント停止
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      アカウント有効化
                    </>
                  )}
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(user);
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

// Stats Card
function StatsCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock data
      const mockUsers = [
        { id: '1', name: '山田 太郎', email: 'yamada@example.com', role: 'admin', status: 'active', progress: 100, lastLogin: '2024-01-15', registeredAt: '2023-06-01' },
        { id: '2', name: '鈴木 花子', email: 'suzuki@example.com', role: 'premium', status: 'active', progress: 75, lastLogin: '2024-01-14', registeredAt: '2023-08-15' },
        { id: '3', name: '田中 一郎', email: 'tanaka@example.com', role: 'user', status: 'active', progress: 45, lastLogin: '2024-01-13', registeredAt: '2023-09-20' },
        { id: '4', name: '佐藤 美咲', email: 'sato@example.com', role: 'premium', status: 'active', progress: 90, lastLogin: '2024-01-15', registeredAt: '2023-07-10' },
        { id: '5', name: '高橋 健太', email: 'takahashi@example.com', role: 'user', status: 'inactive', progress: 20, lastLogin: '2023-12-01', registeredAt: '2023-10-05' },
        { id: '6', name: '伊藤 さくら', email: 'ito@example.com', role: 'user', status: 'active', progress: 60, lastLogin: '2024-01-14', registeredAt: '2023-11-15' },
        { id: '7', name: '渡辺 大輔', email: 'watanabe@example.com', role: 'premium', status: 'suspended', progress: 35, lastLogin: '2023-11-20', registeredAt: '2023-05-25' },
        { id: '8', name: '小林 優子', email: 'kobayashi@example.com', role: 'user', status: 'active', progress: 55, lastLogin: '2024-01-12', registeredAt: '2023-12-01' }
      ];

      // Apply filters
      let filtered = mockUsers;
      if (filters.role) {
        filtered = filtered.filter(u => u.role === filters.role);
      }
      if (filters.status) {
        filtered = filtered.filter(u => u.status === filters.status);
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(u =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
        );
      }

      setUsers(filtered);
      setPagination(prev => ({
        ...prev,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.limit)
      }));
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (user) => {
    if (!confirm(`${user.name} を削除してもよろしいですか？`)) {
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, status: newStatus } : u
    ));
  };

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    premium: users.filter(u => u.role === 'premium').length,
    avgProgress: users.length > 0
      ? Math.round(users.reduce((sum, u) => sum + u.progress, 0) / users.length)
      : 0
  };

  return (
    <AdminLayout title="ユーザー管理">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard icon={Users} title="総ユーザー数" value={stats.total} color="bg-blue-600" />
        <StatsCard icon={UserCheck} title="アクティブ" value={stats.active} color="bg-green-600" />
        <StatsCard icon={Shield} title="プレミアム会員" value={stats.premium} color="bg-yellow-600" />
        <StatsCard icon={TrendingUp} title="平均進捗" value={`${stats.avgProgress}%`} color="bg-purple-600" />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="名前またはメールで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(opt => (
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Users className="w-12 h-12 mb-4 text-gray-300" />
            <p>ユーザーが見つかりません</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      権限
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      進捗
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最終ログイン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
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

      {/* Edit Modal - simplified version */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">ユーザー編集</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">名前</label>
                <input
                  type="text"
                  defaultValue={editingUser.name}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">メール</label>
                <input
                  type="email"
                  defaultValue={editingUser.email}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">権限</label>
                <select
                  defaultValue={editingUser.role}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="admin">管理者</option>
                  <option value="premium">プレミアム会員</option>
                  <option value="user">一般会員</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
