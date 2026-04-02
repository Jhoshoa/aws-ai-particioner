import { cn } from '../../lib/utils';

export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function TimeInput({
  value,
  onChange,
  label,
  disabled = false,
  className,
}: TimeInputProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm text-cyber-muted">{label}</label>
      )}
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'px-3 py-2 bg-cyber-card border border-cyber-border rounded-lg',
          'text-cyber-text font-mono text-sm',
          'focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          '[color-scheme:dark]'
        )}
      />
    </div>
  );
}
