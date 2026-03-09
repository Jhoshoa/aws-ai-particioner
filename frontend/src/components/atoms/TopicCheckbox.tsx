import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TopicCheckboxProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  color?: string;
  className?: string;
}

export function TopicCheckbox({
  checked,
  label,
  onChange,
  disabled = false,
  color = '#00D4FF',
  className,
}: TopicCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left',
        'border border-cyber-border hover:border-opacity-80',
        checked && 'bg-cyber-bg/50',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0',
          checked ? 'border-transparent' : 'border-cyber-muted'
        )}
        style={checked ? { backgroundColor: color } : undefined}
      >
        {checked && <Check className="w-3 h-3 text-cyber-dark" />}
      </div>
      <span
        className={cn(
          'flex-1 text-sm',
          checked ? 'text-cyber-muted line-through' : 'text-cyber-text'
        )}
      >
        {label}
      </span>
    </button>
  );
}
