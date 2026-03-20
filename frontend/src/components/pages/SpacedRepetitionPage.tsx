import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { MainLayout } from '../templates';
import { Text, Button, Spinner, Badge } from '../atoms';
import { Card, CardContent, CardHeader, ReviewStatsCard } from '../molecules';
import { ReviewCard } from '../organisms';
import {
  useGetReviewQueueQuery,
  useGetReviewStatsQuery,
  useSubmitReviewMutation,
} from '../../store/api';
import type { ReviewResult } from '../../types';
import { cn } from '../../lib/utils';

type PageState = 'dashboard' | 'reviewing' | 'completed';

export function SpacedRepetitionPage() {
  const [pageState, setPageState] = useState<PageState>('dashboard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
  });

  // Queries
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetReviewStatsQuery();
  const {
    data: queue,
    isLoading: queueLoading,
    refetch: refetchQueue,
  } = useGetReviewQueueQuery(20);
  const [submitReview] = useSubmitReviewMutation();

  const handleStartReview = () => {
    setCurrentIndex(0);
    setSessionStats({ reviewed: 0, correct: 0 });
    setPageState('reviewing');
  };

  const handleSubmit = useCallback(
    async (
      questionId: string,
      selectedAnswer: 'A' | 'B' | 'C' | 'D',
      quality: number,
      timeSpentSeconds: number
    ): Promise<ReviewResult> => {
      const result = await submitReview({
        questionId,
        selectedAnswer,
        quality,
        timeSpentSeconds,
      }).unwrap();

      setSessionStats((prev) => ({
        reviewed: prev.reviewed + 1,
        correct: prev.correct + (result.correct ? 1 : 0),
      }));

      return result;
    },
    [submitReview]
  );

  const handleNext = useCallback(() => {
    if (queue && currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // End of review session
      setPageState('completed');
      refetchStats();
      refetchQueue();
    }
  }, [queue, currentIndex, refetchStats, refetchQueue]);

  const handleBackToDashboard = () => {
    setPageState('dashboard');
    refetchStats();
    refetchQueue();
  };

  if (statsLoading || queueLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>Spaced Repetition | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-6 px-4 max-w-4xl mx-auto space-y-6">
        {/* Dashboard View */}
        {pageState === 'dashboard' && (
          <>
            {/* Header */}
            <div className="space-y-2">
              <Text variant="h1">Spaced Repetition</Text>
              <Text variant="body" className="text-cyber-muted">
                Review cards at optimal intervals for long-term retention using the SM-2
                algorithm.
              </Text>
            </div>

            {/* Stats */}
            {stats && <ReviewStatsCard stats={stats} />}

            {/* Review Queue */}
            {queue && queue.length > 0 ? (
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <Text variant="h4">Ready for Review</Text>
                  <Badge variant="cyan">{queue.length} cards</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview of cards */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {queue.slice(0, 5).map((item, idx) => (
                      <div
                        key={item.questionId}
                        className="flex items-center gap-3 p-3 rounded-lg bg-cyber-bg/50"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <Badge size="sm" variant="default">
                          D{item.domainId}
                        </Badge>
                        <Text
                          variant="small"
                          className="flex-1 truncate text-cyber-text"
                        >
                          {item.question}
                        </Text>
                        {item.overdueDays > 0 && (
                          <Badge size="sm" variant="pink">
                            {item.overdueDays}d late
                          </Badge>
                        )}
                      </div>
                    ))}
                    {queue.length > 5 && (
                      <Text
                        variant="small"
                        className="text-cyber-muted text-center py-2"
                      >
                        +{queue.length - 5} more cards
                      </Text>
                    )}
                  </div>

                  <Button onClick={handleStartReview} className="w-full">
                    Start Review Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-green/20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-accent-green"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <Text variant="h3" className="text-accent-green mb-2">
                    All Caught Up!
                  </Text>
                  <Text variant="body" className="text-cyber-muted">
                    No cards are due for review right now.
                    {stats?.nextReviewDate && (
                      <>
                        <br />
                        Next review: {stats.nextReviewDate}
                      </>
                    )}
                  </Text>
                </CardContent>
              </Card>
            )}

            {/* How it works */}
            <Card>
              <CardHeader>
                <Text variant="h4">How Spaced Repetition Works</Text>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-cyber-bg/50 space-y-2">
                    <div className="w-8 h-8 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center font-bold">
                      1
                    </div>
                    <Text variant="label">Answer Questions</Text>
                    <Text variant="small" className="text-cyber-muted">
                      Questions you miss in quizzes are added to your review queue.
                    </Text>
                  </div>
                  <div className="p-4 rounded-lg bg-cyber-bg/50 space-y-2">
                    <div className="w-8 h-8 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center font-bold">
                      2
                    </div>
                    <Text variant="label">Smart Scheduling</Text>
                    <Text variant="small" className="text-cyber-muted">
                      The SM-2 algorithm schedules reviews at optimal intervals.
                    </Text>
                  </div>
                  <div className="p-4 rounded-lg bg-cyber-bg/50 space-y-2">
                    <div className="w-8 h-8 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center font-bold">
                      3
                    </div>
                    <Text variant="label">Master Cards</Text>
                    <Text variant="small" className="text-cyber-muted">
                      Cards you consistently answer correctly become mastered.
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Reviewing View */}
        {pageState === 'reviewing' && queue && queue[currentIndex] && (
          <ReviewCard
            item={queue[currentIndex]}
            onSubmit={handleSubmit}
            onNext={handleNext}
            currentIndex={currentIndex}
            totalCount={queue.length}
          />
        )}

        {/* Completed View */}
        {pageState === 'completed' && (
          <Card className="max-w-xl mx-auto">
            <CardContent className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-accent-green/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-accent-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <Text variant="h2">Review Complete!</Text>
                <Text variant="body" className="text-cyber-muted">
                  Great work on your review session.
                </Text>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-cyber-card border border-cyber-border">
                  <div className="text-3xl font-display font-bold text-accent-cyan">
                    {sessionStats.reviewed}
                  </div>
                  <div className="text-xs text-cyber-muted">Cards Reviewed</div>
                </div>
                <div className="p-4 rounded-lg bg-cyber-card border border-cyber-border">
                  <div
                    className={cn(
                      'text-3xl font-display font-bold',
                      sessionStats.correct / sessionStats.reviewed >= 0.7
                        ? 'text-accent-green'
                        : sessionStats.correct / sessionStats.reviewed >= 0.5
                        ? 'text-accent-gold'
                        : 'text-accent-pink'
                    )}
                  >
                    {sessionStats.reviewed > 0
                      ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-cyber-muted">Accuracy</div>
                </div>
              </div>

              <Button onClick={handleBackToDashboard} className="px-8">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

export default SpacedRepetitionPage;
