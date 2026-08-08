import React from 'react';
import { Trash2, Edit3, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { TableRowSkeleton } from '../common/LoadingSpinner';

export const TransactionTable = ({ transactions, loading, onEdit, onDeleteRequest, filters, setFilters }) => {
  
  const handleSort = (column) => {
    if (filters.sortBy === column) {
      setFilters(prev => ({ ...prev, order: prev.order === 'DESC' ? 'ASC' : 'DESC', page: 1 }));
    } else {
      setFilters(prev => ({ ...prev, sortBy: column, order: 'DESC', page: 1 }));
    }
  };

  const SortIcon = ({ column }) => {
    if (filters.sortBy !== column) return <ArrowUpDown className="w-3.5 h-3.5 text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return filters.order === 'DESC' ? <ArrowDown className="w-3.5 h-3.5 text-brand-500" /> : <ArrowUp className="w-3.5 h-3.5 text-brand-500" />;
  };

  if (!loading && (!transactions || transactions.length === 0)) {
    return (
      <EmptyState 
        title="No transactions found" 
        description={filters.search ? "Try adjusting your filters or search term." : "You haven't recorded any transactions yet."}
      />
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/40 text-xs font-semibold text-surface-500 dark:text-surface-400 border-b border-surface-200 dark:border-surface-800">
              <th className="py-4 px-6 cursor-pointer group hover:bg-surface-100 dark:hover:bg-surface-800/80 transition-colors rounded-tl-2xl" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-2">Date <SortIcon column="date" /></div>
              </th>
              <th className="py-4 px-6 cursor-pointer group hover:bg-surface-100 dark:hover:bg-surface-800/80 transition-colors" onClick={() => handleSort('merchant_name')}>
                <div className="flex items-center gap-2">Merchant <SortIcon column="merchant_name" /></div>
              </th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right cursor-pointer group hover:bg-surface-100 dark:hover:bg-surface-800/80 transition-colors" onClick={() => handleSort('amount')}>
                <div className="flex items-center justify-end gap-2">Amount <SortIcon column="amount" /></div>
              </th>
              <th className="py-4 px-6 text-center rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800 text-sm">
            {loading ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-50/80 dark:hover:bg-surface-800/30 transition-colors group">
                  <td className="py-4 px-6 text-surface-500 dark:text-surface-400 text-xs font-medium whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-surface-900 dark:text-surface-100">{tx.merchant_name}</div>
                    {tx.note && <div className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 line-clamp-1">{tx.note}</div>}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
                      style={{
                        backgroundColor: `${tx.category_color || '#64748b'}15`,
                        color: tx.category_color || '#64748b',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tx.category_color || '#64748b' }}></span>
                      {tx.category_name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className={`py-4 px-6 text-right font-bold whitespace-nowrap ${tx.type === 'expense' ? 'text-surface-900 dark:text-white' : 'text-brand-500'}`}>
                    {tx.type === 'expense' ? '-' : '+'}Rs.{parseFloat(tx.amount).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(tx)} 
                        className="btn-icon w-8 h-8"
                        aria-label="Edit transaction"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteRequest(tx)} 
                        className="btn-icon w-8 h-8 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};