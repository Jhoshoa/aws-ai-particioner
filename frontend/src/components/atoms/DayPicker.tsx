import { cn } from '../../lib/utils';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface DayPickerProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  disabled?: boolean;
  className?: string;
}

export function DayPicker({
  selectedDays,
  onChange,
  disabled = false,
  className,
}: DayPickerProps) {
  const toggleDay = (day: number) => {
    if (disabled) return;
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day].sort());
    }
  };

  return (
    <div className={cn('flex gap-1', className)}>
      {DAYS.map((label, index) => (
        <button
          key={index}
          type="button"
          disabled={disabled}
          onClick={() => toggleDay(index)}
          className={cn(
            'w-8 h-8 rounded-full text-sm font-medium transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent-cyan/50',
            selectedDays.includes(index)
              ? 'bg-accent-cyan text-cyber-bg'
              : 'bg-cyber-card border border-cyber-border text-cyber-muted hover:border-accent-cyan/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
