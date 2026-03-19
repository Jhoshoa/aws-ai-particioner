import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import type { MockExamQuestion } from '../../types';

export interface QuestionNavigatorProps extends HTMLAttributes<HTMLDivElement> {
  questions: MockExamQuestion[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

type QuestionStatus = 'current' | 'answered' | 'flagged' | 'unanswered';

function getQuestionStatus(
  question: MockExamQuestion,
  index: number,
  currentIndex: number
): QuestionStatus {
  if (index === currentIndex) return 'current';
  if (question.flagged) return 'flagged';
  if (question.selectedAnswer) return 'answered';
  return 'unanswered';
}

const statusStyles: Record<QuestionStatus, string> = {
  current: 'bg-accent-cyan text-cyber-bg ring-2 ring-accent-cyan ring-offset-2 ring-offset-cyber-bg',
  answered: 'bg-accent-green/20 text-accent-green border-accent-green',
  flagged: 'bg-accent-orange/20 text-accent-orange border-accent-orange',
  unanswered: 'bg-cyber-card text-cyber-muted border-cyber-border hover:border-cyber-text',
};

export function QuestionNavigator({
  questions,
  currentIndex,
  onNavigate,
  className,
  ...props
}: QuestionNavigatorProps) {
  const answeredCount = questions.filter((q) => q.selectedAnswer).length;
  const flaggedCount = questions.filter((q) => q.flagged).length;

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Status summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-cyber-muted">
          Answered: <span className="text-accent-green font-medium">{answeredCount}</span>/{questions.length}
        </span>
        {flaggedCount > 0 && (
          <span className="text-accent-orange">
            Flagged: {flaggedCount}
          </span>
        )}
      </div>

      {/* Question grid */}
      <div className="grid grid-cols-10 gap-1.5">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index, currentIndex);
          return (
            <button
              key={question.questionId}
              onClick={() => onNavigate(index)}
              className={cn(
                'w-8 h-8 rounded text-xs font-medium border transition-all',
                statusStyles[status]
              )}
              aria-label={`Question ${index + 1}${question.flagged ? ' (flagged)' : ''}${question.selectedAnswer ? ' (answered)' : ''}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-cyber-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent-cyan" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent-green/20 border border-accent-green" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent-orange/20 border border-accent-orange" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-cyber-card border border-cyber-border" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}
