import React from 'react';
import clsx from 'clsx';

export const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={clsx("flex justify-center items-center", className)}>
      <div className={clsx(
        "animate-spin rounded-full border-2 border-surface-200 border-t-brand-500 dark:border-surface-700 dark:border-t-brand-500",
        sizes[size] || sizes.md
      )} />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="card p-5 space-y-4">
    <div className="flex justify-between items-center">
      <div className="w-24 h-4 rounded-md shimmer" />
      <div className="w-10 h-10 rounded-xl shimmer" />
    </div>
    <div className="w-32 h-8 rounded-lg shimmer" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-surface-100 dark:border-surface-800">
    <td className="py-4 px-6"><div className="w-32 h-4 rounded-md shimmer mb-2" /><div className="w-24 h-3 rounded-md shimmer" /></td>
    <td className="py-4 px-6"><div className="w-24 h-6 rounded-lg shimmer" /></td>
    <td className="py-4 px-6"><div className="w-20 h-4 rounded-md shimmer" /></td>
    <td className="py-4 px-6 text-right"><div className="w-20 h-5 rounded-md shimmer ml-auto" /></td>
    <td className="py-4 px-6"><div className="w-16 h-8 rounded-xl shimmer mx-auto" /></td>
  </tr>
);
