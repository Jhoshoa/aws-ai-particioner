import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../templates';
import { Text, Badge, Button } from '../atoms';
import { Card, CardContent, Alert } from '../molecules';
import { QuizCard } from '../organisms';
import {
  useGetDomainsQuery,
  useStartQuizMutation,
  useSubmitAnswerMutation,
  useCompleteQuizMutation,
} from '../../store/api';
import type { Question, QuizConfig, QuizAttempt, QuizMode } from '../../types';
import { cn } from '../../lib/utils';

type QuizState = 'config' | 'playing' | 'completed';

const modeDescriptions: Record<QuizMode, string> = {
  practice: 'Untimed practice with immediate feedback',
  timed: 'Time limit per question for exam simulation',
  domain: 'Focus on a specific domain',
  weak: 'Questions you previously got wrong',
  random: 'Random mix of all questions',
};

export function QuizPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<QuizState>('config');
  const [attemptId, setAttemptId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Config state
  const [selectedMode, setSelectedMode] = useState<QuizMode>('practice');
  const [selectedDomain, setSelectedDomain] = useState<number | undefined>();
  const [questionCount, setQuestionCount] = useState(10);

  const { data: domains } = useGetDomainsQuery();
  const [startQuiz, { isLoading: starting }] = useStartQuizMutation();
  const [submitAnswer] = useSubmitAnswerMutation();
  const [completeQuiz] = useCompleteQuizMutation();

  const handleStart = async () => {
    setError(null);
    const config: QuizConfig = {
      mode: selectedMode,
      domainId: selectedMode === 'domain' ? selectedDomain : undefined,
      questionCount,
    };

    try {
      const res = await startQuiz(config).unwrap();
      setAttemptId(res.attemptId);
      setQuestions(res.questions);
      setCurrentIndex(0);
      setCorrectCount(0);
      startTimeRef.current = Date.now();
      setState('playing');
    } catch (err) {
      setError('Failed to start quiz. Please try again.');
      console.error('Failed to start quiz:', err);
    }
  };

  const handleSubmit = async (answer: 'A' | 'B' | 'C' | 'D') => {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const res = await submitAnswer({
      attemptId,
      questionId: questions[currentIndex].id,
      selectedAnswer: answer,
      timeSpentSeconds: timeSpent,
    }).unwrap();

    if (res.correct) {
      setCorrectCount((c) => c + 1);
    }

    startTimeRef.current = Date.now();
    return res;
  };

  const handleNext = async () => {
    if (currentIndex + 1 >= questions.length) {
      try {
        const res = await completeQuiz(attemptId).unwrap();
        setResult(res);
        setState('completed');
      } catch (err) {
        console.error('Failed to complete quiz:', err);
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setState('config');
    setAttemptId('');
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setResult(null);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Quiz | AWS AI Practitioner</title>
      </Helmet>

      <div className="py-10 px-4 max-w-4xl mx-auto">
        {state === 'config' && (
          <QuizConfigSection
            domains={domains || []}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            onStart={handleStart}
            loading={starting}
            error={error}
          />
        )}

        {state === 'playing' && questions.length > 0 && (
          <QuizCard
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            correctCount={correctCount}
            onSubmit={handleSubmit}
            onNext={handleNext}
          />
        )}

        {state === 'completed' && result && (
          <QuizResultsSection
            result={result}
            onRestart={handleRestart}
            onGoHome={() => navigate('/')}
          />
        )}
      </div>
    </MainLayout>
  );
}

// Quiz Configuration Section
interface QuizConfigSectionProps {
  domains: Array<{ id: string; domainNumber: number; name: string; color: string }>;
  selectedMode: QuizMode;
  setSelectedMode: (mode: QuizMode) => void;
  selectedDomain: number | undefined;
  setSelectedDomain: (domain: number | undefined) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
  onStart: () => void;
  loading: boolean;
  error: string | null;
}

function QuizConfigSection({
  domains,
  selectedMode,
  setSelectedMode,
  selectedDomain,
  setSelectedDomain,
  questionCount,
  setQuestionCount,
  onStart,
  loading,
  error,
}: QuizConfigSectionProps) {
  const modes: QuizMode[] = ['practice', 'domain', 'random'];
  const questionOptions = [5, 10, 15, 20];

  return (
    <Card>
      <CardContent className="space-y-8">
        <div className="text-center">
          <Text variant="h2" className="mb-2">Start a Quiz</Text>
          <Text variant="body" className="text-cyber-muted">
            Test your knowledge of AWS AI concepts
          </Text>
        </div>

        {error && (
          <Alert variant="error">{error}</Alert>
        )}

        {/* Mode Selection */}
        <div className="space-y-3">
          <Text variant="label">Quiz Mode</Text>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {modes.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-all',
                  selectedMode === mode
                    ? 'border-accent-cyan bg-accent-cyan/10'
                    : 'border-cyber-border hover:border-accent-cyan/50'
                )}
              >
                <Text variant="h3" className="capitalize mb-1">
                  {mode}
                </Text>
                <Text variant="small" className="text-cyber-muted">
                  {modeDescriptions[mode]}
                </Text>
              </button>
            ))}
          </div>
        </div>

        {/* Domain Selection (shown when domain mode selected) */}
        {selectedMode === 'domain' && (
          <div className="space-y-3">
            <Text variant="label">Select Domain</Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setSelectedDomain(domain.domainNumber)}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    selectedDomain === domain.domainNumber
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-cyber-border hover:border-accent-cyan/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                    <Text variant="body" className="font-medium">
                      Domain {domain.domainNumber}
                    </Text>
                  </div>
                  <Text variant="small" className="text-cyber-muted mt-1">
                    {domain.name}
                  </Text>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Count */}
        <div className="space-y-3">
          <Text variant="label">Number of Questions</Text>
          <div className="flex gap-3">
            {questionOptions.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                className={cn(
                  'px-6 py-3 rounded-lg border-2 font-display text-lg transition-all',
                  questionCount === count
                    ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                    : 'border-cyber-border text-cyber-muted hover:border-accent-cyan/50'
                )}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onStart}
            disabled={loading || (selectedMode === 'domain' && !selectedDomain)}
            className="px-12 py-3 text-lg"
          >
            {loading ? 'Starting...' : 'Start Quiz'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Quiz Results Section
interface QuizResultsSectionProps {
  result: QuizAttempt;
  onRestart: () => void;
  onGoHome: () => void;
}

function QuizResultsSection({ result, onRestart, onGoHome }: QuizResultsSectionProps) {
  const percentage = result.score;
  const passed = percentage >= 70;
  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;

  return (
    <Card>
      <CardContent className="space-y-8 text-center">
        <div>
          <Text variant="h2" className="mb-2">Quiz Complete!</Text>
          <Text variant="body" className="text-cyber-muted">
            Here's how you did
          </Text>
        </div>

        {/* Score Circle */}
        <div className="flex justify-center">
          <div
            className={cn(
              'w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center',
              passed
                ? 'border-accent-green bg-accent-green/10'
                : 'border-accent-orange bg-accent-orange/10'
            )}
          >
            <Text
              variant="h1"
              className={passed ? 'text-accent-green' : 'text-accent-orange'}
            >
              {percentage}%
            </Text>
            <Text variant="small" className="text-cyber-muted">
              {result.correctCount} / {result.totalQuestions}
            </Text>
          </div>
        </div>

        {/* Result Badge */}
        <div className="flex justify-center">
          <Badge
            variant={passed ? 'green' : 'orange'}
            size="md"
            className="text-base px-6 py-2"
          >
            {passed ? 'PASSED' : 'NEEDS PRACTICE'}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-cyber-card rounded-lg border border-cyber-border">
            <Text variant="h3" className="text-accent-cyan">
              {result.correctCount}
            </Text>
            <Text variant="small" className="text-cyber-muted">
              Correct
            </Text>
          </div>
          <div className="p-4 bg-cyber-card rounded-lg border border-cyber-border">
            <Text variant="h3" className="text-accent-pink">
              {result.totalQuestions - result.correctCount}
            </Text>
            <Text variant="small" className="text-cyber-muted">
              Incorrect
            </Text>
          </div>
          <div className="p-4 bg-cyber-card rounded-lg border border-cyber-border">
            <Text variant="h3" className="text-accent-gold">
              {minutes}:{String(seconds).padStart(2, '0')}
            </Text>
            <Text variant="small" className="text-cyber-muted">
              Time
            </Text>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="secondary" onClick={onGoHome}>
            Back to Home
          </Button>
          <Button onClick={onRestart}>
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
