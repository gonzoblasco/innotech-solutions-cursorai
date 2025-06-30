import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 24, className, ...props }) => (
  <svg
    className={cn('animate-spin text-primary', className)}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-label="Cargando"
    {...props}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement> & { variant?: 'text' | 'avatar' | 'card'; width?: string; height?: string; }> = ({ variant = 'text', width, height, className, ...props }) => {
  let base = 'bg-gray-200 dark:bg-gray-700 rounded animate-pulse relative overflow-hidden';
  let style = '';
  if (variant === 'avatar') {
    base += ' rounded-full';
    style = `width: ${width || '3rem'}; height: ${height || '3rem'};`;
  } else if (variant === 'card') {
    base += ' rounded-xl';
    style = `width: ${width || '100%'}; height: ${height || '8rem'};`;
  } else {
    style = `width: ${width || '100%'}; height: ${height || '1.25rem'};`;
  }
  return (
    <div className={cn(base, className)} style={{ ...props.style, ...style ? { width: undefined, height: undefined } : {} }} {...props}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent dark:via-gray-600/40 animate-shimmer" />
    </div>
  );
}; 