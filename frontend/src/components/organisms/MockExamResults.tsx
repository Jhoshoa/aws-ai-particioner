import { Text, Button } from '../atoms';
import { Card, CardContent, CardHeader, ExamScoreCard } from '../molecules';
import type { MockExamResults as MockExamResultsType, MockExamStats } from '../../types';

export interface MockExamResultsProps {
  results: MockExamResultsType;
  stats?: MockExamStats;
  onStartNew: () => void;
  onViewHistory: () => void;
  onBackToDashboard: () => void;
}

export function MockExamResults({
  results,
  stats,
  onStartNew,
  onViewHistory,
  onBackToDashboard,
}: MockExamResultsProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Main Score Card */}
      <ExamScoreCard results={results} />

      {/* Stats Overview */}
      {stats && stats.totalExams > 0 && (
        <Card>
          <CardHeader>
            <Text variant="h4">Your Mock Exam History</Text>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-cyber-card rounded-lg">
                <div className="text-2xl font-bold text-accent-cyan">
                  {stats.totalExams}
                </div>
                <div className="text-xs text-cyber-muted">Total Exams</div>
              </div>
              <div className="text-center p-3 bg-cyber-card rounded-lg">
                <div className="text-2xl font-bold text-accent-purple">
                  {stats.averageScore}
                </div>
                <div className="text-xs text-cyber-muted">Average Score</div>
              </div>
              <div className="text-center p-3 bg-cyber-card rounded-lg">
                <div className="text-2xl font-bold text-accent-gold">
                  {stats.bestScore}
                </div>
                <div className="text-xs text-cyber-muted">Best Score</div>
              </div>
              <div className="text-center p-3 bg-cyber-card rounded-lg">
                <div className="text-2xl font-bold text-accent-green">
                  {stats.passRate}%
                </div>
                <div className="text-xs text-cyber-muted">Pass Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="space-y-4">
          <Text variant="body" className="text-cyber-muted text-center">
            {results.passed
              ? 'Congratulations on passing! Keep practicing to improve your score.'
              : 'Keep studying and try again. Focus on the domains where you scored lowest.'}
          </Text>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onStartNew} variant="primary">
              Start New Exam
            </Button>
            <Button onClick={onViewHistory} variant="secondary">
              View History
            </Button>
            <Button onClick={onBackToDashboard} variant="ghost">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Recommendations */}
      {!results.passed && (
        <Card>
          <CardHeader>
            <Text variant="h4">Study Recommendations</Text>
          </CardHeader>
          <CardContent className="space-y-3">
            <Text variant="body" className="text-cyber-muted">
              Based on your results, focus on these areas:
            </Text>
            <ul className="space-y-2">
              {Object.entries(results.domainScores)
                .filter(([, score]) => score.percentage < 70)
                .sort(([, a], [, b]) => a.percentage - b.percentage)
                .slice(0, 3)
                .map(([domainId, score]) => (
                  <li
                    key={domainId}
                    className="flex items-center gap-3 p-3 bg-cyber-card rounded-lg"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-orange/20 text-accent-orange flex items-center justify-center text-sm font-bold">
                      D{domainId}
                    </span>
                    <div className="flex-1">
                      <span className="text-cyber-text">Domain {domainId}</span>
                      <span className="text-cyber-muted text-sm ml-2">
                        ({score.correct}/{score.total} - {score.percentage}%)
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
