import { Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AchievementBadgeProps {
  name: string;
  icon: string;
  unlocked: boolean;
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showPoints?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', icon: 'text-lg', lockSize: 'w-4 h-4' },
  md: { container: 'w-16 h-16', icon: 'text-2xl', lockSize: 'w-5 h-5' },
  lg: { container: 'w-24 h-24', icon: 'text-4xl', lockSize: 'w-6 h-6' },
};

function getIconEmoji(icon: string): string {
  const icons: Record<string, string> = {
    footprints: '👣',
    'clipboard-check': '📋',
    pencil: '✏️',
    brain: '🧠',
    sparkles: '✨',
    layers: '📚',
    'shield-check': '🛡️',
    lock: '🔐',
    flame: '🔥',
    trophy: '🏆',
    'check-circle': '✅',
    award: '🎖️',
    clock: '⏰',
    'file-text': '📝',
    target: '🎯',
    star: '⭐',
    percent: '📊',
    'check-circle-2': '🎉',
  };
  return icons[icon] || '🏅';
}

export function AchievementBadge({
  name,
  icon,
  unlocked,
  points,
  size = 'md',
  showName = true,
  showPoints = true,
  className,
}: AchievementBadgeProps) {
  const { container, icon: iconSize, lockSize } = sizeConfig[size];

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center transition-all',
          container,
          unlocked
            ? 'bg-gradient-to-br from-accent-gold to-accent-orange shadow-lg shadow-accent-gold/20'
            : 'bg-cyber-border/50'
        )}
      >
        {unlocked ? (
          <span className={iconSize}>{getIconEmoji(icon)}</span>
        ) : (
          <Lock className={cn('text-cyber-muted', lockSize)} />
        )}
      </div>
      {(showName || showPoints) && (
        <div className="text-center">
          {showName && (
            <p
              className={cn(
                'text-xs font-semibold leading-tight',
                unlocked ? 'text-cyber-text' : 'text-cyber-muted'
              )}
            >
              {name}
            </p>
          )}
          {showPoints && (
            <p className="text-xs text-accent-gold font-mono">{points} pts</p>
          )}
        </div>
      )}
    </div>
  );
}
