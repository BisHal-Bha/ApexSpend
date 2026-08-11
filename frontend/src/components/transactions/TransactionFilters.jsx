import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { getCategoryId } from '../../utils/category';

export const TransactionFilters = ({ filters, setFilters }) => {
  const { data: categories } = useFetch('/categories');

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Search */}
        <div className="w-full lg:w-1/3">
          <label className="input-label">Search</label>
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Merchant or note..."
              className="input pl-9"
            />
          </div>
        </div>

        {/* Category */}
        <div className="w-full lg:w-1/4">
          <label className="input-label">Category</label>
          <select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
            className="select"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={getCategoryId(cat)} value={getCategoryId(cat)}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="w-full lg:w-1/6">
          <label className="input-label">Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="select"
          >
            <option value="">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="w-full lg:w-1/6">
          <label className="input-label">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="select"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="merchant_name">Merchant</option>
          </select>
        </div>
        
        {/* Sort Order */}
        <div className="w-full lg:w-[10%]">
          <select
            value={filters.order}
            onChange={(e) => handleFilterChange('order', e.target.value)}
            className="select"
            aria-label="Sort order"
          >
            <option value="DESC">Desc</option>
            <option value="ASC">Asc</option>
          </select>
        </div>
      </div>
    </div>
  );
};