import { Clock, CheckCircle, Flame, Trophy } from 'lucide-react';
import { ProgressStatBox } from './ProgressStatBox';
import type { UserStats } from '../../types';

export interface StatsGridProps {
  stats: UserStats;
  className?: string;
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  const accuracy =
    stats.questionsAnswered > 0
      ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
      : 0;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className || ''}`}>
      <ProgressStatBox
        icon={<Clock className="w-5 h-5" />}
        label="Study Time"
        value={formatTime(stats.totalStudyMinutes)}
        color="#00D4FF"
      />
      <ProgressStatBox
        icon={<CheckCircle className="w-5 h-5" />}
        label="Topics Done"
        value={String(stats.totalTopicsCompleted)}
        color="#00FF88"
      />
      <ProgressStatBox
        icon={<Flame className="w-5 h-5" />}
        label="Current Streak"
        value={`${stats.currentStreakDays} days`}
        color="#FF6B35"
      />
      <ProgressStatBox
        icon={<Trophy className="w-5 h-5" />}
        label="Quiz Accuracy"
        value={stats.questionsAnswered > 0 ? `${accuracy}%` : '-'}
        color="#FFD700"
      />
    </div>
  );
}
