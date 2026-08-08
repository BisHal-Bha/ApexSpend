import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export const SpendingTrendChart = ({ data }) => {
  const { theme } = useTheme();
  
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 h-full flex flex-col items-center justify-center min-h-[350px]">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2 self-start w-full">
          Cash Flow Trend (12 Months)
        </h3>
        <p className="text-surface-400 text-sm">No trend data available.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-surface-900 p-3 rounded-xl border border-surface-200 dark:border-surface-800 shadow-lg z-50 min-w-[150px]">
          <p className="font-semibold text-sm text-surface-900 dark:text-white mb-2 pb-2 border-b border-surface-100 dark:border-surface-800">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center text-sm py-0.5">
              <span className="text-surface-500 dark:text-surface-400 capitalize flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </span>
              <span className="font-medium text-surface-900 dark:text-white">
                Rs.{parseFloat(entry.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white">
          Cash Flow Trend
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
            <span className="text-xs text-surface-500 font-medium">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-xs text-surface-500 font-medium">Spending</span>
          </div>
        </div>
      </div>
      
      <div className="h-72 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="month_label" 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke={textColor} 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `Rs.${value/1000}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: textColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Income"
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
            />
            <Area 
              type="monotone" 
              dataKey="spending" 
              name="Spending"
              stroke="#ef4444" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSpending)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};