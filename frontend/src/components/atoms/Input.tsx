import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-4 py-2.5',
          'bg-cyber-card text-cyber-text',
          'border rounded-lg',
          'font-mono text-sm',
          'placeholder:text-cyber-muted/60',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan',
          error
            ? 'border-accent-pink focus:ring-accent-pink/50 focus:border-accent-pink'
            : 'border-cyber-border hover:border-cyber-border/80',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
