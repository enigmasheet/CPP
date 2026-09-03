import type { DifficultyLevel, AuditStatus, PlanStatus, PlanPriority } from "./constants";

// ─── MCQ Types ──────────────────────────────────────────────
export interface MCQOption {
  text: string;
  isCorrect: boolean;
}

export interface MCQData {
  _id: string;
  subject: string;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: MCQOption[];
  explanation: string;
  difficulty: DifficultyLevel;
  tags: string[];
  createdAt: string;
}

// ─── Session Types ──────────────────────────────────────────
export interface SessionItem {
  contentType: "mcq" | "game";
  contentId: string;
  gameType?: string;
}

export interface SessionData {
  _id: string;
  code: string;
  title: string;
  type: "quiz" | "game" | "mixed";
  items: SessionItem[];
  isActive: boolean;
  createdBy: string;
  section?: string;
  maxAttempts?: number;
  timeLimit?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionWithStats extends SessionData {
  submissionCount?: number;
  avgScore?: number;
}

// ─── Session Result Types ───────────────────────────────────
export interface SessionResultItem {
  contentId: string;
  contentType: "mcq" | "game";
  selected?: number;
  isCorrect?: boolean;
  score?: number;
  totalQuestions?: number;
}

export interface SessionResultData {
  _id: string;
  sessionId: string;
  studentCode: string;
  name?: string;
  answers: SessionResultItem[];
  totalScore: number;
  totalPossible: number;
  percentage: number;
  timeTaken?: number;
  completedAt: string;
}

// ─── Audit Log Types ────────────────────────────────────────
export interface AuditLogData {
  _id: string;
  date: string;
  sessionCode?: string;
  section?: string;
  topicsCovered: string[];
  mcqsUsed: number;
  studentCount: number;
  averageScore?: number;
  highestScore?: number;
  lowestScore?: number;
  duration?: number;
  notes?: string;
  status: AuditStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Teaching Plan Types ────────────────────────────────────
export interface TeachingPlanData {
  _id: string;
  title: string;
  description?: string;
  targetDate?: string;
  topics: string[];
  status: PlanStatus;
  priority: PlanPriority;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Game Types ─────────────────────────────────────────────
export interface GameQuestion {
  id: string;
  question: string;
  codeSnippet: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

export interface SpeedQuestion extends GameQuestion {
  timeLimit: number;
}

// ─── API Response Types ─────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Search Types ───────────────────────────────────────────
export interface SearchResult {
  id: string;
  title: string;
  type: "topic" | "question" | "resource";
  url: string;
  snippet: string;
}

export interface SearchResponse {
  topics: SearchResult[];
  questions: SearchResult[];
  resources: SearchResult[];
}

// ─── Quiz Types ─────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  difficulty: string;
  topic: string;
  correctAnswer: number;
  explanation: string;
}

// ─── Leaderboard Types ──────────────────────────────────────
export interface LeaderboardEntry {
  studentCode: string;
  name?: string;
  percentage: number;
  totalScore: number;
  totalPossible: number;
  timeTaken?: number;
  completedAt: string;
}
