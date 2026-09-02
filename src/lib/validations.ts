import { z } from "zod";

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
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()).optional(),
});

export const mcqQuerySchema = z.object({
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
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
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

// ─── Session Schemas ─────────────────────────────────────────
export const sessionItemSchema = z.object({
  contentType: z.enum(["mcq", "game"]),
  contentId: z.string().min(1),
  gameType: z.string().optional(),
});

export const createSessionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["quiz", "game", "mixed"]),
  items: z.array(sessionItemSchema).min(1, "At least 1 item required"),
  section: z.string().max(100).optional(),
  maxAttempts: z.number().int().positive().optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
  maxAttempts: z.number().int().positive().optional(),
});

// ─── Quiz Schemas ────────────────────────────────────────────
export const quizStartSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.string().optional(),
  limit: z.coerce.number().int().positive().max(50).default(10),
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
  name: z.string().max(100).optional(),
});

export const sessionAnswerSchema = z.object({
  contentId: z.string().min(1),
  contentType: z.enum(["mcq", "game"]),
  selected: z.number().int().min(0).optional(),
  score: z.number().optional(),
});

export const sessionSubmitSchema = z.object({
  studentCode: z.string().min(1),
  name: z.string().max(100).optional(),
  answers: z.array(sessionAnswerSchema).min(1, "At least 1 answer required"),
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
