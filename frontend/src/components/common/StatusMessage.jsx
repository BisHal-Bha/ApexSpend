import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export const StatusMessage = ({ message, type = 'info', onClose, autoDismiss = true, duration = 5000, className }) => {
  useEffect(() => {
    if (autoDismiss && message) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, duration, onClose]);

  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-brand-50 dark:bg-brand-900/20',
      border: 'border-brand-200 dark:border-brand-800/50',
      text: 'text-brand-800 dark:text-brand-300',
      icon: <CheckCircle2 className="w-5 h-5 text-brand-500" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800/50',
      text: 'text-red-800 dark:text-red-300',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800/50',
      text: 'text-blue-800 dark:text-blue-300',
      icon: <Info className="w-5 h-5 text-blue-500" />,
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className={clsx(
          "flex items-center justify-between p-4 rounded-xl border mb-4",
          currentStyle.bg, currentStyle.border, className
        )}>
          <div className="flex items-center gap-3">
            <div className="shrink-0">{currentStyle.icon}</div>
            <p className={clsx("text-sm font-medium", currentStyle.text)}>
              {message}
            </p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className={clsx(
                "p-1.5 rounded-lg transition-colors shrink-0 opacity-70 hover:opacity-100",
                currentStyle.text, 
                `hover:${currentStyle.bg}` // darken slightly on hover, or rely on opacity
              )}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
