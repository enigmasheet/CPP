export interface Topic {
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface SubjectConfig {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  topics: Topic[];
  noteCounts: Record<string, number>;
}

export interface NoteSection {
  id: string;
  subject: string;
  title: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  topic: string;
  teacherOnly?: boolean;
}

export interface KnowledgeSection {
  id: string;
  title: string;
  category: "bugs" | "tricky" | "teaching" | "reference";
  content: string;
}

export interface GameQuestion {
  id: string;
  question: string;
  codeSnippet: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  timeLimit?: number;
}
