import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const SummaryCard = ({ title, amount, icon: Icon, color, bgColor, trend, className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={clsx(
        "bg-white dark:bg-surface-900 p-5 rounded-2xl border border-surface-200/80 dark:border-surface-800 shadow-sm relative overflow-hidden group transition-all duration-300",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`p-3 rounded-2xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="relative z-10 space-y-1">
        <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">
          {title}
        </p>
        <h4 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">
          {amount}
        </h4>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={clsx(
              "text-xs font-medium px-2 py-0.5 rounded-lg flex items-center gap-1",
              trend.isPositive ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400" 
                               : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-surface-400 dark:text-surface-500">
              vs last month
            </span>
          </div>
        )}
      </div>

      {/* Decorative subtle background element */}
      <div className={clsx(
        "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40",
        color.replace('text-', 'bg-')
      )} />
    </motion.div>
  );
};