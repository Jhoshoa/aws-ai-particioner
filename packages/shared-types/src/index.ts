// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  domainId: number;
  topicId: string;
  completed: boolean;
  completedAt: Date | null;
  updatedAt: Date;
}

// ============================================
// Domain Types
// ============================================

export interface Domain {
  id: number;
  name: string;
  weight: number;
  color: string;
  weeks: string;
  topics: string[];
}

// ============================================
// Study Plan Types
// ============================================

export interface StudyWeek {
  week: number;
  phase: StudyPhase;
  domain: number | null;
  daily: string[];
  milestone: string;
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
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

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
