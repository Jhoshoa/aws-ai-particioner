import { cn } from '../../lib/utils';

export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { outer: 60, stroke: 4, fontSize: 'text-xs' },
  md: { outer: 100, stroke: 6, fontSize: 'text-lg' },
  lg: { outer: 150, stroke: 8, fontSize: 'text-2xl' },
};

export function ProgressRing({
  value,
  max = 100,
  size = 'md',
  color = '#00D4FF',
  showLabel = true,
  className,
}: ProgressRingProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const { outer, stroke, fontSize } = sizeConfig[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={outer} height={outer} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-cyber-border"
        />
        {/* Progress circle */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      {showLabel && (
        <span
          className={cn('absolute font-display', fontSize)}
          style={{ color }}
        >
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
