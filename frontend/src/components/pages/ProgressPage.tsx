import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../templates';
import { Text, Spinner, ProgressRing } from '../atoms';
import { Card, Alert, StatsGrid, ProgressCard } from '../molecules';
import { DomainProgressPanel } from '../organisms';
import {
  useGetEnhancedProgressSummaryQuery,
  useGetDomainsQuery,
} from '../../store/api';

export function ProgressPage() {
  const [selectedDomain, setSelectedDomain] = useState<number | null>(null);
  const { data: progress, isLoading, error } = useGetEnhancedProgressSummaryQuery();
  const { data: domains } = useGetDomainsQuery();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Alert variant="error">
            Failed to load progress data. Please try again later.
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>My Progress | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-10 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <ProgressRing
            value={progress?.percentComplete || 0}
            size="lg"
            color="#00D4FF"
          />
          <div>
            <Text variant="h1">Your Progress</Text>
            <Text variant="body" className="text-cyber-muted">
              {progress?.completedTopics || 0} of {progress?.totalTopics || 0} topics completed
            </Text>
          </div>
        </div>

        {/* Stats */}
        {progress?.stats && (
          <div className="mb-8">
            <StatsGrid stats={progress.stats} />
          </div>
        )}

        {/* Domain Progress */}
        <Text variant="h2" className="mb-4">
          Domain Progress
        </Text>

        {selectedDomain ? (
          <DomainProgressPanel
            domainId={selectedDomain}
            onClose={() => setSelectedDomain(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains?.map((domain) => {
              const domainProgressData = progress?.domainProgress[domain.domainNumber];
              return (
                <ProgressCard
                  key={domain.id}
                  domainId={domain.domainNumber}
                  domainName={domain.name}
                  color={domain.color}
                  completed={domainProgressData?.completed || 0}
                  total={domainProgressData?.total || domain.topics.length}
                  onClick={() => setSelectedDomain(domain.domainNumber)}
                />
              );
            })}
          </div>
        )}

        {/* Recent Activity */}
        {progress?.recentActivity && progress.recentActivity.length > 0 && (
          <div className="mt-8">
            <Text variant="h2" className="mb-4">
              Recent Activity
            </Text>
            <Card>
              <div className="divide-y divide-cyber-border/30">
                {progress.recentActivity.map((activity, index) => (
                  <div key={index} className="py-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan flex-shrink-0" />
                    <Text variant="body" className="flex-1">
                      {activity.description}
                    </Text>
                    <Text variant="small" className="text-cyber-muted flex-shrink-0">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
