import { useMemo } from 'react';
import { cn } from '../../lib/utils';

export interface StreakCalendarProps {
  studyDates: string[];
  weeks?: number;
  className?: string;
}

interface DayData {
  date: string;
  active: boolean;
  day: number;
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function StreakCalendar({
  studyDates,
  weeks = 12,
  className,
}: StreakCalendarProps) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const data: DayData[][] = [];
    const studyDateSet = new Set(studyDates);

    // Generate weeks
    for (let w = weeks - 1; w >= 0; w--) {
      const weekData: DayData[] = [];

      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const dateStr = date.toISOString().split('T')[0];

        weekData.push({
          date: dateStr,
          active: studyDateSet.has(dateStr),
          day: date.getDay(),
        });
      }

      data.push(weekData);
    }

    return data;
  }, [studyDates, weeks]);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={cn('', className)}>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((label, index) => (
            <div
              key={index}
              className="w-3 h-3 flex items-center justify-center text-[8px] text-cyber-muted font-mono"
            >
              {index % 2 === 1 ? label : ''}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${formatDate(day.date)}: ${day.active ? 'Studied' : 'No activity'}`}
                    className={cn(
                      'w-3 h-3 rounded-sm cursor-default transition-colors',
                      day.active
                        ? 'bg-accent-green hover:bg-accent-green/80'
                        : 'bg-cyber-border/50 hover:bg-cyber-border'
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end gap-2 mt-3 text-[10px] text-cyber-muted font-mono">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-cyber-border/50" />
          <div className="w-3 h-3 rounded-sm bg-accent-green/30" />
          <div className="w-3 h-3 rounded-sm bg-accent-green/60" />
          <div className="w-3 h-3 rounded-sm bg-accent-green" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
