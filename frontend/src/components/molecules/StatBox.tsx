import { cn } from '../../lib/utils';

export interface StatBoxProps {
  icon: string;
  label: string;
  className?: string;
}

export function StatBox({ icon, label, className }: StatBoxProps) {
  return (
    <div
      className={cn(
        'bg-cyber-card border border-cyber-border rounded-lg',
        'px-3 py-2.5 text-center',
        className
      )}
    >
      <div className="text-lg mb-0.5">{icon}</div>
      <div className="text-[11px] text-cyber-muted whitespace-nowrap">{label}</div>
    </div>
  );
}
