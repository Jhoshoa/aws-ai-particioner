import { Flame, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { icon: 'w-5 h-5', count: 'text-lg', label: 'text-[10px]' },
  md: { icon: 'w-8 h-8', count: 'text-2xl', label: 'text-xs' },
  lg: { icon: 'w-12 h-12', count: 'text-4xl', label: 'text-sm' },
};

export function StreakDisplay({
  currentStreak,
  longestStreak,
  isActiveToday,
  size = 'md',
  className,
}: StreakDisplayProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn('flex items-center gap-6', className)}>
      {/* Current Streak */}
      <div className="flex items-center gap-2">
        <Flame
          className={cn(
            styles.icon,
            isActiveToday
              ? 'text-accent-orange fill-accent-orange/30 animate-pulse'
              : 'text-cyber-muted'
          )}
        />
        <div className="flex flex-col">
          <span
            className={cn(
              'font-display font-bold leading-none',
              styles.count,
              isActiveToday ? 'text-accent-orange' : 'text-cyber-muted'
            )}
          >
            {currentStreak}
          </span>
          <span className={cn('text-cyber-muted font-mono uppercase tracking-wider', styles.label)}>
            day{currentStreak !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Longest Streak */}
      <div className="flex items-center gap-2">
        <Trophy
          className={cn(
            styles.icon,
            longestStreak > 0 ? 'text-accent-gold' : 'text-cyber-muted'
          )}
        />
        <div className="flex flex-col">
          <span
            className={cn(
              'font-display font-bold leading-none',
              styles.count,
              longestStreak > 0 ? 'text-accent-gold' : 'text-cyber-muted'
            )}
          >
            {longestStreak}
          </span>
          <span className={cn('text-cyber-muted font-mono uppercase tracking-wider', styles.label)}>
            best
          </span>
        </div>
      </div>
    </div>
  );
}
