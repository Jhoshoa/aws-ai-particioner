import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'cyan' | 'orange' | 'gold' | 'green' | 'pink' | 'purple';
  size?: 'sm' | 'md';
}

const variantStyles = {
  default: 'bg-cyber-border/50 text-cyber-muted border-cyber-border',
  cyan: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/40',
  orange: 'bg-accent-orange/20 text-accent-orange border-accent-orange/40',
  gold: 'bg-accent-gold/20 text-accent-gold border-accent-gold/40',
  green: 'bg-accent-green/20 text-accent-green border-accent-green/40',
  pink: 'bg-accent-pink/20 text-accent-pink border-accent-pink/40',
  purple: 'bg-accent-purple/20 text-accent-purple border-accent-purple/40',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'font-mono font-medium tracking-wider uppercase',
        'border rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
