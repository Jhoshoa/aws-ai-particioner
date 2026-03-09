import { Clock, Zap, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../molecules/Card';
import { Text, Spinner, Badge } from '../atoms';
import { useGetSessionHistoryQuery, useGetDomainsQuery } from '../../store/api';
import { cn } from '../../lib/utils';
import type { StudySession } from '../../types';

export interface SessionHistoryProps {
  limit?: number;
  className?: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface SessionItemProps {
  session: StudySession;
  domainName: string;
  domainColor: string;
}

function SessionItem({ session, domainName, domainColor }: SessionItemProps) {
  const isCompleted = session.status === 'completed';

  return (
    <div className="flex items-center justify-between py-3 border-b border-cyber-border last:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'p-2 rounded-lg',
            isCompleted ? 'bg-accent-green/20' : 'bg-accent-pink/20'
          )}
        >
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-accent-green" />
          ) : (
            <XCircle className="w-4 h-4 text-accent-pink" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium"
              style={{ color: domainColor }}
            >
              {domainName}
            </span>
            <Badge
              variant={isCompleted ? 'green' : 'pink'}
              size="sm"
            >
              {session.status}
            </Badge>
          </div>
          <div className="text-xs text-cyber-muted">
            {formatDate(session.startedAt)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-cyber-muted">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(session.durationMinutes)}</span>
        </div>
        {session.pomodorosCompleted > 0 && (
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-accent-orange" />
            <span>{session.pomodorosCompleted}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SessionHistory({ limit = 10, className }: SessionHistoryProps) {
  const { data: sessions, isLoading } = useGetSessionHistoryQuery(limit);
  const { data: domains } = useGetDomainsQuery();

  const getDomainInfo = (domainId: number) => {
    const domain = domains?.find((d) => d.domainNumber === domainId);
    return {
      name: domain?.name || `Domain ${domainId}`,
      color: domain?.color || '#00D4FF',
    };
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center min-h-[200px]">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card className={className}>
        <Text variant="h3" className="mb-4">
          Session History
        </Text>
        <div className="text-center py-8 text-cyber-muted">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No sessions yet</p>
          <p className="text-sm mt-1">
            Start a study session to track your progress
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Text variant="h3" className="mb-4">
        Session History
      </Text>
      <div className="divide-y divide-cyber-border">
        {sessions.map((session) => {
          const { name, color } = getDomainInfo(session.domainId);
          return (
            <SessionItem
              key={session.id}
              session={session}
              domainName={name}
              domainColor={color}
            />
          );
        })}
      </div>
    </Card>
  );
}
