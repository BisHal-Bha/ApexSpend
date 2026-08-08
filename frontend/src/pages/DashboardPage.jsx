import React, { useState } from 'react';

const currentYear = new Date().getFullYear();
import { DollarSign, Wallet, ArrowDownRight, TrendingUp } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { SummaryCard } from '../components/common/SummaryCard';
import { SpendingTrendChart } from '../components/dashboard/SpendingTrendChart';
import { CategoryDonutChart } from '../components/dashboard/CategoryDonutChart';
import { CashFlowSummary } from '../components/dashboard/CashFlowSummary';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { LoadingSpinner, CardSkeleton } from '../components/common/LoadingSpinner';

export const DashboardPage = ({ setActiveTab }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data, loading, error } = useFetch(
    `/analytics/dashboard?month=${selectedMonth}&year=${selectedYear}`
  );

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex justify-center mt-20">
        <div className="card p-8 text-center max-w-md w-full border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowDownRight className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-2">Failed to load dashboard</h3>
          <p className="text-red-600 dark:text-red-300/80 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const { summary, categoryBreakdown, monthlyTrend, recentTransactions } = data || {};

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Your financial summary for the selected period.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-surface-900 p-1.5 rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
          <select 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className="select border-transparent bg-transparent focus:ring-0 text-sm font-medium pr-8 py-1.5"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <div className="w-px h-5 bg-surface-200 dark:bg-surface-700"></div>
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="select border-transparent bg-transparent focus:ring-0 text-sm font-medium pr-8 py-1.5"
          >
            {[currentYear - 2, currentYear - 1, currentYear].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><CardSkeleton /></div>
            <div><CardSkeleton /></div>
          </div>
        </div>
      ) : (
        <div className="stagger-children space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard 
              title="Total Spending" 
              amount={`Rs.${summary?.totalSpending?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
              icon={ArrowDownRight} 
              color="text-red-500" 
              bgColor="bg-red-50 dark:bg-red-900/20" 
              trend={{ isPositive: parseFloat(summary?.spendingChange) < 0, value: Math.abs(summary?.spendingChange || 0) }}
            />
            <SummaryCard 
              title="Total Income" 
              amount={`Rs.${summary?.totalIncome?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
              icon={TrendingUp} 
              color="text-brand-500" 
              bgColor="bg-brand-50 dark:bg-brand-900/20" 
              trend={{ isPositive: parseFloat(summary?.incomeChange) >= 0, value: Math.abs(summary?.incomeChange || 0) }}
            />
            <SummaryCard 
              title="Monthly Budget" 
              amount={`Rs.${summary?.totalBudget?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
              icon={Wallet} 
              color="text-blue-500" 
              bgColor="bg-blue-50 dark:bg-blue-900/20" 
            />
            <SummaryCard 
              title="Remaining Budget" 
              amount={`Rs.${summary?.remainingBudget?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`} 
              icon={DollarSign} 
              color={summary?.remainingBudget >= 0 ? "text-brand-500" : "text-red-500"} 
              bgColor={summary?.remainingBudget >= 0 ? "bg-brand-50 dark:bg-brand-900/20" : "bg-red-50 dark:bg-red-900/20"} 
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
            <div className="lg:col-span-2 h-[400px] lg:h-auto">
              <SpendingTrendChart data={monthlyTrend} />
            </div>
            <div className="h-[400px] lg:h-auto">
              <CategoryDonutChart data={categoryBreakdown} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[350px]">
            <div className="lg:col-span-1 h-[350px] lg:h-auto">
              <CashFlowSummary 
                income={summary?.totalIncome || 0} 
                spending={summary?.totalSpending || 0} 
              />
            </div>
            <div className="lg:col-span-2 h-[350px] lg:h-auto">
              <RecentTransactions 
                transactions={recentTransactions} 
                onViewAll={() => setActiveTab('transactions')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
