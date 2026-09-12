import { z } from "zod";
import type { Topic } from "./types";

export const TopicSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  count: z.number().int().nonnegative(),
}) satisfies z.ZodType<Topic>;

export const NoteSectionSchema = z.object({
  id: z.string().min(1),
  subject: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedMinutes: z.number().int().positive(),
  topic: z.string().min(1),
  teacherOnly: z.boolean().optional(),
});

export const KnowledgeSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(["bugs", "tricky", "teaching", "reference"]),
  content: z.string().min(1),
});

export const McqOptionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

export const McqSchema = z.object({
  topic: z.string().min(1),
  question: z.string().min(1),
  codeSnippet: z.string().optional(),
  options: z.array(McqOptionSchema).min(2),
  explanation: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()).optional(),
});

export const ResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(["article", "video", "book", "documentation", "course", "practice"]),
});

export const GameQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  codeSnippet: z.string(),
  options: z.array(z.string()).min(2),
  correctAnswer: z.number().int().nonnegative(),
  explanation: z.string().min(1),
  difficulty: z.string().min(1),
  timeLimit: z.number().int().positive().optional(),
});
