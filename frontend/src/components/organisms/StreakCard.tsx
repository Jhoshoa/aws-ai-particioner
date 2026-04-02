import { Flame } from 'lucide-react';
import { Card } from '../molecules/Card';
import { Text, Spinner, Button } from '../atoms';
import { StreakDisplay } from '../molecules/StreakDisplay';
import { StreakCalendar } from './StreakCalendar';
import { useGetStreakQuery, useRecordActivityMutation } from '../../store/api';

export interface StreakCardProps {
  className?: string;
}

export function StreakCard({ className }: StreakCardProps) {
  const { data: streak, isLoading } = useGetStreakQuery();
  const [recordActivity, { isLoading: recording }] = useRecordActivityMutation();

  const handleRecordActivity = async () => {
    await recordActivity();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center min-h-[200px]">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (!streak) {
    return null;
  }

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-orange/20 rounded-lg">
            <Flame className="w-6 h-6 text-accent-orange" />
          </div>
          <div>
            <Text variant="h3">Study Streak</Text>
            <Text variant="small" muted className="text-sm">
              {streak.isActiveToday
                ? "Keep it up! You've studied today"
                : "Study today to maintain your streak!"}
            </Text>
          </div>
        </div>

        {!streak.isActiveToday && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleRecordActivity}
            disabled={recording}
          >
            {recording ? 'Recording...' : 'Record Activity'}
          </Button>
        )}
      </div>

      <StreakDisplay
        currentStreak={streak.currentStreak}
        longestStreak={streak.longestStreak}
        isActiveToday={streak.isActiveToday}
        size="lg"
        className="mb-6 justify-center"
      />

      <div>
        <Text variant="label" className="mb-3">
          Activity Calendar
        </Text>
        <StreakCalendar
          studyDates={streak.studyDates}
          weeks={12}
        />
      </div>
    </Card>
  );
}
