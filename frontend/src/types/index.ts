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
  topicIndex: number;
  title: string;
  content: string;
  tags: string[];
  wordCount: number;
  createdAt: string;
  updatedAt: string;
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
// Enhanced Progress Types
// ============================================

export interface UserStats {
  totalStudyMinutes: number;
  totalTopicsCompleted: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastStudyDate: string | null;
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
  timestamp: string;
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
  completedAt?: string;
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
  createdAt?: string;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
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
  startedAt: string;
  endedAt?: string;
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
  improvement?: number;
}

export interface MockExam {
  id: string;
  userId: string;
  status: MockExamStatus;
  startedAt: string;
  completedAt?: string;
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

export interface MockExamStats {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  passRate: number;
}

export interface MockExamWithQuestions {
  exam: MockExam;
  questions: Question[];
}

// ============================================
// Spaced Repetition Types
// ============================================

export interface QuestionProgress {
  id: string;
  userId: string;
  questionId: string;
  domainId: number;

  // SM-2 Algorithm data
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string;

  // Stats
  totalAttempts: number;
  correctAttempts: number;
  averageQuality: number;

  // Status
  mastered: boolean;
}

export interface ReviewQueueItem {
  questionId: string;
  domainId: number;
  question: string;
  options: QuestionOption[];
  dueDate: string;
  overdueDays: number;
}

export interface ReviewSubmission {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  timeSpentSeconds: number;
}

export interface ReviewStats {
  totalCards: number;
  dueToday: number;
  overdue: number;
  masteredCount: number;
  averageEaseFactor: number;
  nextReviewDate: string | null;
}

export interface ReviewResult {
  progress: QuestionProgress;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
}
