import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface ProgressStatBoxProps {
  icon: ReactNode;
  label: string;
  value: string;
  color?: string;
  className?: string;
}

export function ProgressStatBox({
  icon,
  label,
  value,
  color = '#00D4FF',
  className,
}: ProgressStatBoxProps) {
  return (
    <div
      className={cn(
        'bg-cyber-card border border-cyber-border rounded-lg',
        'p-4 flex flex-col items-center text-center',
        className
      )}
    >
      <div className="text-cyber-muted mb-2" style={{ color }}>
        {icon}
      </div>
      <div className="font-display text-xl text-cyber-text mb-1">{value}</div>
      <div className="text-xs text-cyber-muted font-mono uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
