import * as React from 'react';
import { cn } from '../../lib/utils';

export type CardVariant = 'default' | 'elevated' | 'bordered';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-gray-900',
  elevated: 'bg-white dark:bg-gray-900 shadow-lg',
  bordered: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl transition-shadow hover:shadow-xl dark:hover:shadow-primary/30',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4 border-b border-gray-100 dark:border-gray-800', className)} {...props} />
);
CardHeader.displayName = 'CardHeader';

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-4 border-t border-gray-100 dark:border-gray-800', className)} {...props} />
);
CardFooter.displayName = 'CardFooter'; 