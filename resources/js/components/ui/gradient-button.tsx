import { Button } from './button';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GradientButtonProps {
    children: React.ReactNode;
    className?: string;
    size?: 'default' | 'sm' | 'lg';
    type?: 'button' | 'submit' | 'reset';
  gradientFrom?: string;
  gradientTo?: string;
  gradientVia?: string;
  hoverFrom?: string;
  hoverTo?: string;
  hoverVia?: string;
  disabled?: boolean;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({
    className,
    size = 'default',
    type = 'button',
    gradientFrom = 'from-blue-600',
    gradientVia = 'via-purple-600',
    gradientTo = 'to-indigo-600',
    hoverFrom = 'from-blue-500',
    hoverVia = 'via-purple-500',
    hoverTo = 'to-indigo-500',
    disabled = false,
    children,
    ...props
  }, ref) => {
    return (
      <Button
        className={cn(
          'relative overflow-hidden group',
          'bg-gradient-to-r',
          gradientFrom,
          gradientVia,
          gradientTo,
          'text-white',
          'hover:shadow-lg hover:shadow-blue-500/20',
          'transition-all duration-300',
          'transform hover:-translate-y-0.5',
          'focus:ring-2 focus:ring-blue-500/50',
          'active:scale-95',
          className
        )}
        size={size}
        ref={ref}
        type={type}
        disabled={disabled}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center w-full h-full">
          {children}
        </span>
        <span 
          className={cn(
            'absolute inset-0 w-full h-full',
            'bg-gradient-to-r',
            hoverFrom,
            hoverVia,
            hoverTo,
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-300'
          )}
          aria-hidden="true"
        />
      </Button>
    );
  }
);

GradientButton.displayName = 'GradientButton';
