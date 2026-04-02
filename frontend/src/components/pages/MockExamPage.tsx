import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../templates';
import { Text, Button, Spinner, ExamTimer } from '../atoms';
import { Card, CardContent, QuestionNavigator, Alert } from '../molecules';
import { MockExamQuestion, MockExamResults } from '../organisms';
import {
  useGetActiveExamQuery,
  useGetExamStatsQuery,
  useGetMockExamQuery,
  useStartExamMutation,
  useUpdateAnswerMutation,
  useToggleFlagMutation,
  useSubmitExamMutation,
} from '../../store/api';
import type { MockExamResults as MockExamResultsType, MockExamQuestion as MockExamQuestionType } from '../../types';
import { cn } from '../../lib/utils';

type ExamState = 'start' | 'loading' | 'playing' | 'reviewing' | 'submitting' | 'results';

const TIME_LIMIT_SECONDS = 90 * 60; // 90 minutes

export function MockExamPage() {
  const navigate = useNavigate();
  const [examState, setExamState] = useState<ExamState>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNavigator, setShowNavigator] = useState(false);
  const [examId, setExamId] = useState<string | null>(null);
  const [localQuestions, setLocalQuestions] = useState<MockExamQuestionType[]>([]);
  const [results, setResults] = useState<MockExamResultsType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(TIME_LIMIT_SECONDS);
  const startTimeRef = useRef<Date | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Queries and mutations
  const { data: activeExam, isLoading: checkingActive } = useGetActiveExamQuery();
  const { data: examStats, refetch: refetchStats } = useGetExamStatsQuery();
  const { data: examData, isLoading: loadingExam } = useGetMockExamQuery(examId || '', {
    skip: !examId,
  });
  const [startExam, { isLoading: starting }] = useStartExamMutation();
  const [updateAnswer] = useUpdateAnswerMutation();
  const [toggleFlag] = useToggleFlagMutation();
  const [submitExam, { isLoading: submitting }] = useSubmitExamMutation();

  // Check for active exam on mount
  useEffect(() => {
    if (activeExam && activeExam.status === 'in_progress') {
      setExamId(activeExam.id);
      setExamState('loading');
    }
  }, [activeExam]);

  // Load exam data when examId is set
  useEffect(() => {
    if (examData) {
      setLocalQuestions(examData.exam.questions);
      startTimeRef.current = new Date(examData.exam.startedAt);
      setExamState('playing');
    }
  }, [examData]);

  // Handle time up - submit the exam when time runs out
  const handleTimeUp = useCallback(async () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (!examId) return;

    setExamState('submitting');
    const timeSpent = Math.floor((Date.now() - startTimeRef.current!.getTime()) / 1000 / 60);

    try {
      const examResults = await submitExam({ examId, timeSpent }).unwrap();
      setResults(examResults);
      await refetchStats();
      setExamState('results');
    } catch (err) {
      setError('Failed to submit exam. Please try again.');
      setExamState('playing');
      console.error('Failed to submit exam:', err);
    }
  }, [examId, submitExam, refetchStats]);

  // Timer effect
  useEffect(() => {
    if (examState === 'playing' && startTimeRef.current) {
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!.getTime()) / 1000);
        const remaining = Math.max(0, TIME_LIMIT_SECONDS - elapsed);
        setRemainingTime(remaining);

        if (remaining === 0) {
          handleTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [examState, handleTimeUp]);

  const handleStart = async () => {
    setError(null);
    try {
      const exam = await startExam().unwrap();
      setExamId(exam.id);
      setExamState('loading');
    } catch (err) {
      setError('Failed to start exam. Please try again.');
      console.error('Failed to start exam:', err);
    }
  };

  const handleAnswer = useCallback(async (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    if (!examId) return;

    // Update local state immediately for responsiveness
    setLocalQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? { ...q, selectedAnswer: answer }
          : q
      )
    );

    // Calculate time spent on this question
    const timeSpent = Math.floor((Date.now() - startTimeRef.current!.getTime()) / 1000);

    try {
      await updateAnswer({
        examId,
        questionId,
        answer,
        timeSpent,
      }).unwrap();
    } catch (err) {
      console.error('Failed to save answer:', err);
    }
  }, [examId, updateAnswer]);

  const handleFlag = useCallback(async (questionId: string) => {
    if (!examId) return;

    // Update local state immediately
    setLocalQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? { ...q, flagged: !q.flagged }
          : q
      )
    );

    try {
      await toggleFlag({ examId, questionId }).unwrap();
    } catch (err) {
      console.error('Failed to toggle flag:', err);
      // Revert on error
      setLocalQuestions((prev) =>
        prev.map((q) =>
          q.questionId === questionId
            ? { ...q, flagged: !q.flagged }
            : q
        )
      );
    }
  }, [examId, toggleFlag]);

  const handleSubmit = useCallback(async () => {
    await handleTimeUp();
  }, [handleTimeUp]);

  const handleStartNew = () => {
    setExamId(null);
    setLocalQuestions([]);
    setResults(null);
    setCurrentIndex(0);
    setRemainingTime(TIME_LIMIT_SECONDS);
    setExamState('start');
  };

  // Get current question data
  const currentQuestion = examData?.questions[currentIndex];
  const currentExamQuestion = localQuestions[currentIndex];

  if (checkingActive) {
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
        <title>Mock Exam | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-6 px-4 max-w-6xl mx-auto">
        {/* Start Screen */}
        {examState === 'start' && (
          <StartScreen
            stats={examStats}
            onStart={handleStart}
            loading={starting}
            error={error}
          />
        )}

        {/* Loading */}
        {(examState === 'loading' || loadingExam) && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spinner size="lg" />
            <Text variant="body" className="text-cyber-muted">
              Loading exam...
            </Text>
          </div>
        )}

        {/* Playing */}
        {examState === 'playing' && currentQuestion && currentExamQuestion && (
          <div className="space-y-4">
            {/* Header with Timer */}
            <div className="flex items-center justify-between bg-cyber-card p-4 rounded-lg border border-cyber-border">
              <Text variant="h4" className="text-cyber-text">
                Mock Exam
              </Text>
              <ExamTimer
                remainingSeconds={remainingTime}
                totalSeconds={TIME_LIMIT_SECONDS}
                size="md"
              />
            </div>

            {/* Question or Navigator */}
            {showNavigator ? (
              <Card>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Text variant="h3">Question Navigator</Text>
                    <Button
                      variant="ghost"
                      onClick={() => setShowNavigator(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <QuestionNavigator
                    questions={localQuestions}
                    currentIndex={currentIndex}
                    onNavigate={(index) => {
                      setCurrentIndex(index);
                      setShowNavigator(false);
                    }}
                  />
                  <div className="flex justify-between pt-4 border-t border-cyber-border">
                    <Text variant="body" className="text-cyber-muted">
                      {localQuestions.filter((q) => q.selectedAnswer).length} of {localQuestions.length} answered
                    </Text>
                    <Button onClick={() => setExamState('reviewing')}>
                      Review & Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <MockExamQuestion
                question={currentQuestion}
                examQuestion={currentExamQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={localQuestions.length}
                onAnswer={handleAnswer}
                onFlag={handleFlag}
                onNext={() => {
                  if (currentIndex < localQuestions.length - 1) {
                    setCurrentIndex((i) => i + 1);
                  } else {
                    setExamState('reviewing');
                  }
                }}
                onPrevious={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                onNavigate={() => setShowNavigator(true)}
                isFirst={currentIndex === 0}
                isLast={currentIndex === localQuestions.length - 1}
              />
            )}
          </div>
        )}

        {/* Reviewing */}
        {examState === 'reviewing' && (
          <ReviewScreen
            questions={localQuestions}
            onGoBack={() => setExamState('playing')}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}

        {/* Submitting */}
        {examState === 'submitting' && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Spinner size="lg" />
            <Text variant="body" className="text-cyber-muted">
              Submitting exam...
            </Text>
          </div>
        )}

        {/* Results */}
        {examState === 'results' && results && (
          <MockExamResults
            results={results}
            stats={examStats}
            onStartNew={handleStartNew}
            onViewHistory={() => navigate('/progress')}
            onBackToDashboard={() => navigate('/')}
          />
        )}
      </div>
    </MainLayout>
  );
}

// Start Screen Component
interface StartScreenProps {
  stats?: { totalExams: number; averageScore: number; bestScore: number; passRate: number };
  onStart: () => void;
  loading: boolean;
  error: string | null;
}

function StartScreen({ stats, onStart, loading, error }: StartScreenProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <Text variant="h2">Mock Exam</Text>
            <Text variant="body" className="text-cyber-muted">
              Full-length practice exam simulating the AWS AI Practitioner certification
            </Text>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          {/* Exam Info */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="p-4 bg-cyber-card rounded-lg border border-cyber-border">
              <Text variant="h3" className="text-accent-cyan">65</Text>
              <Text variant="small" className="text-cyber-muted">Questions</Text>
            </div>
            <div className="p-4 bg-cyber-card rounded-lg border border-cyber-border">
              <Text variant="h3" className="text-accent-cyan">90</Text>
              <Text variant="small" className="text-cyber-muted">Minutes</Text>
            </div>
            <div className="p-4 bg-cyber-card rounded-lg border border-cyber-border">
              <Text variant="h3" className="text-accent-cyan">700</Text>
              <Text variant="small" className="text-cyber-muted">Passing Score</Text>
            </div>
          </div>

          {/* Domain Distribution */}
          <div className="text-left space-y-3">
            <Text variant="label">Domain Distribution</Text>
            <div className="space-y-2">
              {[
                { id: 1, name: 'AI/ML Fundamentals', questions: 13, weight: '20%' },
                { id: 2, name: 'Generative AI', questions: 16, weight: '24%' },
                { id: 3, name: 'Foundation Models', questions: 18, weight: '28%' },
                { id: 4, name: 'Responsible AI', questions: 9, weight: '14%' },
                { id: 5, name: 'Security & Compliance', questions: 9, weight: '14%' },
              ].map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between text-sm p-2 bg-cyber-card/50 rounded"
                >
                  <span className="text-cyber-text">
                    D{domain.id}: {domain.name}
                  </span>
                  <span className="text-cyber-muted">
                    {domain.questions} questions ({domain.weight})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={onStart}
            disabled={loading}
            className="px-12 py-3 text-lg"
          >
            {loading ? 'Starting...' : 'Start Exam'}
          </Button>
        </CardContent>
      </Card>

      {/* Previous Stats */}
      {stats && stats.totalExams > 0 && (
        <Card>
          <CardContent>
            <Text variant="h4" className="mb-4">Your Previous Attempts</Text>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <Text variant="h3" className="text-accent-cyan">{stats.totalExams}</Text>
                <Text variant="small" className="text-cyber-muted">Attempts</Text>
              </div>
              <div className="text-center">
                <Text variant="h3" className="text-accent-purple">{stats.averageScore}</Text>
                <Text variant="small" className="text-cyber-muted">Avg Score</Text>
              </div>
              <div className="text-center">
                <Text variant="h3" className="text-accent-gold">{stats.bestScore}</Text>
                <Text variant="small" className="text-cyber-muted">Best Score</Text>
              </div>
              <div className="text-center">
                <Text variant="h3" className="text-accent-green">{stats.passRate}%</Text>
                <Text variant="small" className="text-cyber-muted">Pass Rate</Text>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Review Screen Component
interface ReviewScreenProps {
  questions: MockExamQuestionType[];
  onGoBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

function ReviewScreen({ questions, onGoBack, onSubmit, submitting }: ReviewScreenProps) {
  const answeredCount = questions.filter((q) => q.selectedAnswer).length;
  const flaggedCount = questions.filter((q) => q.flagged).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="space-y-6 text-center">
        <div className="space-y-2">
          <Text variant="h2">Review & Submit</Text>
          <Text variant="body" className="text-cyber-muted">
            Make sure you've answered all questions before submitting
          </Text>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className={cn(
            'p-4 rounded-lg border',
            answeredCount === questions.length
              ? 'bg-accent-green/10 border-accent-green/30'
              : 'bg-cyber-card border-cyber-border'
          )}>
            <Text variant="h3" className="text-accent-green">{answeredCount}</Text>
            <Text variant="small" className="text-cyber-muted">Answered</Text>
          </div>
          <div className={cn(
            'p-4 rounded-lg border',
            unansweredCount > 0
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-cyber-card border-cyber-border'
          )}>
            <Text variant="h3" className={unansweredCount > 0 ? 'text-red-500' : 'text-cyber-text'}>
              {unansweredCount}
            </Text>
            <Text variant="small" className="text-cyber-muted">Unanswered</Text>
          </div>
          <div className={cn(
            'p-4 rounded-lg border',
            flaggedCount > 0
              ? 'bg-accent-orange/10 border-accent-orange/30'
              : 'bg-cyber-card border-cyber-border'
          )}>
            <Text variant="h3" className={flaggedCount > 0 ? 'text-accent-orange' : 'text-cyber-text'}>
              {flaggedCount}
            </Text>
            <Text variant="small" className="text-cyber-muted">Flagged</Text>
          </div>
        </div>

        {/* Warning */}
        {unansweredCount > 0 && (
          <Alert variant="warning">
            You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
            Unanswered questions will be marked as incorrect.
          </Alert>
        )}

        {flaggedCount > 0 && (
          <Alert variant="info">
            You have {flaggedCount} flagged question{flaggedCount > 1 ? 's' : ''} for review.
          </Alert>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="secondary" onClick={onGoBack}>
            Go Back
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
