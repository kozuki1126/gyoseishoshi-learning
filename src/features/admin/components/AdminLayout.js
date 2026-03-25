import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  FileText,
  BarChart3,
  Bell
} from 'lucide-react';

const menuItems = [
  {
    title: 'ダッシュボード',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'コンテンツ管理',
    icon: BookOpen,
    submenu: [
      { title: 'コンテンツ一覧', href: '/admin/content' },
      { title: '新規作成', href: '/admin/content/create' },
      { title: '科目管理', href: '/admin/subjects' }
    ]
  },
  {
    title: 'ファイル管理',
    icon: Upload,
    submenu: [
      { title: 'アップロード', href: '/admin/upload' },
      { title: 'ファイル一覧', href: '/admin/files' }
    ]
  },
  {
    title: 'ユーザー管理',
    href: '/admin/users',
    icon: Users
  },
  {
    title: '統計・分析',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    title: '設定',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminLayout({ children, title = '管理画面' }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['コンテンツ管理']);

  const toggleSubmenu = (menuTitle) => {
    setExpandedMenus(prev =>
      prev.includes(menuTitle)
        ? prev.filter(t => t !== menuTitle)
        : [...prev, menuTitle]
    );
  };

  const isActiveRoute = (href) => {
    if (href === '/admin') {
      return router.pathname === '/admin';
    }
    return router.pathname.startsWith(href);
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedMenus.includes(item.title);
    const isActive = item.href ? isActiveRoute(item.href) : false;

    if (hasSubmenu) {
      return (
        <div className="mb-1">
          <button
            onClick={() => toggleSubmenu(item.title)}
            className={`w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors ${
              isExpanded ? 'bg-gray-700/50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.title}</span>}
            </div>
            {sidebarOpen && (
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            )}
          </button>
          {sidebarOpen && isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                    isActiveRoute(subItem.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {subItem.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <Icon className="w-5 h-5" />
        {sidebarOpen && <span>{item.title}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-gray-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-white font-bold">行政書士学習</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
          {menuItems.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>サイトを表示</span>}
          </Link>
          <button className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors w-full">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>ログアウト</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="hidden sm:block text-sm text-gray-700">管理者</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
