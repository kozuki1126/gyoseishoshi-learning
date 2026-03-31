import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import {
  Search,
  Filter,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  UserCheck,
  TrendingUp,
  Crown,
} from 'lucide-react';

const roleOptions = [
  { value: '', label: 'すべての権限' },
  { value: 'admin', label: '管理者' },
  { value: 'user', label: '一般会員' },
];

const statusOptions = [
  { value: '', label: 'すべてのステータス' },
  { value: 'active', label: 'アクティブ' },
  { value: 'inactive', label: '非アクティブ' },
  { value: 'suspended', label: '停止中' },
];

function StatsCard({ icon: Icon, title, value, color }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function roleBadge(user) {
  if (user.isPremium) {
    return 'bg-yellow-100 text-yellow-700';
  }

  return user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700';
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ role: '', status: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok && data.success) {
        let nextUsers = data.users;
        if (filters.role) {
          nextUsers = nextUsers.filter((user) => user.role === filters.role);
        }
        if (filters.status) {
          nextUsers = nextUsers.filter((user) => user.status === filters.status);
        }
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          nextUsers = nextUsers.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query));
        }

        const total = nextUsers.length;
        const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
        const page = Math.min(pagination.page, totalPages);
        const start = (page - 1) * pagination.limit;

        setUsers(nextUsers.slice(start, start + pagination.limit));
        setPagination((prev) => ({ ...prev, total, totalPages, page }));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.page, searchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const stats = {
    total: users.length,
    active: users.filter((user) => user.status === 'active').length,
    premium: users.filter((user) => user.isPremium).length,
    avgProgress: users.length ? Math.round(users.reduce((sum, user) => sum + user.progress, 0) / users.length) : 0,
  };

  return (
    <AdminLayout title="ユーザー管理">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Users} title="総ユーザー数" value={stats.total} color="bg-blue-600" />
        <StatsCard icon={UserCheck} title="アクティブ" value={stats.active} color="bg-green-600" />
        <StatsCard icon={Crown} title="プレミアム会員" value={stats.premium} color="bg-yellow-600" />
        <StatsCard icon={TrendingUp} title="平均進捗" value={`${stats.avgProgress}%`} color="bg-purple-600" />
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="名前またはメールで検索..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onBlur={loadUsers}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select value={filters.role} onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {roleOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))} className="rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <button onClick={loadUsers} className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200">
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
        ) : users.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500">
            <Users className="mb-4 h-12 w-12 text-gray-300" />
            <p>ユーザーが見つかりません</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ユーザー</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">権限</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ステータス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">進捗</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">最終ログイン</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">登録日</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">連絡</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${roleBadge(user)}`}>
                          {user.isPremium ? 'プレミアム' : user.role === 'admin' ? '管理者' : '一般会員'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                          {user.status === 'active' ? 'アクティブ' : user.status === 'suspended' ? '停止中' : '非アクティブ'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <div>{user.progress}%</div>
                          <div className="mt-1 h-1.5 w-20 rounded-full bg-gray-200">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: `${user.progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ja-JP') : '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.registeredAt).toLocaleDateString('ja-JP')}</td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${user.email}`} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                          <Mail className="h-4 w-4" />
                          メール
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
              <p className="text-sm text-gray-500">
                {pagination.total} 件中 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 件を表示
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={pagination.page === 1} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">{pagination.page} / {pagination.totalPages}</span>
                <button onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))} disabled={pagination.page >= pagination.totalPages} className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-50">
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
