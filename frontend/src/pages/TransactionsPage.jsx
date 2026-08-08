import React, { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { StatusMessage } from '../components/common/StatusMessage';
import { ConfirmationBanner } from '../components/common/ConfirmationBanner';
import { api } from '../services/api';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    type: '',
    sortBy: 'date',
    order: 'DESC',
    page: 1,
    limit: 15
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [status, setStatus] = useState(null); // { message, type }
  const [deleteRequest, setDeleteRequest] = useState(null); // transaction object

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const res = await api.get(`/transactions?${queryParams.toString()}`);
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch (err) {
      setStatus({ message: 'Failed to load transactions', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, data);
        setStatus({ message: 'Transaction updated successfully', type: 'success' });
      } else {
        await api.post('/transactions', data);
        setStatus({ message: 'Transaction created successfully', type: 'success' });
        // Go back to first page and sort by date desc if new transaction added
        if (!editingTransaction) {
          setFilters(prev => ({ ...prev, page: 1, sortBy: 'date', order: 'DESC' }));
        }
      }
      setIsModalOpen(false);
      fetchTransactions();
    } catch (err) {
      setStatus({ 
        message: err.response?.data?.message || 'Failed to save transaction', 
        type: 'error' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteRequest) return;
    setIsSaving(true);
    try {
      await api.delete(`/transactions/${deleteRequest.id}`);
      setStatus({ message: 'Transaction deleted successfully', type: 'success' });
      setDeleteRequest(null);
      fetchTransactions();
    } catch (err) {
      setStatus({ message: 'Failed to delete transaction', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in-up">
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Manage and categorize your cash flow items.</p>
        </div>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      <StatusMessage 
        message={status?.message} 
        type={status?.type} 
        onClose={() => setStatus(null)} 
      />
      
      <ConfirmationBanner
        isOpen={!!deleteRequest}
        title="Delete Transaction"
        message={`Are you sure you want to delete the transaction "${deleteRequest?.merchant_name}" for Rs.${deleteRequest?.amount}? This cannot be undone.`}
        isDestructive={true}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteRequest(null)}
        isLoading={isSaving}
      />

      <TransactionFilters filters={filters} setFilters={setFilters} />

      <TransactionTable
        transactions={transactions}
        loading={loading}
        onDeleteRequest={setDeleteRequest}
        onEdit={(tx) => {
          setEditingTransaction(tx);
          setIsModalOpen(true);
        }}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Showing <span className="font-semibold text-surface-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-semibold text-surface-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold text-surface-900 dark:text-white">{pagination.total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-secondary px-3"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 text-sm font-medium text-surface-700 dark:text-surface-300">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="btn-secondary px-3"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTransaction}
        isSaving={isSaving}
      />
    </div>
  );
};