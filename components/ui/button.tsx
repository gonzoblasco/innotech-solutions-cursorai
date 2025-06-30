import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
  secondary: 'bg-success text-white hover:bg-success/90 focus:ring-success',
  outline: 'border border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-primary',
  ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary',
  destructive: 'bg-error text-white hover:bg-error/90 focus:ring-error',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none dark:focus:ring-offset-gray-900',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        aria-disabled={disabled || loading}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" aria-hidden="true" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button'; 