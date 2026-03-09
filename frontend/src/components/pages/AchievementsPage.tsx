import { Helmet } from 'react-helmet-async';
import { Trophy } from 'lucide-react';
import { MainLayout } from '../templates';
import { Text, Spinner, AchievementBadge } from '../atoms';
import { Card, Alert } from '../molecules';
import { AchievementsList } from '../organisms';
import {
  useGetAchievementsQuery,
  useGetAchievementSummaryQuery,
} from '../../store/api';

export function AchievementsPage() {
  const {
    data: achievements,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useGetAchievementsQuery();
  const { data: summary, isLoading: summaryLoading } = useGetAchievementSummaryQuery();

  const isLoading = achievementsLoading || summaryLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (achievementsError) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Alert variant="error">
            Failed to load achievements. Please try again later.
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>Achievements | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-10 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-gold to-accent-orange flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <Trophy className="w-10 h-10 text-cyber-bg" />
          </div>
          <div className="flex-1">
            <Text variant="h1">Achievements</Text>
            <Text variant="body" className="text-cyber-muted">
              Earn badges and points as you progress through your study journey
            </Text>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <SummaryCard
              label="Unlocked"
              value={`${summary.unlockedCount}/${summary.totalAchievements}`}
              highlight
            />
            <SummaryCard
              label="Total Points"
              value={summary.totalPoints.toLocaleString()}
              suffix="pts"
            />
            <SummaryCard
              label="Completion"
              value={Math.round((summary.unlockedCount / summary.totalAchievements) * 100)}
              suffix="%"
            />
            <SummaryCard
              label="Remaining"
              value={summary.totalAchievements - summary.unlockedCount}
            />
          </div>
        )}

        {/* Recent Unlocks */}
        {summary?.recentUnlocks && summary.recentUnlocks.length > 0 && (
          <div className="mb-8">
            <Text variant="h2" className="mb-4">
              Recent Unlocks
            </Text>
            <Card className="overflow-x-auto">
              <div className="flex gap-6 py-2 px-1 min-w-max">
                {summary.recentUnlocks.map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center">
                    <AchievementBadge
                      name={achievement.name}
                      icon={achievement.icon}
                      unlocked={achievement.unlocked}
                      points={achievement.points}
                      size="lg"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* All Achievements */}
        <div>
          <Text variant="h2" className="mb-4">
            All Achievements
          </Text>
          <AchievementsList
            achievements={achievements || []}
            isLoading={achievementsLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  highlight?: boolean;
}

function SummaryCard({ label, value, suffix, highlight }: SummaryCardProps) {
  return (
    <Card className="text-center">
      <Text variant="small" className="text-cyber-muted mb-1">
        {label}
      </Text>
      <div className="flex items-baseline justify-center gap-1">
        <span
          className={`text-2xl font-bold font-mono ${
            highlight ? 'text-accent-gold' : 'text-cyber-text'
          }`}
        >
          {value}
        </span>
        {suffix && <span className="text-sm text-cyber-muted">{suffix}</span>}
      </div>
    </Card>
  );
}
