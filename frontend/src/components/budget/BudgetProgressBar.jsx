import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export const BudgetProgressBar = ({ budget, onEdit, onDelete }) => {
  const { category_name, category_color, total_spent, monthly_limit } = budget;
  
  const spent = parseFloat(total_spent) || 0;
  const limit = parseFloat(monthly_limit) || 0;
  const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
  
  const remaining = limit - spent;
  const isOverBudget = spent > limit;
  const isNearLimit = percentage >= 85 && !isOverBudget;

  let progressColor = 'bg-brand-500';
  if (isOverBudget) progressColor = 'bg-red-500';
  else if (isNearLimit) progressColor = 'bg-amber-500';

  return (
    <div className="card p-5 group flex flex-col h-full relative overflow-hidden">
      {/* Background glow if over budget */}
      {isOverBudget && (
        <div className="absolute inset-0 bg-red-50 dark:bg-red-900/10 opacity-50 pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
            style={{ backgroundColor: `${category_color || '#64748b'}20`, color: category_color || '#64748b' }}
          >
            <span className="font-bold text-sm">
              {category_name ? category_name.charAt(0) : '?'}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-surface-900 dark:text-white leading-tight">{category_name}</h4>
            <p className={clsx("text-xs font-medium mt-0.5", isOverBudget ? "text-red-500" : "text-surface-500")}>
              {isOverBudget ? 'Over budget' : `${percentage}% used`}
            </p>
          </div>
        </div>
        
        {/* Actions (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(budget)} className="btn-icon w-7 h-7 bg-white dark:bg-surface-800 shadow-sm">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(budget)} className="btn-icon w-7 h-7 bg-white dark:bg-surface-800 shadow-sm hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-auto relative z-10">
        {/* Amounts */}
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-surface-900 dark:text-white">
            Rs.{spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span className="text-sm font-medium text-surface-400">
            / Rs.{limit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-surface-100 dark:bg-surface-800 h-2.5 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${progressColor}`}
          />
        </div>

        {/* Remaining */}
        <div className="flex justify-between items-center text-xs">
          <span className={clsx("font-medium", isOverBudget ? "text-red-500" : "text-surface-500")}>
            {isOverBudget 
              ? `Rs.${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })} over` 
              : `Rs.${Math.max(remaining, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} left`}
          </span>
        </div>
      </div>
    </div>
  );
};