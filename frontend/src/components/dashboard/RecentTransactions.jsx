import React from 'react';
import { CategoryIcon } from '../common/CategoryIcon';

export const RecentTransactions = ({ transactions, onViewAll }) => {
  return (
    <div className="card overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-surface-100 dark:border-surface-800 flex justify-between items-center bg-white dark:bg-surface-900 z-10">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white">
          Recent Transactions
        </h3>
        <button 
          onClick={onViewAll}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          View All
        </button>
      </div>
      
      <div className="flex-1 overflow-auto bg-surface-50/50 dark:bg-surface-900/50">
        {transactions?.length > 0 ? (
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-default">
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${tx.category_color || '#64748b'}20`, color: tx.category_color || '#64748b' }}
                  >
                    <CategoryIcon iconName={tx.category_icon} fallback={tx.category_name ? tx.category_name.charAt(0) : '?'} className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">
                      {tx.merchant_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-700"></span>
                      <span className="text-xs text-surface-500 dark:text-surface-400 truncate">
                        {tx.category_name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 text-right pl-2">
                  <span className={`font-bold text-sm ${tx.type === 'expense' ? 'text-surface-900 dark:text-white' : 'text-brand-500'}`}>
                    {tx.type === 'expense' ? '-' : '+'}Rs.{parseFloat(tx.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-surface-500 text-sm h-full flex items-center justify-center">
            No recent transactions found.
          </div>
        )}
      </div>
    </div>
  );
};
