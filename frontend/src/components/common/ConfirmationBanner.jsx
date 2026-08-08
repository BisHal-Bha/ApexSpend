import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import clsx from 'clsx';

export const ConfirmationBanner = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDestructive = false, isLoading = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden mb-4"
        >
          <div className="bg-white dark:bg-surface-800 border-l-4 border-l-red-500 border border-surface-200 dark:border-surface-700 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3">
              <div className="shrink-0 mt-0.5">
                {isDestructive ? (
                  <Trash2 className="w-5 h-5 text-red-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h4>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{message}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 ml-8 sm:ml-0">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={clsx(
                  "px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all shadow-sm disabled:opacity-50 flex items-center gap-2",
                  isDestructive 
                    ? "bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500/30" 
                    : "bg-brand-500 hover:bg-brand-600 focus:ring-2 focus:ring-brand-500/30"
                )}
              >
                {isLoading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
