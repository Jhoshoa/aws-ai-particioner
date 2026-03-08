// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role?: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  domainId: number;
  topicId: string;
  completed: boolean;
  completedAt: string | null;
  updatedAt: string;
}

// ============================================
// Domain Types
// ============================================

export interface Domain {
  id: string;
  domainNumber: number;
  name: string;
  weight: number;
  color: string;
  weeks: string;
  topics: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Study Plan Types
// ============================================

export interface StudyWeek {
  id: string;
  week: number;
  phase: StudyPhase;
  domainNumber: number | null;
  daily: string[];
  milestone: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type StudyPhase =
  | 'Foundation'
  | 'GenAI Core'
  | 'Applications'
  | 'Responsible AI'
  | 'Security'
  | 'Full Review'
  | 'Exam Prep'
  | 'Final Push';

// ============================================
// Resource Types
// ============================================

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  url: string;
  note: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ResourceType = 'FREE' | 'PAID' | 'PRACTICE' | 'OFFICIAL';

// ============================================
// Note Types
// ============================================

export interface Note {
  id: string;
  userId: string;
  domainId: number;
  topicId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Progress Summary
// ============================================

export interface ProgressSummary {
  totalTopics: number;
  completedTopics: number;
  percentComplete: number;
  domainProgress: DomainProgress[];
}

export interface DomainProgress {
  domainId: number;
  domainName: string;
  totalTopics: number;
  completedTopics: number;
  percentComplete: number;
}

// ============================================
// Quiz Types
// ============================================

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  domainId: number;
  topicIndex: number;
  question: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  order: number;
}

export interface QuestionWithAnswer extends Question {
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export type QuizMode = 'practice' | 'timed' | 'domain' | 'weak' | 'random';

export interface QuizConfig {
  mode: QuizMode;
  domainId?: number;
  questionCount: number;
  timeLimit?: number;
}

export interface QuizStartResponse {
  attemptId: string;
  questions: Question[];
}

export interface AnswerSubmitResponse {
  correct: boolean;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizQuestionResult {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  correct: boolean;
  timeSpentSeconds: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  mode: QuizMode;
  domainId?: number;
  questions: QuizQuestionResult[];
  score: number;
  totalQuestions: number;
  correctCount: number;
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds: number;
}

export interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  domainStats: Record<number, { attempts: number; averageScore: number }>;
}
