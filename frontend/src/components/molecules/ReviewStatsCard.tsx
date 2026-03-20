import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import type { ReviewStats } from '../../types';

export interface ReviewStatsCardProps extends HTMLAttributes<HTMLDivElement> {
  stats: ReviewStats;
}

export function ReviewStatsCard({ stats, className, ...props }: ReviewStatsCardProps) {
  const { totalCards, dueToday, overdue, masteredCount, averageEaseFactor } = stats;

  return (
    <div
      className={cn('grid grid-cols-2 md:grid-cols-5 gap-4', className)}
      {...props}
    >
      {/* Due Today */}
      <div className="p-4 rounded-lg bg-cyber-card border border-cyber-border text-center">
        <div className="text-3xl font-display font-bold text-accent-cyan">
          {dueToday}
        </div>
        <div className="text-xs text-cyber-muted mt-1">Due Today</div>
      </div>

      {/* Overdue */}
      <div
        className={cn(
          'p-4 rounded-lg border text-center',
          overdue > 0
            ? 'bg-accent-pink/10 border-accent-pink/30'
            : 'bg-cyber-card border-cyber-border'
        )}
      >
        <div
          className={cn(
            'text-3xl font-display font-bold',
            overdue > 0 ? 'text-accent-pink' : 'text-cyber-text'
          )}
        >
          {overdue}
        </div>
        <div className="text-xs text-cyber-muted mt-1">Overdue</div>
      </div>

      {/* Mastered */}
      <div className="p-4 rounded-lg bg-cyber-card border border-cyber-border text-center">
        <div className="text-3xl font-display font-bold text-accent-green">
          {masteredCount}
        </div>
        <div className="text-xs text-cyber-muted mt-1">Mastered</div>
      </div>

      {/* Total Cards */}
      <div className="p-4 rounded-lg bg-cyber-card border border-cyber-border text-center">
        <div className="text-3xl font-display font-bold text-cyber-text">
          {totalCards}
        </div>
        <div className="text-xs text-cyber-muted mt-1">Total Cards</div>
      </div>

      {/* Average Ease */}
      <div className="p-4 rounded-lg bg-cyber-card border border-cyber-border text-center col-span-2 md:col-span-1">
        <div className="text-3xl font-display font-bold text-accent-purple">
          {averageEaseFactor.toFixed(1)}
        </div>
        <div className="text-xs text-cyber-muted mt-1">Avg. Ease</div>
      </div>
    </div>
  );
}

export default ReviewStatsCard;
