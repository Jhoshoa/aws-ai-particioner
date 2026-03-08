import { useState } from 'react';
import { Text, Badge, Button, QuizOption } from '../atoms';
import { Card, CardContent, QuizProgress } from '../molecules';
import type { Question, AnswerSubmitResponse } from '../../types';
import { cn } from '../../lib/utils';

export interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  correctCount: number;
  onSubmit: (answer: 'A' | 'B' | 'C' | 'D') => Promise<AnswerSubmitResponse>;
  onNext: () => void;
}

const difficultyVariants = {
  easy: 'green',
  medium: 'gold',
  hard: 'pink',
} as const;

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  correctCount,
  onSubmit,
  onNext,
}: QuizCardProps) {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [result, setResult] = useState<AnswerSubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await onSubmit(selected);
      setResult(res);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setResult(null);
    onNext();
  };

  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="space-y-6">
        <QuizProgress
          current={questionNumber}
          total={totalQuestions}
          correctCount={correctCount + (result?.correct ? 1 : 0)}
        />

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={difficultyVariants[question.difficulty]} size="sm">
            {question.difficulty}
          </Badge>
          <Badge variant="cyan" size="sm">
            Domain {question.domainId}
          </Badge>
          {question.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>

        <Text variant="h3" className="leading-relaxed">
          {question.question}
        </Text>

        <div className="space-y-3">
          {question.options.map((option) => (
            <QuizOption
              key={option.id}
              id={option.id}
              text={option.text}
              selected={selected === option.id}
              correct={result?.correctAnswer === option.id}
              showResult={!!result}
              disabled={!!result || submitting}
              onClick={() => setSelected(option.id)}
            />
          ))}
        </div>

        {result && (
          <div
            className={cn(
              'p-4 rounded-lg border',
              result.correct
                ? 'bg-accent-green/10 border-accent-green/30'
                : 'bg-accent-pink/10 border-accent-pink/30'
            )}
          >
            <Text
              variant="label"
              className={cn(
                'mb-2',
                result.correct ? 'text-accent-green' : 'text-accent-pink'
              )}
            >
              {result.correct ? 'CORRECT!' : 'INCORRECT'}
            </Text>
            <Text variant="body" className="text-cyber-text">
              {result.explanation}
            </Text>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          {!result ? (
            <Button
              onClick={handleSubmit}
              disabled={!selected || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {isLastQuestion ? 'See Results' : 'Next Question'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
