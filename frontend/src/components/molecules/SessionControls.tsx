import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from '../atoms';
import { cn } from '../../lib/utils';

export interface SessionControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStop: () => void;
  disabled?: boolean;
  className?: string;
}

export function SessionControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onStop,
  disabled = false,
  className,
}: SessionControlsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      {!isRunning ? (
        <Button
          onClick={onStart}
          size="lg"
          disabled={disabled}
          className="min-w-[120px]"
        >
          <Play className="w-5 h-5 mr-2" /> Start
        </Button>
      ) : (
        <Button
          onClick={onPause}
          variant="secondary"
          size="lg"
          disabled={disabled}
          className="min-w-[120px]"
        >
          <Pause className="w-5 h-5 mr-2" /> Pause
        </Button>
      )}
      <Button
        onClick={onReset}
        variant="ghost"
        size="lg"
        disabled={disabled}
        title="Reset timer"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>
      <Button
        onClick={onStop}
        variant="ghost"
        size="lg"
        disabled={disabled}
        className="text-accent-pink hover:text-accent-pink/80"
        title="End session"
      >
        <Square className="w-5 h-5" />
      </Button>
    </div>
  );
}
