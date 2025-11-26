import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Stats Card Component
function StatsCard({ title, value, change, changeType, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              changeType === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'up' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Recent Activity Item
function ActivityItem({ type, title, time, user }) {
  const getTypeIcon = () => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'edit':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'view':
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
        {getTypeIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{user}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}

// Quick Action Button
function QuickAction({ icon: Icon, title, href, color }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm text-gray-600">{title}</span>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalUsers: 0,
    totalFiles: 0,
    studyHours: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentContent, setRecentContent] = useState([]);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      try {
        // In production, fetch from API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats({
          totalUnits: 53,
          totalUsers: 128,
          totalFiles: 42,
          studyHours: 1240
        });

        setRecentContent([
          { id: '101', title: '憲法の基本原理', subject: '憲法', updatedAt: '2時間前' },
          { id: '201', title: '行政法の基本原理', subject: '行政法', updatedAt: '5時間前' },
          { id: '301', title: '民法の基本原理', subject: '民法', updatedAt: '1日前' },
          { id: '102', title: '基本的人権の体系', subject: '憲法', updatedAt: '2日前' },
          { id: '202', title: '行政行為の概念', subject: '行政法', updatedAt: '3日前' }
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const recentActivity = [
    { type: 'create', title: '「憲法の基本原理」を作成しました', time: '2時間前', user: '管理者' },
    { type: 'edit', title: '「行政法の基本原理」を更新しました', time: '5時間前', user: '管理者' },
    { type: 'view', title: '新規ユーザーが登録しました', time: '1日前', user: 'user@example.com' },
    { type: 'create', title: 'PDF ファイルをアップロードしました', time: '2日前', user: '管理者' }
  ];

  if (loading) {
    return (
      <AdminLayout title="ダッシュボード">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="ダッシュボード">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="総コンテンツ数"
          value={stats.totalUnits}
          change="+5 今週"
          changeType="up"
          icon={BookOpen}
          color="bg-blue-600"
        />
        <StatsCard
          title="登録ユーザー数"
          value={stats.totalUsers}
          change="+12 今月"
          changeType="up"
          icon={Users}
          color="bg-green-600"
        />
        <StatsCard
          title="アップロードファイル"
          value={stats.totalFiles}
          change="+3 今週"
          changeType="up"
          icon={FileText}
          color="bg-purple-600"
        />
        <StatsCard
          title="総学習時間"
          value={`${stats.studyHours}h`}
          change="+15% 先月比"
          changeType="up"
          icon={Clock}
          color="bg-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">クイックアクション</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction
            icon={Plus}
            title="新規コンテンツ"
            href="/admin/content/create"
            color="bg-blue-600"
          />
          <QuickAction
            icon={FileText}
            title="ファイル管理"
            href="/admin/upload"
            color="bg-green-600"
          />
          <QuickAction
            icon={Users}
            title="ユーザー管理"
            href="/admin/users"
            color="bg-purple-600"
          />
          <QuickAction
            icon={TrendingUp}
            title="統計を見る"
            href="/admin/analytics"
            color="bg-orange-600"
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">最近のコンテンツ</h2>
            <Link href="/admin/content" className="text-sm text-blue-600 hover:text-blue-700">
              すべて見る →
            </Link>
          </div>
          <div className="space-y-3">
            {recentContent.map((content) => (
              <Link
                key={content.id}
                href={`/admin/content/${content.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{content.title}</p>
                  <p className="text-xs text-gray-500">{content.subject}</p>
                </div>
                <span className="text-xs text-gray-400">{content.updatedAt}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">最近のアクティビティ</h2>
          <div>
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">システム状態</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">サーバー状態</p>
              <p className="text-xs text-green-600">正常稼働中</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">データベース</p>
              <p className="text-xs text-green-600">接続中</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">ストレージ使用量</p>
              <p className="text-xs text-yellow-600">2.4GB / 10GB (24%)</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
