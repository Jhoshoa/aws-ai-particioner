import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface TimerDisplayProps extends HTMLAttributes<HTMLDivElement> {
  seconds: number;
  isBreak?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-7xl',
};

/**
 * Format seconds to MM:SS display
 */
function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function TimerDisplay({
  seconds,
  isBreak = false,
  size = 'lg',
  className,
  ...props
}: TimerDisplayProps) {
  return (
    <div
      className={cn(
        'font-display font-bold tracking-wider tabular-nums',
        sizeStyles[size],
        isBreak ? 'text-accent-green' : 'text-accent-cyan',
        className
      )}
      {...props}
    >
      {formatTime(seconds)}
    </div>
  );
}
