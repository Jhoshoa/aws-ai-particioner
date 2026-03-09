import { Request } from 'express';

// ============================================
// Shared Types (copied from shared-types package)
// ============================================

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserProgress {
  id: string;
  userId: string;
  domainId: string;
  topicIndex: number;
  completed: boolean;
  completedAt: Date | string | null;
  updatedAt: Date | string;
}

export interface Domain {
  id: string;
  domainNumber: number;
  name: string;
  weight: number;
  color: string;
  weeks: string;
  topics: string[];
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type CreateDomainInput = Omit<Domain, 'id' | 'createdAt' | 'updatedAt'>;

export interface StudyWeek {
  id: string;
  week: number;
  phase: StudyPhase;
  domainNumber: number | null;
  daily: string[];
  milestone: string;
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
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

export type CreateStudyWeekInput = Omit<StudyWeek, 'id' | 'createdAt' | 'updatedAt'>;

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  url: string;
  note: string;
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ResourceType = 'FREE' | 'PAID' | 'PRACTICE' | 'OFFICIAL';

export type CreateResourceInput = Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// Notes Types
// ============================================

export interface Note {
  id: string;
  userId: string;
  domainId: number;
  topicIndex: number;
  title: string;
  content: string;
  tags: string[];
  wordCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateNoteInput {
  domainId: number;
  topicIndex: number;
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface NotesSummary {
  totalNotes: number;
  totalWords: number;
  notesByDomain: Record<number, number>;
  recentNotes: Note[];
}

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
// Auth Types
// ============================================

/**
 * Authenticated user attached to request
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  customClaims?: Record<string, unknown>;
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

/**
 * API Error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationErrorDetail[];
  stack?: string;
}

/**
 * API Success response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
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
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  order: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type CreateQuestionInput = Omit<Question, 'id' | 'createdAt' | 'updatedAt'>;

export type QuizMode = 'practice' | 'timed' | 'domain' | 'weak' | 'random';

export interface QuizConfig {
  mode: QuizMode;
  domainId?: number;
  questionCount: number;
  timeLimit?: number;
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
  startedAt: Date | string;
  completedAt?: Date | string;
  timeSpentSeconds: number;
}

export interface QuizQuestionResult {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  correct: boolean;
  timeSpentSeconds: number;
}

export interface QuizSubmission {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  timeSpentSeconds: number;
}
