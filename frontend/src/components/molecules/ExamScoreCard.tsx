import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ProgressBar } from '../atoms';
import type { MockExamResults } from '../../types';

export interface ExamScoreCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'results'> {
  results: MockExamResults;
}

const DOMAIN_NAMES: Record<number, string> = {
  1: 'AI/ML Fundamentals',
  2: 'Generative AI',
  3: 'Foundation Models',
  4: 'Responsible AI',
  5: 'Security & Compliance',
};

export function ExamScoreCard({
  results,
  className,
  ...props
}: ExamScoreCardProps) {
  const { score, passed, passingScore, correctCount, totalQuestions, domainScores, improvement } = results;

  return (
    <div
      className={cn(
        'rounded-xl border p-6 space-y-6',
        passed
          ? 'bg-accent-green/5 border-accent-green/30'
          : 'bg-red-500/5 border-red-500/30',
        className
      )}
      {...props}
    >
      {/* Main Score */}
      <div className="text-center space-y-2">
        <div
          className={cn(
            'text-6xl font-display font-bold',
            passed ? 'text-accent-green' : 'text-red-500'
          )}
        >
          {score}
        </div>
        <div className="text-cyber-muted">
          Score out of 1000 (Passing: {passingScore})
        </div>
        <div
          className={cn(
            'inline-block px-4 py-1.5 rounded-full text-sm font-medium',
            passed
              ? 'bg-accent-green/20 text-accent-green'
              : 'bg-red-500/20 text-red-500'
          )}
        >
          {passed ? 'PASSED' : 'NOT PASSED'}
        </div>
        {improvement !== undefined && improvement !== 0 && (
          <div
            className={cn(
              'text-sm',
              improvement > 0 ? 'text-accent-green' : 'text-red-500'
            )}
          >
            {improvement > 0 ? '+' : ''}{improvement} from previous attempt
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-cyber-text">{correctCount}</div>
          <div className="text-xs text-cyber-muted">Correct</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-cyber-text">{totalQuestions - correctCount}</div>
          <div className="text-xs text-cyber-muted">Incorrect</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-cyber-text">
            {Math.round((correctCount / totalQuestions) * 100)}%
          </div>
          <div className="text-xs text-cyber-muted">Accuracy</div>
        </div>
      </div>

      {/* Domain Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-cyber-text">Domain Breakdown</h4>
        {Object.entries(domainScores).map(([domainId, domainScore]) => {
          const color = domainScore.percentage >= 70
            ? 'bg-accent-green'
            : domainScore.percentage >= 50
            ? 'bg-accent-gold'
            : 'bg-red-500';

          return (
            <div key={domainId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-cyber-muted">
                  D{domainId}: {DOMAIN_NAMES[parseInt(domainId)]}
                </span>
                <span className="text-cyber-text font-medium">
                  {domainScore.correct}/{domainScore.total} ({domainScore.percentage}%)
                </span>
              </div>
              <ProgressBar
                value={domainScore.percentage}
                max={100}
                color={color}
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
