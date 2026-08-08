import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, PieChart, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.fullName);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login('demo@monarchtrack.com', 'password123');
    } catch (err) {
      setError('Demo login failed. Make sure to run the seed script.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col md:flex-row">
      {/* Left panel - Branding (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-brand-900 text-white p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-800/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white text-brand-600 flex items-center justify-center font-bold text-xl shadow-lg">
              A
            </div>
            <span className="font-bold text-2xl tracking-tight">Apex<span className="text-brand-400">Spend</span></span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-md"
          >
            <h1 className="text-5xl font-bold leading-tight">Master your money.</h1>
            <p className="text-brand-100 text-lg leading-relaxed">
              Track spending, optimize budgets, and watch your net worth grow with our premium financial dashboard.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-brand-500/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Cash Flow Insights</h4>
              <p className="text-brand-200 text-sm">Visualize your income and spending trends</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm ml-8">
            <div className="w-12 h-12 rounded-full bg-brand-500/30 flex items-center justify-center shrink-0">
              <PieChart className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Smart Budgets</h4>
              <p className="text-brand-200 text-sm">Set limits and track category progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-surface-50 dark:bg-surface-950 relative">
        <div className="w-full max-w-md mx-auto relative z-10">
          
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20">
              A
            </div>
            <span className="font-bold text-2xl text-surface-900 dark:text-white tracking-tight">
              Apex<span className="text-brand-500">Spend</span>
            </span>
          </div>

          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="text-surface-500 dark:text-surface-400">
              {isRegister 
                ? 'Start managing your finances today.' 
                : 'Enter your details to access your dashboard.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-3"
            >
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input py-3"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input py-3"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input py-3"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base mt-2 shadow-brand-500/25"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isRegister ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>
          
          {!isRegister && (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="btn-secondary w-full py-3.5 text-base mt-4"
            >
              Log in with Demo Account
            </button>
          )}

          <div className="mt-8 text-center">
            <p className="text-surface-500 dark:text-surface-400 text-sm">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                disabled={isLoading}
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};