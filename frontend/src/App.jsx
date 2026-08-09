import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/common/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { AnimatePresence, motion } from 'framer-motion';
import logo from './assets/logo.jpg';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when changing tabs
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex text-surface-900 dark:text-surface-100 selection:bg-brand-500/30">
      
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="ApexSpend Logo" className="w-8 h-8 object-contain rounded-md" />
          <span className="font-bold text-surface-900 dark:text-white tracking-tight">Apex<span className="text-brand-500">Spend</span></span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        fixed inset-0 z-40 lg:static lg:block transition-all duration-300
        ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 lg:visible lg:opacity-100'}
      `}>
        {/* Mobile Backdrop */}
        <div 
          className="lg:hidden absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Sidebar content container - slides in on mobile */}
        <div className={`
          absolute lg:static h-full transition-transform duration-300 w-64
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 sm:p-8 pt-20 lg:pt-8 w-full max-w-[100vw] lg:max-w-[calc(100vw-16rem)] overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'dashboard' && <DashboardPage setActiveTab={setActiveTab} />}
            {activeTab === 'transactions' && <TransactionsPage />}
            {activeTab === 'budgets' && <BudgetsPage />}
            {activeTab === 'settings' && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}