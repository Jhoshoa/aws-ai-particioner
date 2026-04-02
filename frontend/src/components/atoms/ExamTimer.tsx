import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ExamTimerProps extends HTMLAttributes<HTMLDivElement> {
  remainingSeconds: number;
  totalSeconds: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

/**
 * Format seconds to HH:MM:SS or MM:SS display
 */
function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Get color based on time remaining percentage
 */
function getTimeColor(remaining: number, total: number): string {
  const percentage = (remaining / total) * 100;

  if (percentage <= 10) return 'text-red-500';
  if (percentage <= 25) return 'text-accent-orange';
  if (percentage <= 50) return 'text-accent-gold';
  return 'text-accent-cyan';
}

export function ExamTimer({
  remainingSeconds,
  totalSeconds,
  size = 'md',
  className,
  ...props
}: ExamTimerProps) {
  const colorClass = getTimeColor(remainingSeconds, totalSeconds);
  const isLowTime = remainingSeconds <= totalSeconds * 0.1;

  return (
    <div
      className={cn(
        'flex items-center gap-2 font-display font-bold tracking-wider tabular-nums',
        sizeStyles[size],
        colorClass,
        isLowTime && 'animate-pulse',
        className
      )}
      {...props}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{formatTime(remainingSeconds)}</span>
    </div>
  );
}
