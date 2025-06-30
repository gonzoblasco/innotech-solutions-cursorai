import React from 'react';
import { cn } from '../../lib/utils';

export default function StatsCard({
  icon: Icon,
  title,
  value,
  color = 'primary',
  loading = false,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  color?: 'primary' | 'success' | 'warning' | 'info';
  loading?: boolean;
}) {
  const colorMap = {
    primary: 'text-primary',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  };
  return (
    <div className={cn('flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 shadow transition-all animate-fade-in', loading && 'opacity-60 animate-pulse')}> 
      <div className={cn('rounded-full p-2 bg-primary/10 dark:bg-primary/20', colorMap[color])}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{title}</div>
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{loading ? <span className="inline-block w-12 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /> : value}</div>
      </div>
    </div>
  );
} 