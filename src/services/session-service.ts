import mongoose from "mongoose";
import SessionResult from "@/models/SessionResult";
import AuditLog from "@/models/AuditLog";
import MCQ from "@/models/MCQ";
import {
  DEFAULT_GAME_TOTAL_QUESTIONS,
  MINUTES_TO_SECONDS,
  TIME_BONUS_HALF_TIME_RATIO,
  MIN_TIME_BONUS,
  MAX_TIME_BONUS,
  AUDIT_STATUSES,
  MAX_SCORE_PERCENTAGE,
} from "@/lib/constants";

interface GradedAnswer {
  contentId: string;
  contentType: string;
  selected?: number;
  isCorrect?: boolean;
  score?: number;
  totalQuestions?: number;
}

interface GradingResult {
  totalScore: number;
  totalPossible: number;
  percentage: number;
  gradedAnswers: GradedAnswer[];
}

export async function gradeAnswers(
  answers: Array<{
    contentId: string;
    contentType: string;
    selected?: number;
    score?: number;
    totalQuestions?: number;
  }>,
  timeLimit?: number,
  timeTaken?: number
): Promise<GradingResult> {
  let totalScore = 0;
  let totalPossible = 0;
  const gradedAnswers: GradedAnswer[] = [];

  // Batch-fetch all MCQs to avoid N+1
  const mcqIds = answers
    .filter((a) => a.contentType === "mcq")
    .map((a) => new mongoose.Types.ObjectId(a.contentId));

  const mcqs = mcqIds.length > 0
    ? await MCQ.find({ _id: { $in: mcqIds } }).lean()
    : [];

  const mcqMap = new Map(mcqs.map((m) => [m._id.toString(), m]));

  for (const answer of answers) {
    if (answer.contentType === "mcq") {
      const mcq = mcqMap.get(answer.contentId);
      if (mcq) {
        const isCorrect = mcq.options[answer.selected ?? 0]?.isCorrect === true;
        if (isCorrect) totalScore++;
        totalPossible++;
        gradedAnswers.push({
          contentId: answer.contentId,
          contentType: "mcq",
          selected: answer.selected,
          isCorrect,
        });
      }
    } else if (answer.contentType === "game") {
      const gameQuestions = answer.totalQuestions || DEFAULT_GAME_TOTAL_QUESTIONS;
      totalPossible += gameQuestions;
      totalScore += answer.score || 0;
      gradedAnswers.push({
        contentId: answer.contentId,
        contentType: "game",
        score: answer.score,
        totalQuestions: gameQuestions,
      });
    }
  }

  const percentage =
    totalPossible > 0 ? Math.round((totalScore / totalPossible) * MAX_SCORE_PERCENTAGE) : 0;

  let finalPercentage = percentage;
  if (timeLimit && timeTaken && timeTaken > 0) {
    finalPercentage = calculateTimeBonus(percentage, timeLimit, timeTaken);
  }

  return {
    totalScore,
    totalPossible,
    percentage: finalPercentage,
    gradedAnswers,
  };
}

export function calculateTimeBonus(
  percentage: number,
  timeLimitMinutes: number,
  timeTakenSeconds: number
): number {
  const timeLimitSeconds = timeLimitMinutes * MINUTES_TO_SECONDS;
  const halfTime = timeLimitSeconds * TIME_BONUS_HALF_TIME_RATIO;
  const timeBonus = Math.max(
    MIN_TIME_BONUS,
    Math.min(MAX_TIME_BONUS, 1 - (timeTakenSeconds - halfTime) / halfTime)
  );
  return Math.round(percentage * timeBonus);
}

export async function updateSessionStats(sessionId: mongoose.Types.ObjectId) {
  const allResults = await SessionResult.find({ sessionId })
    .select("percentage")
    .lean();

  const scores = allResults.map((r: { percentage: number }) => r.percentage);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

  return {
    studentCount: allResults.length,
    averageScore: avgScore,
    highestScore,
    lowestScore,
  };
}

export async function createSessionResult(params: {
  sessionId: mongoose.Types.ObjectId;
  studentCode: string;
  name?: string;
  gradedAnswers: GradedAnswer[];
  totalScore: number;
  totalPossible: number;
  percentage: number;
  timeTaken?: number;
}) {
  return SessionResult.create({
    sessionId: params.sessionId,
    studentCode: params.studentCode,
    name: params.name || undefined,
    answers: params.gradedAnswers,
    totalScore: params.totalScore,
    totalPossible: params.totalPossible,
    percentage: params.percentage,
    timeTaken: params.timeTaken || undefined,
  });
}

export async function updateAuditLog(
  sessionCode: string,
  stats: { studentCount: number; averageScore: number; highestScore: number; lowestScore: number }
) {
  await AuditLog.findOneAndUpdate(
    { sessionCode },
    {
      ...stats,
      status: AUDIT_STATUSES[1], // completed
    }
  );
}
