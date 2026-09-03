import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";

export const GET = withDB(async (_request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { code } = await context?.params ?? {};
  const session = await Session.findOne({ code: code?.toUpperCase() }).lean();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const results = await SessionResult.find({ sessionId: session._id })
    .sort({ completedAt: -1 })
    .lean();

  const stats = {
    totalStudents: results.length,
    averagePercentage:
      results.length > 0
        ? Math.round(
            results.reduce((sum, r) => sum + r.percentage, 0) / results.length
          )
        : 0,
    highestPercentage: results.length > 0
      ? Math.max(...results.map((r) => r.percentage))
      : 0,
    lowestPercentage: results.length > 0
      ? Math.min(...results.map((r) => r.percentage))
      : 0,
  };

  const questionAnalytics: Record<string, { totalAttempts: number; correctCount: number }> = {};
  for (const result of results) {
    for (const answer of result.answers) {
      const id = answer.contentId.toString();
      if (!questionAnalytics[id]) {
        questionAnalytics[id] = { totalAttempts: 0, correctCount: 0 };
      }
      questionAnalytics[id].totalAttempts++;
      if (answer.isCorrect) {
        questionAnalytics[id].correctCount++;
      }
    }
  }

  return NextResponse.json({
    session: {
      code: session.code,
      title: session.title,
      type: session.type,
      isActive: session.isActive,
      section: session.section,
      items: session.items,
      timeLimit: session.timeLimit,
      createdAt: session.createdAt,
    },
    results: results.map((r) => ({
      studentCode: r.studentCode,
      name: r.name,
      totalScore: r.totalScore,
      totalPossible: r.totalPossible,
      percentage: r.percentage,
      timeTaken: r.timeTaken,
      completedAt: r.completedAt,
    })),
    stats,
    questionAnalytics,
  });
});
