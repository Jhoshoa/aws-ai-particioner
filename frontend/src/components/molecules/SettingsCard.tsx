import { ReactNode } from 'react';
import { Text } from '../atoms';
import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';

export interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SettingsCard({
  title,
  description,
  icon,
  children,
  className,
}: SettingsCardProps) {
  return (
    <Card className={cn('p-0', className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {icon && (
            <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <Text variant="h4">{title}</Text>
            {description && (
              <Text variant="small" className="text-cyber-muted mt-1">
                {description}
              </Text>
            )}
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
