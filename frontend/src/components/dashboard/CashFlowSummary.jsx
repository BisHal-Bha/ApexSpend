import React from 'react';
import { motion } from 'framer-motion';

export const CashFlowSummary = ({ income, spending }) => {
  const netFlow = income - spending;
  const isPositive = netFlow >= 0;
  
  // Calculate bar widths (max 100%)
  const maxAmount = Math.max(income, spending, 1);
  const incomeWidth = `${(income / maxAmount) * 100}%`;
  const spendingWidth = `${(spending / maxAmount) * 100}%`;

  return (
    <div className="card p-6 h-full flex flex-col">
      <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-6">
        Cash Flow
      </h3>
      
      <div className="space-y-6 flex-1">
        {/* Income Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Income</span>
            <span className="text-sm font-bold text-surface-900 dark:text-white">Rs.{income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="w-full bg-surface-100 dark:bg-surface-800 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: incomeWidth }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-brand-500 rounded-full"
            />
          </div>
        </div>

        {/* Spending Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Spending</span>
            <span className="text-sm font-bold text-surface-900 dark:text-white">Rs.{spending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="w-full bg-surface-100 dark:bg-surface-800 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: spendingWidth }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-red-500 rounded-full"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-5 border-t border-surface-100 dark:border-surface-800">
        <div className="flex justify-between items-center">
          <span className="text-sm text-surface-500 dark:text-surface-400">Net Cash Flow</span>
          <span className={`text-lg font-bold ${isPositive ? 'text-brand-600 dark:text-brand-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '+' : '-'}Rs.{Math.abs(netFlow).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};