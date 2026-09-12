import type { GameQuestion, GameTypeMeta } from "./types";
import { GameQuestionSchema } from "./schemas";
import { GAME_TYPES } from "@/lib/constants";

import cppOutputPredictor from "./cpp/games/output-predictor.json";
import cppBugHunter from "./cpp/games/bug-hunter.json";
import cppSpeedCode from "./cpp/games/speed-code.json";

// Subject-keyed → gameType-keyed → questions
// To add a new subject: import its JSON files and add one entry below.
const GAME_CONTENT: Record<string, Record<string, GameQuestion[]>> = {
  cpp: {
    "output-predictor": cppOutputPredictor as GameQuestion[],
    "bug-hunter": cppBugHunter as GameQuestion[],
    "speed-code": cppSpeedCode as GameQuestion[],
  },
};

// Validate on module load (fail-fast on bad content)
for (const types of Object.values(GAME_CONTENT)) {
  for (const questions of Object.values(types)) {
    for (const q of questions) {
      GameQuestionSchema.parse(q);
    }
  }
}

export function getGameQuestions(subjectSlug: string, gameType: string): GameQuestion[] {
  return GAME_CONTENT[subjectSlug]?.[gameType] ?? [];
}

export function getAvailableGameTypes(subjectSlug: string): GameTypeMeta[] {
  return GAME_TYPES.filter(
    (t) => t.implemented && (GAME_CONTENT[subjectSlug]?.[t.id]?.length ?? 0) > 0,
  );
}

export function hasGameContent(subjectSlug: string, gameType: string): boolean {
  return (GAME_CONTENT[subjectSlug]?.[gameType]?.length ?? 0) > 0;
}
