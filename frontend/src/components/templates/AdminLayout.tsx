import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Icon, Button } from '../atoms';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  label: string;
  href: string;
  icon: 'home' | 'book' | 'user' | 'settings';
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'home' },
  { label: 'Domains', href: '/admin/domains', icon: 'book' },
  { label: 'Resources', href: '/admin/resources', icon: 'book' },
  { label: 'Users', href: '/admin/users', icon: 'user' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
];

export interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-cyber-bg flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-cyber-card border-r border-cyber-border',
          'transform transition-transform duration-200 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-cyber-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-wider text-accent-cyan">
              AI STUDY
            </span>
            <span className="text-xs text-accent-pink font-mono">ADMIN</span>
          </Link>
          <button
            className="lg:hidden p-1 text-cyber-muted hover:text-cyber-text"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'text-sm font-mono transition-colors',
                  isActive
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-bg/50'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon name={item.icon} size="sm" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyber-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center">
              <Icon name="user" size="sm" className="text-accent-cyan" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-cyber-text truncate">
                {user?.displayName || 'Admin'}
              </p>
              <p className="text-xs text-cyber-muted truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <Icon name="logout" size="sm" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 flex items-center gap-4 px-4 lg:px-6 border-b border-cyber-border bg-cyber-card/50">
          <button
            className="lg:hidden p-2 text-cyber-muted hover:text-cyber-text"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon name="menu" size="md" />
          </button>
          <h1 className="text-lg font-sans font-semibold text-cyber-text">
            Admin Panel
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
