import { cn } from '../../lib/utils';
import { Card } from './Card';
import { ProgressRing } from '../atoms/ProgressRing';
import { Badge } from '../atoms/Badge';
import { Text } from '../atoms/Text';

export interface ProgressCardProps {
  domainId: number;
  domainName: string;
  color: string;
  completed: number;
  total: number;
  onClick?: () => void;
  className?: string;
}

export function ProgressCard({
  domainId,
  domainName,
  color,
  completed,
  total,
  onClick,
  className,
}: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card
      accentColor={color}
      className={cn(
        'cursor-pointer hover:scale-[1.02] transition-transform',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <ProgressRing value={percentage} color={color} size="sm" />
        <div className="flex-1 min-w-0">
          <Badge
            size="sm"
            className="mb-1"
            style={{
              backgroundColor: `${color}22`,
              color,
              borderColor: `${color}44`,
            }}
          >
            DOMAIN {domainId}
          </Badge>
          <Text variant="h4" className="truncate">
            {domainName}
          </Text>
          <Text variant="small" className="text-cyber-muted">
            {completed}/{total} topics completed
          </Text>
        </div>
      </div>
    </Card>
  );
}
