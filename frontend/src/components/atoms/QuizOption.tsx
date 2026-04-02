import { cn } from '../../lib/utils';

export interface QuizOptionProps {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  selected: boolean;
  correct?: boolean;
  showResult?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function QuizOption({
  id,
  text,
  selected,
  correct,
  showResult,
  disabled,
  onClick,
}: QuizOptionProps) {
  const isCorrectAnswer = showResult && correct;
  const isWrongSelection = showResult && selected && !correct;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full p-4 text-left rounded-lg border-2 transition-all',
        'flex items-start gap-3',
        // Default state
        !showResult && !selected && 'border-cyber-border hover:border-accent-cyan/60 hover:bg-cyber-card/50',
        // Selected state (before submit)
        !showResult && selected && 'border-accent-cyan bg-accent-cyan/10',
        // Correct answer revealed
        isCorrectAnswer && 'border-accent-green bg-accent-green/10',
        // Wrong selection revealed
        isWrongSelection && 'border-accent-pink bg-accent-pink/10',
        // Disabled state
        disabled && 'cursor-not-allowed opacity-70'
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          'font-display text-sm font-bold border-2',
          // Default state
          !showResult && !selected && 'border-cyber-muted text-cyber-muted',
          // Selected state (before submit)
          !showResult && selected && 'border-accent-cyan text-accent-cyan bg-accent-cyan/20',
          // Correct answer revealed
          isCorrectAnswer && 'border-accent-green text-accent-green bg-accent-green/20',
          // Wrong selection revealed
          isWrongSelection && 'border-accent-pink text-accent-pink bg-accent-pink/20'
        )}
      >
        {id}
      </span>
      <span className="text-cyber-text flex-1 pt-1">{text}</span>
    </button>
  );
}
