import { z } from "zod";
import { DIFFICULTY_LEVELS, RESOURCE_DIFFICULTY_LEVELS, CONTENT_TYPES, SESSION_TYPES, AUDIT_STATUSES, PLAN_STATUSES, PLAN_PRIORITIES, MAX_MCQ_QUERY_LIMIT, MAX_SESSION_TITLE_LENGTH, MAX_SECTION_LENGTH, MAX_STUDENT_NAME_LENGTH, DEFAULT_QUIZ_LIMIT, MAX_QUIZ_LIMIT, MAX_SCORE_PERCENTAGE } from "./constants";

// ─── MCQ Schemas ─────────────────────────────────────────────
export const mcqOptionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean(),
});

export const createMCQSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  question: z.string().min(1, "Question is required"),
  codeSnippet: z.string().optional(),
  options: z.array(mcqOptionSchema).min(2, "At least 2 options required"),
  explanation: z.string().min(1, "Explanation is required"),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  tags: z.array(z.string()).optional(),
});

export const mcqQuerySchema = z.object({
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  limit: z.coerce.number().int().positive().max(MAX_MCQ_QUERY_LIMIT).optional(),
  subject: z.string().optional(),
});

// ─── Resource Schemas ────────────────────────────────────────
export const createResourceSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  title: z.string().min(1, "Title is required"),
  type: z.enum(["code", "diagram", "document"]),
  content: z.string().min(1, "Content is required"),
  language: z.string().optional(),
  difficulty: z.enum(RESOURCE_DIFFICULTY_LEVELS),
});

// ─── Session Schemas ─────────────────────────────────────────
export const sessionItemSchema = z.object({
  contentType: z.enum(CONTENT_TYPES),
  contentId: z.string().min(1),
  gameType: z.string().optional(),
});

export const createSessionSchema = z.object({
  title: z.string().min(1, "Title is required").max(MAX_SESSION_TITLE_LENGTH),
  type: z.enum(SESSION_TYPES),
  items: z.array(sessionItemSchema).min(1, "At least 1 item required"),
  subject: z.string().optional(),
  section: z.string().max(MAX_SECTION_LENGTH).optional(),
  maxAttempts: z.number().int().positive().optional(),
  timeLimit: z.number().int().positive().optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(MAX_SESSION_TITLE_LENGTH).optional(),
  isActive: z.boolean().optional(),
  maxAttempts: z.number().int().positive().optional(),
});

// ─── Quiz Schemas ────────────────────────────────────────────
export const quizStartSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.string().optional(),
  limit: z.coerce.number().int().positive().max(MAX_QUIZ_LIMIT).default(DEFAULT_QUIZ_LIMIT),
});

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  selected: z.number().int().min(0),
});

export const quizSubmitSchema = z.object({
  sessionId: z.string().min(1),
  topic: z.string().optional(),
  answers: z.array(quizAnswerSchema).min(1, "At least 1 answer required"),
  timeTaken: z.number().int().nonnegative().optional(),
});

// ─── Session Submission Schemas ──────────────────────────────
export const sessionJoinSchema = z.object({
  name: z.string().max(MAX_STUDENT_NAME_LENGTH).optional(),
});

export const sessionAnswerSchema = z.object({
  contentId: z.string().min(1),
  contentType: z.enum(CONTENT_TYPES),
  selected: z.number().int().min(0).optional(),
  score: z.number().optional(),
  totalQuestions: z.number().int().positive().optional(),
});

export const sessionSubmitSchema = z.object({
  studentCode: z.string().min(1),
  name: z.string().max(MAX_STUDENT_NAME_LENGTH).optional(),
  answers: z.array(sessionAnswerSchema).min(1, "At least 1 answer required"),
  timeTaken: z.number().int().positive().optional(),
});

// ─── Audit Log Schemas ──────────────────────────────────────
export const createAuditSchema = z.object({
  date: z.string().datetime().optional(),
  sessionCode: z.string().optional(),
  section: z.string().max(MAX_SECTION_LENGTH).optional(),
  topicsCovered: z.array(z.string()).optional(),
  mcqsUsed: z.number().int().nonnegative().optional(),
  studentCount: z.number().int().nonnegative().optional(),
  averageScore: z.number().min(0).max(MAX_SCORE_PERCENTAGE).optional(),
  highestScore: z.number().min(0).max(MAX_SCORE_PERCENTAGE).optional(),
  lowestScore: z.number().min(0).max(MAX_SCORE_PERCENTAGE).optional(),
  duration: z.number().positive().optional(),
  notes: z.string().optional(),
  status: z.enum(AUDIT_STATUSES).optional(),
});

// ─── Teaching Plan Schemas ──────────────────────────────────
export const createPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  targetDate: z.string().datetime().optional(),
  topics: z.array(z.string()).optional(),
  status: z.enum(PLAN_STATUSES).optional(),
  priority: z.enum(PLAN_PRIORITIES).optional(),
  notes: z.string().optional(),
});

// ─── Admin Auth Schemas ──────────────────────────────────────
export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

// ─── Type Exports ────────────────────────────────────────────
export type CreateMCQInput = z.infer<typeof createMCQSchema>;
export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type QuizStartInput = z.infer<typeof quizStartSchema>;
export type QuizSubmitInput = z.infer<typeof quizSubmitSchema>;
export type SessionJoinInput = z.infer<typeof sessionJoinSchema>;
export type SessionSubmitInput = z.infer<typeof sessionSubmitSchema>;
export type CreateAuditInput = z.infer<typeof createAuditSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
