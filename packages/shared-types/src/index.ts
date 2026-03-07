// ============================================
// User Types
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Input type for creating domains (without id)
export type CreateDomainInput = Omit<Domain, 'id' | 'createdAt' | 'updatedAt'>;

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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ResourceType = 'FREE' | 'PAID' | 'PRACTICE' | 'OFFICIAL';

export type CreateResourceInput = Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>;

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

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
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
