import React, { useState, useEffect } from 'react';
import { User, Palette, Tags, Trash2, Plus, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';
import { StatusMessage } from '../components/common/StatusMessage';
import { ConfirmationBanner } from '../components/common/ConfirmationBanner';
import { Modal } from '../components/common/Modal';
import { getCategoryId } from '../utils/category';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const { data: categories, refetch: refetchCategories } = useFetch('/categories');
  const [status, setStatus] = useState(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteRequest, setDeleteRequest] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    type: 'expense',
    color: '#64748b',
  });

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${getCategoryId(editingCategory)}`, categoryForm);
        setStatus({ message: 'Category updated', type: 'success' });
      } else {
        await api.post('/categories', categoryForm);
        setStatus({ message: 'Category created', type: 'success' });
      }
      setIsCategoryModalOpen(false);
      refetchCategories();
    } catch (err) {
      setStatus({ 
        message: err.response?.data?.message || 'Failed to save category', 
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
      await api.delete(`/categories/${getCategoryId(deleteRequest)}`);
      setStatus({ message: 'Category deleted', type: 'success' });
      setDeleteRequest(null);
      refetchCategories();
    } catch (err) {
      setStatus({ message: 'Failed to delete category', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        type: category.type,
        color: category.color || '#64748b'
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        type: 'expense',
        color: '#64748b'
      });
    }
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="max-w-[800px] mx-auto animate-fade-in-up space-y-8">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account, preferences, and categories.</p>
      </div>

      <StatusMessage message={status?.message} type={status?.type} onClose={() => setStatus(null)} />
      
      <ConfirmationBanner
        isOpen={!!deleteRequest}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteRequest?.name}"? Transactions using this category will be marked as uncategorized. Budgets for this category will be deleted.`}
        isDestructive={true}
        confirmText="Delete Category"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteRequest(null)}
        isLoading={isSaving}
      />

      {/* Profile Section */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30 flex items-center gap-3">
          <User className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="input-label">Full Name</label>
              <div className="input bg-surface-100 dark:bg-surface-800 text-surface-500">{user?.full_name}</div>
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <div className="input bg-surface-100 dark:bg-surface-800 text-surface-500">{user?.email}</div>
            </div>
          </div>
          <p className="text-xs text-surface-400 mt-4">
            Profile editing is disabled in the MVP version. Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'recently'}.
          </p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30 flex items-center gap-3">
          <Palette className="w-5 h-5 text-brand-500" />
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Appearance</h2>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-surface-900 dark:text-white">Theme Preference</h3>
            <p className="text-sm text-surface-500">Toggle between light and dark mode</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="btn-secondary px-5"
          >
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tags className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Categories</h2>
          </div>
          <button onClick={() => openCategoryModal()} className="btn-primary py-1.5 px-3 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>
        
        <div className="divide-y divide-surface-100 dark:divide-surface-800 max-h-96 overflow-y-auto custom-scrollbar">
          {categories?.map(category => (
            <div key={getCategoryId(category)} className="p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: `${category.color || '#64748b'}20`, color: category.color || '#64748b' }}
                >
                  <span className="font-bold text-xs">{category.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-surface-900 dark:text-white">{category.name}</h4>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${category.type === 'expense' ? 'text-surface-500' : 'text-brand-500'}`}>
                    {category.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openCategoryModal(category)} 
                  className="btn-icon w-8 h-8"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeleteRequest(category)} 
                  className="btn-icon w-8 h-8 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Modal */}
      <Modal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="input-label">Name</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="input"
              placeholder="e.g. Travel, Software"
              disabled={isSaving}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Type</label>
              <select
                value={categoryForm.type}
                onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                className="select"
                disabled={isSaving}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="input-label">Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  disabled={isSaving}
                />
                <span className="text-sm font-medium text-surface-500 uppercase">{categoryForm.color}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-5 mt-2 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn-ghost" disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
