import React from 'react';
import { LayoutDashboard, Receipt, PieChart, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border-r border-surface-200/80 dark:border-surface-800/80 flex flex-col justify-between p-4 fixed left-0 top-0 transition-colors duration-300 z-40 shadow-sidebar">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-brand-500/20">
            M
          </div>
          <span className="font-bold text-lg text-surface-900 dark:text-white tracking-tight">
            Apex<span className="text-brand-500">Spend</span>
          </span>
        </div>

        {/* User Profile Mini */}
        {user && (
          <div className="mb-6 px-3 py-3 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-sm shrink-0">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-surface-100'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-500' : 'text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="space-y-2 pt-4 border-t border-surface-200/80 dark:border-surface-800/80 mt-auto">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          <span className="flex items-center gap-3">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-surface-500" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-surface-400 group-hover:text-red-500 transition-colors" />
          Log Out
        </button>
      </div>
    </aside>
  );
};