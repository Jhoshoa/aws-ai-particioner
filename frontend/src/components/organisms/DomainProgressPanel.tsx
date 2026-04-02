import { X } from 'lucide-react';
import { Card } from '../molecules/Card';
import { Text, Spinner, ProgressBar, TopicCheckbox, Button } from '../atoms';
import {
  useGetDomainProgressDetailQuery,
  useUpdateTopicProgressMutation,
} from '../../store/api';

export interface DomainProgressPanelProps {
  domainId: number;
  onClose: () => void;
}

export function DomainProgressPanel({ domainId, onClose }: DomainProgressPanelProps) {
  const { data: progress, isLoading } = useGetDomainProgressDetailQuery(domainId);
  const [updateTopic, { isLoading: updating }] = useUpdateTopicProgressMutation();

  const handleToggle = async (topicIndex: number, completed: boolean) => {
    await updateTopic({ domainId, topicIndex, completed });
  };

  if (isLoading) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" />
      </Card>
    );
  }

  if (!progress) {
    return null;
  }

  return (
    <Card accentColor={progress.color}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Text variant="label" style={{ color: progress.color }}>
            DOMAIN {progress.domainId}
          </Text>
          <Text variant="h3">{progress.domainName}</Text>
        </div>
        <Button variant="ghost" onClick={onClose} className="p-2">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-cyber-muted">Progress</span>
          <span style={{ color: progress.color }}>
            {progress.completedCount}/{progress.totalCount} topics
          </span>
        </div>
        <ProgressBar
          value={progress.percentComplete}
          max={100}
          barColor={progress.color}
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {progress.topics.map((topic) => (
          <TopicCheckbox
            key={topic.index}
            checked={topic.completed}
            label={topic.name}
            onChange={(checked) => handleToggle(topic.index, checked)}
            disabled={updating}
            color={progress.color}
          />
        ))}
      </div>
    </Card>
  );
}
