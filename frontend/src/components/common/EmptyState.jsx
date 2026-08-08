import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-surface-50/50 dark:bg-surface-800/20 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700"
    >
      <div className="w-16 h-16 bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-100 dark:border-surface-700 flex items-center justify-center mb-5 text-surface-400">
        {Icon && <Icon className="w-8 h-8" strokeWidth={1.5} />}
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-surface-500 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </motion.div>
  );
};
