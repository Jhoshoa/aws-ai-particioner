import { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface TabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function TabButton({
  active = false,
  className,
  children,
  ...props
}: TabButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2.5',
        'text-xs font-mono tracking-wider uppercase',
        'rounded-t-md',
        'transition-all duration-200',
        'focus:outline-none',
        active
          ? 'bg-accent-cyan text-cyber-bg font-medium'
          : 'bg-transparent text-cyber-muted hover:text-cyber-text',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
