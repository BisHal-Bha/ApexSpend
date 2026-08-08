import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const CategoryDonutChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 h-full flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2 self-start w-full">
          Spending by Category
        </h3>
        <p className="text-surface-400 text-sm">No spending data for this period.</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.total_amount / total) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-surface-900 p-3 rounded-xl border border-surface-200 dark:border-surface-800 shadow-lg z-50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="font-semibold text-sm text-surface-900 dark:text-white">{data.category_name}</p>
          </div>
          <p className="text-surface-600 dark:text-surface-300 text-sm">
            Rs.{parseFloat(data.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-surface-400">({percent}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6 h-full flex flex-col">
      <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">
        Spending by Category
      </h3>
      
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              dataKey="total_amount" 
              nameKey="category_name" 
              innerRadius={70} 
              outerRadius={95} 
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#64748b'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-surface-500 font-medium">Total</span>
          <span className="text-xl font-bold text-surface-900 dark:text-white">
            Rs.{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
        {data.slice(0, 8).map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate pr-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-surface-600 dark:text-surface-300 truncate">{item.category_name}</span>
            </div>
            <span className="font-medium text-surface-900 dark:text-surface-100">
              {Math.round((item.total_amount / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};