export type { Topic, SubjectConfig } from "@/content/types";
export {
  getSubject,
  getTopics,
  getTopic,
  getAllSubjectSlugs,
  getTotalQuestions,
  getNoteCounts,
} from "@/content/registry";

import { SUBJECTS as SUBJECTS_ARRAY } from "@/content/registry";
import type { SubjectConfig } from "@/content/types";

// Legacy map for backward compatibility (13 importers expect Record<string, SubjectConfig>)
export const SUBJECTS: Record<string, SubjectConfig> = Object.fromEntries(
  SUBJECTS_ARRAY.map((s) => [s.slug, s])
);
