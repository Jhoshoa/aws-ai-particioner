import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  info: 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan',
  success: 'bg-accent-green/10 border-accent-green/30 text-accent-green',
  warning: 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold',
  error: 'bg-accent-pink/10 border-accent-pink/30 text-accent-pink',
};

export function Alert({
  variant = 'info',
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border',
        'text-sm font-mono',
        variantStyles[variant],
        className
      )}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
}
