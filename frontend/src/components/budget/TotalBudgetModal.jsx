import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export const TotalBudgetModal = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(initialData?.amount || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ amount: parseFloat(amount) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-surface-900 rounded-2xl w-full max-w-md shadow-xl border border-surface-200 dark:border-surface-800 animate-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">
            Set Monthly Budget
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Monthly Budget Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-medium">
                Rs.
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input pl-10 w-full"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !amount}
              className="btn-primary flex-1 flex justify-center items-center gap-2"
            >
              {isSaving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Budget
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
