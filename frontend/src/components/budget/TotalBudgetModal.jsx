import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

export const TotalBudgetModal = ({ isOpen, onClose, onSave, initialAmount, isSaving, month, year }) => {
  const [amount, setAmount] = useState(initialAmount?.toString() || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount?.toString() || '');
      setError('');
    }
  }, [isOpen, initialAmount]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    onSave({ amount: parseFloat(amount), month, year });
  };

  const displayMonth = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-md border border-surface-200 dark:border-surface-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-surface-100 dark:border-surface-800">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            Set Total Budget for {displayMonth} {year}
          </h2>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <p className="text-sm text-surface-500">
            Set the overall maximum budget you want to spend this month. Once set, you can allocate this to individual categories.
          </p>

          <div>
            <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
              Total Budget Amount (Rs)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="input text-lg"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Total Budget'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
