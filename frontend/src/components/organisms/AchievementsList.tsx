import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { AchievementCard } from '../molecules/AchievementCard';
import { Text, Spinner, Button } from '../atoms';
import type { AchievementWithStatus, AchievementCategory } from '../../types';

export interface AchievementsListProps {
  achievements: AchievementWithStatus[];
  isLoading?: boolean;
  showFilters?: boolean;
  variant?: 'grid' | 'list';
  className?: string;
}

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  getting_started: 'Getting Started',
  domain_mastery: 'Domain Mastery',
  streaks: 'Streaks',
  quiz_performance: 'Quiz Performance',
  study_time: 'Study Time',
  mock_exams: 'Mock Exams',
  completion: 'Completion',
};

type FilterOption = 'all' | 'unlocked' | 'locked' | AchievementCategory;

export function AchievementsList({
  achievements,
  isLoading = false,
  showFilters = true,
  variant = 'grid',
  className,
}: AchievementsListProps) {
  const [filter, setFilter] = useState<FilterOption>('all');

  const categories = useMemo(() => {
    const cats = new Set(achievements.map((a) => a.category));
    return Array.from(cats).sort();
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      if (filter === 'all') return true;
      if (filter === 'unlocked') return achievement.unlocked;
      if (filter === 'locked') return !achievement.unlocked;
      return achievement.category === filter;
    });
  }, [achievements, filter]);

  const stats = useMemo(() => {
    const unlocked = achievements.filter((a) => a.unlocked).length;
    return {
      total: achievements.length,
      unlocked,
      locked: achievements.length - unlocked,
    };
  }, [achievements]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <Text variant="body" className="text-cyber-muted">
          No achievements available yet.
        </Text>
      </div>
    );
  }

  return (
    <div className={className}>
      {showFilters && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              label="All"
              count={stats.total}
            />
            <FilterButton
              active={filter === 'unlocked'}
              onClick={() => setFilter('unlocked')}
              label="Unlocked"
              count={stats.unlocked}
              variant="success"
            />
            <FilterButton
              active={filter === 'locked'}
              onClick={() => setFilter('locked')}
              label="Locked"
              count={stats.locked}
            />
            <div className="w-px bg-cyber-border mx-2" />
            {categories.map((category) => (
              <FilterButton
                key={category}
                active={filter === category}
                onClick={() => setFilter(category)}
                label={CATEGORY_LABELS[category]}
              />
            ))}
          </div>
        </div>
      )}

      {filteredAchievements.length === 0 ? (
        <div className="text-center py-8">
          <Text variant="body" className="text-cyber-muted">
            No achievements match the selected filter.
          </Text>
        </div>
      ) : (
        <div
          className={cn(
            variant === 'grid' && 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
            variant === 'list' && 'space-y-3'
          )}
        >
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              variant={variant === 'list' ? 'compact' : 'detailed'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  variant?: 'default' | 'success';
}

function FilterButton({
  active,
  onClick,
  label,
  count,
  variant = 'default',
}: FilterButtonProps) {
  return (
    <Button
      variant={active ? 'primary' : 'ghost'}
      size="sm"
      onClick={onClick}
      className={cn(
        'text-xs',
        active && variant === 'success' && 'bg-accent-green text-cyber-bg'
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-mono',
            active ? 'bg-cyber-bg/20' : 'bg-cyber-border'
          )}
        >
          {count}
        </span>
      )}
    </Button>
  );
}
