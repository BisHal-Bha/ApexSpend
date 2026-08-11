import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useFetch } from '../../hooks/useFetch';
import { getCategoryId } from '../../utils/category';
import { format } from 'date-fns';

export const TransactionModal = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
  const { data: categories } = useFetch('/categories');
  
  const [formData, setFormData] = useState({
    merchant_name: '',
    amount: '',
    type: 'expense',
    category_id: '',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        amount: Math.abs(initialData.amount).toString()
      });
      setErrors({});
    } else if (isOpen) {
      setFormData({
        merchant_name: '',
        amount: '',
        type: 'expense',
        category_id: '',
        note: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.merchant_name.trim()) newErrors.merchant_name = 'Merchant is required';
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid positive amount is required';
    }
    if (!formData.date) newErrors.date = 'Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  // Filter categories by selected type
  const filteredCategories = categories?.filter(c => c.type === formData.type) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="input-label">Merchant Name</label>
          <input
            type="text"
            value={formData.merchant_name}
            onChange={(e) => setFormData({ ...formData, merchant_name: e.target.value })}
            className={`input ${errors.merchant_name ? 'border-red-500 focus:ring-red-500/30' : ''}`}
            placeholder="e.g. Starbucks, Target"
            disabled={isSaving}
          />
          {errors.merchant_name && <p className="text-red-500 text-xs mt-1">{errors.merchant_name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Amount (Rs.)</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`input font-medium ${errors.amount ? 'border-red-500 focus:ring-red-500/30' : ''}`}
              placeholder="0.00"
              disabled={isSaving}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="input-label">Type</label>
            <div className="flex bg-surface-100 dark:bg-surface-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
                className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors ${
                  formData.type === 'expense' 
                    ? 'bg-white dark:bg-surface-700 shadow-sm text-surface-900 dark:text-white' 
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
                disabled={isSaving}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
                className={`flex-1 text-sm font-medium py-1.5 rounded-lg transition-colors ${
                  formData.type === 'income' 
                    ? 'bg-white dark:bg-surface-700 shadow-sm text-surface-900 dark:text-white' 
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
                disabled={isSaving}
              >
                Income
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Category</label>
            <select
              value={formData.category_id || ''}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="select"
              disabled={isSaving}
            >
              <option value="" disabled>Select category</option>
              {filteredCategories.map((cat) => (
                <option key={getCategoryId(cat)} value={getCategoryId(cat)}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`input ${errors.date ? 'border-red-500 focus:ring-red-500/30' : ''}`}
              disabled={isSaving}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>
        </div>

        <div>
          <label className="input-label">Note (Optional)</label>
          <input
            type="text"
            value={formData.note || ''}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="input"
            placeholder="Details or notes..."
            disabled={isSaving}
          />
        </div>

        <div className="flex justify-end gap-3 pt-5 mt-2 border-t border-surface-100 dark:border-surface-800">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {initialData ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};