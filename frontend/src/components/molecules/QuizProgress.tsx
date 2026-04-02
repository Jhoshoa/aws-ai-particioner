import { ProgressBar, Text } from '../atoms';
import { cn } from '../../lib/utils';

export interface QuizProgressProps {
  current: number;
  total: number;
  correctCount: number;
  className?: string;
}

export function QuizProgress({
  current,
  total,
  correctCount,
  className,
}: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100);
  const answeredCount = current;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <Text variant="small" className="text-cyber-muted">
          Question {current} of {total}
        </Text>
        <div className="flex items-center gap-4">
          {answeredCount > 0 && (
            <Text variant="small" className="text-accent-green">
              {correctCount} / {answeredCount} correct
            </Text>
          )}
          <Text variant="small" className="text-cyber-muted">
            {percentage}%
          </Text>
        </div>
      </div>
      <ProgressBar value={percentage} max={100} />
    </div>
  );
}
