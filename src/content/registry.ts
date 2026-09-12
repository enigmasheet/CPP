import { cppSubject } from "./cpp/subject";
import { oopSubject } from "./oop/subject";
import { cppNotes } from "./cpp/notes";
import { oopNotes } from "./oop/notes";
import { cppKnowledge } from "./cpp/knowledge";
import {
  TopicSchema,
  NoteSectionSchema,
  KnowledgeSectionSchema,
} from "./schemas";
import type { SubjectConfig, Topic, NoteSection, KnowledgeSection } from "./types";

export type { SubjectConfig, Topic, NoteSection, KnowledgeSection } from "./types";

// ─── Raw Data ───────────────────────────────────────────────────
const RAW_SUBJECTS: SubjectConfig[] = [cppSubject, oopSubject];
const RAW_NOTES: NoteSection[] = [...cppNotes, ...oopNotes];
const RAW_KNOWLEDGE: KnowledgeSection[] = [...cppKnowledge];

// ─── Validation ─────────────────────────────────────────────────
function validateSubjects(subjects: SubjectConfig[]): void {
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      const result = TopicSchema.safeParse(topic);
      if (!result.success) {
        throw new Error(
          `Invalid topic in ${subject.slug}: ${topic.slug} — ${result.error.message}`
        );
      }
    }
  }
}

function validateNotes(notes: NoteSection[]): void {
  for (const note of notes) {
    const result = NoteSectionSchema.safeParse(note);
    if (!result.success) {
      throw new Error(
        `Invalid note: ${note.id} — ${result.error.message}`
      );
    }
  }
  // Check for duplicate note IDs
  const ids = new Set<string>();
  for (const note of notes) {
    if (ids.has(note.id)) {
      throw new Error(`Duplicate note ID: ${note.id}`);
    }
    ids.add(note.id);
  }
}

function validateKnowledge(knowledge: KnowledgeSection[]): void {
  for (const entry of knowledge) {
    const result = KnowledgeSectionSchema.safeParse(entry);
    if (!result.success) {
      throw new Error(
        `Invalid knowledge entry: ${entry.id} — ${result.error.message}`
      );
    }
  }
  // Check for duplicate knowledge IDs
  const ids = new Set<string>();
  for (const entry of knowledge) {
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate knowledge ID: ${entry.id}`);
    }
    ids.add(entry.id);
  }
}

// Run validation at module load time
validateSubjects(RAW_SUBJECTS);
validateNotes(RAW_NOTES);
validateKnowledge(RAW_KNOWLEDGE);

// ─── Derived Data ───────────────────────────────────────────────
function deriveNoteCounts(notes: NoteSection[]): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};
  for (const note of notes) {
    if (!counts[note.subject]) counts[note.subject] = {};
    counts[note.subject][note.topic] = (counts[note.subject][note.topic] || 0) + 1;
  }
  return counts;
}

const noteCountsBySubject = deriveNoteCounts(RAW_NOTES);

// ─── Public API ─────────────────────────────────────────────────
export const SUBJECTS: SubjectConfig[] = RAW_SUBJECTS;

export function getSubject(slug: string): SubjectConfig | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function getTopics(subjectSlug: string): Topic[] {
  return getSubject(subjectSlug)?.topics ?? [];
}

export function getTopic(subjectSlug: string, topicSlug: string): Topic | undefined {
  return getTopics(subjectSlug).find((t) => t.slug === topicSlug);
}

export function getAllSubjectSlugs(): string[] {
  return SUBJECTS.map((s) => s.slug);
}

export function getNotes(subjectSlug: string, topicSlug: string): NoteSection[] {
  return RAW_NOTES.filter(
    (n) => n.subject === subjectSlug && n.topic === topicSlug
  );
}

export function getAllNotes(): NoteSection[] {
  return RAW_NOTES;
}

export function getNoteById(noteId: string): NoteSection | undefined {
  return RAW_NOTES.find((n) => n.id === noteId);
}

export function getKnowledge(subjectSlug: string): KnowledgeSection[] {
  if (subjectSlug === "cpp") return cppKnowledge;
  return [];
}

export function getNoteCounts(subjectSlug: string): Record<string, number> {
  return noteCountsBySubject[subjectSlug] ?? {};
}

export function getTotalQuestions(subjectSlug: string): number {
  const counts = getNoteCounts(subjectSlug);
  return Object.values(counts).reduce((sum, c) => sum + c, 0);
}
