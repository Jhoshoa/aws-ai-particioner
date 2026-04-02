import { Clock, Timer, Zap, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SessionStats } from '../../types';

export interface SessionStatsBoxProps {
  stats: SessionStats;
  className?: string;
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function SessionStatsBox({ stats, className }: SessionStatsBoxProps) {
  const items = [
    {
      icon: Clock,
      label: 'Total Time',
      value: formatMinutes(stats.totalMinutes),
      color: 'text-accent-cyan',
    },
    {
      icon: Timer,
      label: 'Sessions',
      value: stats.totalSessions.toString(),
      color: 'text-accent-purple',
    },
    {
      icon: Zap,
      label: 'Pomodoros',
      value: stats.totalPomodoros.toString(),
      color: 'text-accent-orange',
    },
    {
      icon: TrendingUp,
      label: 'This Week',
      value: formatMinutes(stats.minutesThisWeek),
      color: 'text-accent-green',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-cyber-card border border-cyber-border rounded-lg p-4 text-center"
        >
          <item.icon className={cn('w-5 h-5 mx-auto mb-2', item.color)} />
          <div className={cn('font-display text-xl', item.color)}>
            {item.value}
          </div>
          <div className="text-xs text-cyber-muted font-mono uppercase tracking-wider mt-1">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
