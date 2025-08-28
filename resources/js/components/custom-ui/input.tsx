import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    
    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground/90"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-lg',
              'bg-background/70 backdrop-blur-sm',
              'border border-border/50',
              'px-3 py-2 text-sm',
              'placeholder:text-muted-foreground/60',
              'focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-primary/50',
              'focus-visible:border-primary/70',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && [
                'border-destructive/50',
                'focus-visible:ring-destructive/30',
                'focus-visible:border-destructive/70'
              ],
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
