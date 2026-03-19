import { useState, useEffect } from 'react';
import { Text, Badge, Button, QuizOption } from '../atoms';
import { Card, CardContent } from '../molecules';
import type { Question, MockExamQuestion as MockExamQuestionType } from '../../types';
import { cn } from '../../lib/utils';

export interface MockExamQuestionProps {
  question: Omit<Question, 'correctAnswer' | 'explanation'> & { id: string };
  examQuestion: MockExamQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => void;
  onFlag: (questionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onNavigate: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const difficultyVariants = {
  easy: 'green',
  medium: 'gold',
  hard: 'pink',
} as const;

export function MockExamQuestion({
  question,
  examQuestion,
  questionNumber,
  totalQuestions,
  onAnswer,
  onFlag,
  onNext,
  onPrevious,
  onNavigate,
  isFirst,
  isLast,
}: MockExamQuestionProps) {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(
    examQuestion.selectedAnswer || null
  );

  // Update local state when examQuestion changes (e.g., navigating between questions)
  useEffect(() => {
    setSelected(examQuestion.selectedAnswer || null);
  }, [examQuestion.selectedAnswer, examQuestion.questionId]);

  const handleSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    setSelected(answer);
    onAnswer(examQuestion.questionId, answer);
  };

  const handleFlag = () => {
    onFlag(examQuestion.questionId);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="space-y-6">
        {/* Question header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-cyber-muted text-sm">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <button
            onClick={handleFlag}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
              examQuestion.flagged
                ? 'bg-accent-orange/20 text-accent-orange'
                : 'bg-cyber-card text-cyber-muted hover:text-accent-orange hover:bg-accent-orange/10'
            )}
          >
            <svg
              className="w-4 h-4"
              fill={examQuestion.flagged ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </svg>
            {examQuestion.flagged ? 'Flagged' : 'Flag for review'}
          </button>
        </div>

        {/* Tags */}
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

        {/* Question text */}
        <Text variant="h3" className="leading-relaxed">
          {question.question}
        </Text>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <QuizOption
              key={option.id}
              id={option.id}
              text={option.text}
              selected={selected === option.id}
              onClick={() => handleSelect(option.id)}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-cyber-border">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={isFirst}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={onNavigate}
            >
              All Questions
            </Button>
          </div>
          <Button onClick={onNext}>
            {isLast ? 'Review & Submit' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
