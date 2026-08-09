import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { BudgetProgressBar } from '../components/budget/BudgetProgressBar';
import { BudgetModal } from '../components/budget/BudgetModal';
import { StatusMessage } from '../components/common/StatusMessage';
import { ConfirmationBanner } from '../components/common/ConfirmationBanner';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';

export const BudgetsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { data: categories } = useFetch('/categories');
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [status, setStatus] = useState(null);
  const [deleteRequest, setDeleteRequest] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const budgetsRes = await api.get(`/budgets?month=${selectedMonth}&year=${selectedYear}`);
      setBudgets(budgetsRes.data);
    } catch (err) {
      setStatus({ message: 'Failed to load budgets', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (editingBudget && editingBudget.id) {
        await api.put(`/budgets/${editingBudget.id}`, data);
        setStatus({ message: 'Budget updated successfully', type: 'success' });
      } else {
        await api.post('/budgets', { ...data, month: selectedMonth, year: selectedYear });
        setStatus({ message: 'Budget set successfully', type: 'success' });
      }
      setIsModalOpen(false);
      fetchBudgets();
    } catch (err) {
      setStatus({ 
        message: err.response?.data?.message || 'Failed to save budget', 
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
      await api.delete(`/budgets/${deleteRequest.id}`);
      setStatus({ message: 'Budget removed successfully', type: 'success' });
      setDeleteRequest(null);
      fetchBudgets();
    } catch (err) {
      setStatus({ message: 'Failed to remove budget', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const activeBudgets = budgets.filter(b => b.monthly_limit !== null);
  const totalBudget = activeBudgets.reduce((sum, b) => sum + (parseFloat(b.monthly_limit) || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (parseFloat(b.total_spent) || 0), 0);
  
  const currentYearObj = new Date().getFullYear();

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in-up">
      <div className="page-header flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">Track and manage spending limits by category.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-surface-900 p-1.5 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
            <select 
              value={selectedMonth} 
              onChange={e => setSelectedMonth(parseInt(e.target.value))}
              className="select border-transparent bg-transparent focus:ring-0 text-sm font-medium pr-8 py-1.5"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'short' })}
                </option>
              ))}
            </select>
            <div className="w-px h-5 bg-surface-200 dark:bg-surface-700"></div>
            <select 
              value={selectedYear} 
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="select border-transparent bg-transparent focus:ring-0 text-sm font-medium pr-8 py-1.5"
            >
              {[currentYearObj - 1, currentYearObj, currentYearObj + 1].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => {
              setEditingBudget(null);
              setIsModalOpen(true);
            }}
            className="btn-primary py-2 px-4"
          >
            <Plus className="w-4 h-4" /> Set Budget
          </button>
        </div>
      </div>

      <StatusMessage message={status?.message} type={status?.type} onClose={() => setStatus(null)} />
      
      <ConfirmationBanner
        isOpen={!!deleteRequest}
        title="Remove Budget"
        message={`Are you sure you want to remove the budget for ${deleteRequest?.category_name}? Your transactions will remain, but the limit will be cleared.`}
        isDestructive={true}
        confirmText="Remove"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteRequest(null)}
        isLoading={isSaving}
      />

      {/* Overall Summary */}
      <div className="card p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/10 dark:to-surface-900 border-brand-100 dark:border-brand-900/20">
        <div className="flex-1 w-full">
          <p className="text-sm font-semibold text-surface-500 mb-2">Total Budget vs Spent</p>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-3xl font-bold text-surface-900 dark:text-white">
              Rs.{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-lg font-medium text-surface-400 mb-1">
              / Rs.{totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-full bg-white dark:bg-surface-800 h-3 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${totalSpent > totalBudget ? 'bg-red-500' : 'bg-brand-500'}`}
              style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
        <div className="md:border-l md:border-surface-200 dark:md:border-surface-800 md:pl-8 flex gap-8">
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1">Remaining</p>
            <p className={`text-xl font-bold ${totalSpent > totalBudget ? 'text-red-500' : 'text-brand-500'}`}>
              Rs.{Math.max(totalBudget - totalSpent, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1">Categories</p>
            <p className="text-xl font-bold text-surface-900 dark:text-white">
              {activeBudgets.length}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : activeBudgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
          {activeBudgets.map((budget) => (
            <BudgetProgressBar
              key={budget.id || budget.category_id}
              budget={budget}
              onEdit={(b) => {
                setEditingBudget(b);
                setIsModalOpen(true);
              }}
              onDelete={setDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No Category Budgets Set"
          description={`You haven't set any category budgets for ${new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}.`}
          action={
            <button
              onClick={() => {
                setEditingBudget(null);
                setIsModalOpen(true);
              }}
              className="btn-primary mt-2"
            >
              Set Your First Category Budget
            </button>
          }
        />
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingBudget}
        categories={categories}
        isSaving={isSaving}
      />
    </div>
  );
};