import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  barColor?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'bg-accent-cyan',
  barColor,
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-cyber-muted font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-cyber-border rounded-full overflow-hidden',
          size === 'sm' ? 'h-1' : 'h-2'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', !barColor && color)}
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
