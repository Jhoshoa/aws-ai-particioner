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
// Enhanced Progress Types (User Stats & Tracking)
// ============================================

export interface UserStats {
  totalStudyMinutes: number;
  totalTopicsCompleted: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastStudyDate: Date | string | null;
  questionsAnswered: number;
  correctAnswers: number;
  quizzesTaken: number;
}

export interface DomainProgressStats {
  completed: number;
  total: number;
}

export interface RecentActivity {
  type: 'topic_completed' | 'quiz_taken' | 'session_completed';
  description: string;
  timestamp: Date | string;
  domainId?: number;
}

export interface EnhancedProgressSummary {
  stats: UserStats;
  domainProgress: Record<number, DomainProgressStats>;
  totalTopics: number;
  completedTopics: number;
  percentComplete: number;
  recentActivity: RecentActivity[];
}

export interface TopicProgress {
  index: number;
  name: string;
  completed: boolean;
  completedAt?: Date | string;
  notes?: string;
}

export interface DomainProgressDetail {
  domainId: number;
  domainName: string;
  color: string;
  topics: TopicProgress[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
}

export interface UpdateTopicProgressInput {
  domainId: number;
  topicIndex: number;
  completed: boolean;
  studyTimeMinutes?: number;
  notes?: string;
}

export interface BatchUpdateProgressInput {
  updates: UpdateTopicProgressInput[];
}

export interface AddStudyTimeInput {
  minutes: number;
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

// ============================================
// Achievement Types
// ============================================

export type AchievementCategory =
  | 'getting_started'
  | 'domain_mastery'
  | 'streaks'
  | 'quiz_performance'
  | 'study_time'
  | 'mock_exams'
  | 'completion';

export type AchievementConditionType =
  | 'topics_completed'
  | 'quizzes_completed'
  | 'notes_created'
  | 'domain_completed'
  | 'streak_days'
  | 'perfect_quiz'
  | 'correct_answers'
  | 'study_minutes'
  | 'mock_exams_completed'
  | 'mock_score'
  | 'total_progress';

export interface AchievementCondition {
  type: AchievementConditionType;
  value: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  points: number;
  condition: AchievementCondition;
  order: number;
  createdAt?: Date | string;
}

export interface UserAchievement {
  id: string;
  odId: string;
  achievementId: string;
  unlockedAt: Date | string;
  progress?: number;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: Date | string;
  progress?: number;
  target?: number;
}

export interface AchievementSummary {
  totalAchievements: number;
  unlockedCount: number;
  totalPoints: number;
  recentUnlocks: AchievementWithStatus[];
}

// ============================================
// Streak Types
// ============================================

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  isActiveToday: boolean;
  studyDates: string[]; // Last 90 days YYYY-MM-DD
}

export interface StreakCalendarData {
  date: string;
  count: number; // Activity count for that day
}

// ============================================
// Study Session Types
// ============================================

export type SessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface StudySession {
  id: string;
  userId: string;
  domainId: number;
  topicIndex: number;
  startedAt: Date | string;
  endedAt?: Date | string;
  durationMinutes: number;
  pausedMinutes: number;
  pomodorosCompleted: number;
  status: SessionStatus;
  notes?: string;
}

export interface CreateSessionInput {
  domainId: number;
  topicIndex: number;
}

export interface UpdateSessionInput {
  durationMinutes?: number;
  pausedMinutes?: number;
  pomodorosCompleted?: number;
  status?: 'active' | 'paused';
  notes?: string;
}

export interface EndSessionInput {
  durationMinutes: number;
  pausedMinutes?: number;
  pomodorosCompleted?: number;
  status?: 'completed' | 'abandoned';
  notes?: string;
}

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  totalPomodoros: number;
  averageSessionLength: number;
  sessionsThisWeek: number;
  minutesThisWeek: number;
}

// ============================================
// Mock Exam Types
// ============================================

export type MockExamStatus = 'in_progress' | 'completed' | 'abandoned';

export interface MockExamQuestion {
  questionId: string;
  domainId: number;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  flagged: boolean;
  timeSpentSeconds: number;
}

export interface DomainScore {
  correct: number;
  total: number;
  percentage: number;
}

export interface MockExamResults {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  score: number; // 100-1000 AWS-style scale
  passed: boolean;
  passingScore: number;
  domainScores: Record<number, DomainScore>;
  improvement?: number; // vs previous attempt
}

export interface MockExam {
  id: string;
  userId: string;
  status: MockExamStatus;
  startedAt: Date | string;
  completedAt?: Date | string;
  timeLimitMinutes: number;
  timeSpentMinutes: number;
  questions: MockExamQuestion[];
  results?: MockExamResults;
}

export interface MockExamSummary {
  examId: string;
  date: string;
  score: number;
  passed: boolean;
  timeSpentMinutes: number;
}

export interface UpdateMockExamAnswerInput {
  questionId: string;
  answer: 'A' | 'B' | 'C' | 'D';
  timeSpent: number;
}

export interface ToggleMockExamFlagInput {
  questionId: string;
}

export interface SubmitMockExamInput {
  timeSpent: number;
}
