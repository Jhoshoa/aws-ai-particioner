import { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../molecules/Card';
import { Text, TimerDisplay } from '../atoms';
import { SessionControls } from '../molecules/SessionControls';
import { cn } from '../../lib/utils';

export interface PomodoroTimerProps {
  onComplete: (minutes: number, pomodoros: number) => void;
  onPause?: () => void;
  sessionDuration?: number; // minutes
  breakDuration?: number; // minutes
  className?: string;
}

export function PomodoroTimer({
  onComplete,
  onPause,
  sessionDuration = 25,
  breakDuration = 5,
  className,
}: PomodoroTimerProps) {
  const [seconds, setSeconds] = useState(sessionDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate progress percentage
  const maxSeconds = isBreak ? breakDuration * 60 : sessionDuration * 60;
  const progress = ((maxSeconds - seconds) / maxSeconds) * 100;

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s - 1);
        if (!isBreak) {
          setTotalMinutes((m) => m + 1 / 60);
        }
      }, 1000);
    } else if (seconds === 0) {
      // Timer complete
      if (!isBreak) {
        setPomodorosCompleted((p) => p + 1);
        setIsBreak(true);
        setSeconds(breakDuration * 60);
        // Notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Pomodoro Complete!', {
            body: 'Time for a break.',
            icon: '/icons/icon-192x192.png',
          });
        }
      } else {
        setIsBreak(false);
        setSeconds(sessionDuration * 60);
        // Notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Break Over!', {
            body: 'Ready to focus again?',
            icon: '/icons/icon-192x192.png',
          });
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds, isBreak, sessionDuration, breakDuration]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    onPause?.();
  }, [onPause]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSeconds(sessionDuration * 60);
    setIsBreak(false);
  }, [sessionDuration]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    onComplete(Math.round(totalMinutes), pomodorosCompleted);
  }, [onComplete, totalMinutes, pomodorosCompleted]);

  return (
    <Card className={cn('text-center', className)}>
      <Text
        variant="label"
        className={cn('mb-2', isBreak ? 'text-accent-green' : 'text-accent-cyan')}
      >
        {isBreak ? 'BREAK TIME' : 'FOCUS TIME'}
      </Text>

      {/* Progress ring visualization */}
      <div className="relative my-8 flex items-center justify-center">
        <svg className="w-64 h-64 -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-cyber-border"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            className={cn(
              'transition-all duration-1000',
              isBreak ? 'text-accent-green' : 'text-accent-cyan'
            )}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <TimerDisplay seconds={seconds} isBreak={isBreak} size="lg" />
        </div>
      </div>

      <SessionControls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onStop={handleStop}
        className="mb-6"
      />

      <div className="flex justify-center gap-8 text-sm text-cyber-muted">
        <div>
          <span className="text-accent-orange font-semibold text-lg">
            {pomodorosCompleted}
          </span>{' '}
          pomodoro{pomodorosCompleted !== 1 ? 's' : ''}
        </div>
        <div>
          <span className="text-accent-cyan font-semibold text-lg">
            {Math.round(totalMinutes)}
          </span>{' '}
          minute{Math.round(totalMinutes) !== 1 ? 's' : ''}
        </div>
      </div>
    </Card>
  );
}
