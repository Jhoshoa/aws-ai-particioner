import { cn } from '../../lib/utils';
import { AchievementBadge } from '../atoms';
import type { AchievementWithStatus } from '../../types';

export interface AchievementCardProps {
  achievement: AchievementWithStatus;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export function AchievementCard({
  achievement,
  variant = 'detailed',
  className,
}: AchievementCardProps) {
  const { name, description, icon, unlocked, points, progress, target, unlockedAt } =
    achievement;

  const progressPercent = target && progress ? Math.min((progress / target) * 100, 100) : 0;

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg',
          'bg-cyber-card border border-cyber-border',
          'transition-all duration-200',
          unlocked && 'border-accent-gold/30',
          className
        )}
      >
        <AchievementBadge
          name={name}
          icon={icon}
          unlocked={unlocked}
          points={points}
          size="sm"
          showName={false}
          showPoints={false}
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-semibold truncate',
              unlocked ? 'text-cyber-text' : 'text-cyber-muted'
            )}
          >
            {name}
          </p>
          <p className="text-xs text-accent-gold font-mono">{points} pts</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-xl',
        'bg-cyber-card border border-cyber-border',
        'transition-all duration-200',
        unlocked && 'border-accent-gold/30 shadow-lg shadow-accent-gold/5',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <AchievementBadge
          name={name}
          icon={icon}
          unlocked={unlocked}
          points={points}
          size="md"
          showName={false}
          showPoints={false}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'font-semibold',
                unlocked ? 'text-cyber-text' : 'text-cyber-muted'
              )}
            >
              {name}
            </h4>
            <span className="text-sm text-accent-gold font-mono whitespace-nowrap">
              {points} pts
            </span>
          </div>
          <p
            className={cn(
              'text-sm mt-1',
              unlocked ? 'text-cyber-muted' : 'text-cyber-muted/70'
            )}
          >
            {description}
          </p>

          {/* Progress bar for locked achievements */}
          {!unlocked && target && progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-cyber-muted">Progress</span>
                <span className="text-cyber-muted font-mono">
                  {progress}/{target}
                </span>
              </div>
              <div className="h-1.5 bg-cyber-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Unlocked date */}
          {unlocked && unlockedAt && (
            <p className="text-xs text-accent-green mt-2">
              Unlocked {formatUnlockedDate(unlockedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function formatUnlockedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
