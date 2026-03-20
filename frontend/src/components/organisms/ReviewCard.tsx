import { useState, useRef } from 'react';
import { Text, Badge, Button, QuizOption } from '../atoms';
import { Card, CardContent } from '../molecules';
import type { ReviewQueueItem, ReviewResult } from '../../types';
import { cn } from '../../lib/utils';

export interface ReviewCardProps {
  item: ReviewQueueItem;
  onSubmit: (
    questionId: string,
    selectedAnswer: 'A' | 'B' | 'C' | 'D',
    quality: number,
    timeSpentSeconds: number
  ) => Promise<ReviewResult>;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}

const DOMAIN_NAMES: Record<number, string> = {
  1: 'AI/ML Fundamentals',
  2: 'Generative AI',
  3: 'Foundation Models',
  4: 'Responsible AI',
  5: 'Security & Compliance',
};

export function ReviewCard({
  item,
  onSubmit,
  onNext,
  currentIndex,
  totalCount,
}: ReviewCardProps) {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    // Quality is calculated based on correctness and response time
    // If correct and answered quickly (< 10s): 5 (perfect)
    // If correct and took time: 4 (correct with hesitation)
    // If incorrect: 1 (incorrect, wrong answer recognized)
    // Initial quality of 3 (will be recalculated by backend based on answer)
    const initialQuality = timeSpent < 10 ? 4 : 3;

    try {
      const res = await onSubmit(item.questionId, selected, initialQuality, timeSpent);
      setResult(res);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setResult(null);
    startTimeRef.current = Date.now();
    onNext();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm">
              D{item.domainId}
            </Badge>
            <span className="text-cyber-muted text-sm">
              {DOMAIN_NAMES[item.domainId]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {item.overdueDays > 0 && (
              <Badge variant="pink" size="sm">
                {item.overdueDays}d overdue
              </Badge>
            )}
            <span className="text-cyber-muted text-sm">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>

        {/* Question */}
        <Text variant="h3" className="leading-relaxed">
          {item.question}
        </Text>

        {/* Options */}
        <div className="space-y-3">
          {item.options.map((option) => {
            const isSelected = selected === option.id;
            const isCorrect = result?.correctAnswer === option.id;

            return (
              <QuizOption
                key={option.id}
                id={option.id}
                text={option.text}
                selected={isSelected}
                correct={result ? isCorrect : undefined}
                showResult={!!result}
                disabled={!!result}
                onClick={() => !result && setSelected(option.id)}
              />
            );
          })}
        </div>

        {/* Result Feedback */}
        {result && (
          <div
            className={cn(
              'p-4 rounded-lg border',
              result.correct
                ? 'bg-accent-green/10 border-accent-green/30'
                : 'bg-red-500/10 border-red-500/30'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {result.correct ? (
                <svg
                  className="w-5 h-5 text-accent-green"
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
              ) : (
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <Text
                variant="label"
                className={result.correct ? 'text-accent-green' : 'text-red-500'}
              >
                {result.correct ? 'Correct!' : 'Incorrect'}
              </Text>
            </div>
            <Text variant="body" className="text-cyber-muted">
              {result.explanation}
            </Text>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-cyber-border">
          {!result ? (
            <Button
              onClick={handleSubmit}
              disabled={!selected || submitting}
            >
              {submitting ? 'Checking...' : 'Check Answer'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentIndex < totalCount - 1 ? 'Next Card' : 'Finish Review'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;
