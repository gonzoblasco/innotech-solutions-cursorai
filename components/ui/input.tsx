import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputVariant = 'text' | 'email' | 'password' | 'search';
export type InputState = 'default' | 'error' | 'success' | 'disabled';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  state?: InputState;
  label?: string;
  errorMessage?: string;
  helpText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const stateClasses: Record<InputState, string> = {
  default: 'border-gray-300 focus:border-primary focus:ring-primary',
  error: 'border-error focus:border-error focus:ring-error',
  success: 'border-success focus:border-success focus:ring-success',
  disabled: 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'text',
      state = 'default',
      label,
      errorMessage,
      helpText,
      leadingIcon,
      trailingIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
          </label>
        )}
        <div className={cn('relative flex items-center', disabled && 'opacity-60 pointer-events-none')}> 
          {leadingIcon && <span className="absolute left-3 text-gray-400">{leadingIcon}</span>}
          <input
            id={inputId}
            ref={ref}
            type={variant}
            className={cn(
              'block w-full rounded-md border bg-white dark:bg-gray-900 py-2 px-3 pr-10 text-base shadow-sm focus:outline-none focus:ring-2 transition',
              stateClasses[state],
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              className
            )}
            aria-invalid={state === 'error'}
            aria-describedby={errorMessage ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
            disabled={disabled || state === 'disabled'}
            {...props}
          />
          {trailingIcon && <span className="absolute right-3 text-gray-400">{trailingIcon}</span>}
        </div>
        {errorMessage && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-error">
            {errorMessage}
          </p>
        )}
        {helpText && !errorMessage && (
          <p id={`${inputId}-help`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input'; 