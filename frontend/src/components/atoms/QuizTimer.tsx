import { useEffect, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';

export interface QuizTimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
  className?: string;
}

export function QuizTimer({
  initialSeconds,
  onTimeUp,
  isPaused = false,
  className,
}: QuizTimerProps) {
  const [remaining, setRemaining] = useState(initialSeconds);

  const handleTimeUp = useCallback(() => {
    onTimeUp?.();
  }, [onTimeUp]);

  useEffect(() => {
    setRemaining(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused || remaining <= 0) {
      if (remaining <= 0) {
        handleTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, isPaused, handleTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining < 30;
  const isCritical = remaining < 10;

  return (
    <div
      className={cn(
        'font-display text-2xl font-bold tracking-wider',
        isCritical && 'text-accent-pink animate-pulse',
        isLow && !isCritical && 'text-accent-orange',
        !isLow && 'text-accent-cyan',
        className
      )}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
