import { HTMLAttributes } from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StreakCounterProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    icon: 'w-4 h-4',
    text: 'text-sm',
  },
  md: {
    icon: 'w-5 h-5',
    text: 'text-base',
  },
  lg: {
    icon: 'w-6 h-6',
    text: 'text-lg',
  },
};

export function StreakCounter({
  count,
  isActive = false,
  size = 'md',
  className,
  ...props
}: StreakCounterProps) {
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1',
        className
      )}
      {...props}
    >
      <Flame
        className={cn(
          styles.icon,
          isActive
            ? 'text-accent-orange fill-accent-orange/30'
            : 'text-cyber-muted'
        )}
      />
      <span
        className={cn(
          'font-mono font-semibold',
          styles.text,
          isActive ? 'text-accent-orange' : 'text-cyber-muted'
        )}
      >
        {count}
      </span>
    </div>
  );
}
