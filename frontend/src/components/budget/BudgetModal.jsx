import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';

export const BudgetModal = ({ isOpen, onClose, onSave, initialData, categories, isSaving }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    monthly_limit: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        ...initialData,
        category_id: initialData.category_id || '',
        monthly_limit: initialData.monthly_limit?.toString() || '',
      });
      setErrors({});
    } else if (isOpen) {
      setFormData({
        category_id: '',
        monthly_limit: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.monthly_limit || isNaN(formData.monthly_limit) || parseFloat(formData.monthly_limit) <= 0) {
      newErrors.monthly_limit = 'Valid positive limit is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const expenseCategories = categories?.filter(c => c.type === 'expense') || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Budget' : 'Set Budget'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="input-label">Category</label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className={`select ${errors.category_id ? 'border-red-500' : ''}`}
            disabled={isSaving || !!initialData}
          >
            <option value="" disabled>Select category</option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
        </div>

        <div>
          <label className="input-label">Monthly Limit ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.monthly_limit}
            onChange={(e) => setFormData({ ...formData, monthly_limit: e.target.value })}
            className={`input font-medium ${errors.monthly_limit ? 'border-red-500' : ''}`}
            placeholder="0.00"
            disabled={isSaving}
          />
          {errors.monthly_limit && <p className="text-red-500 text-xs mt-1">{errors.monthly_limit}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-5 mt-2 border-t border-surface-100 dark:border-surface-800">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={isSaving}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};
