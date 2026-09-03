import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";

export const GET = withDB(async (_request, context) => {
  const { code } = await context?.params ?? {};
  const session = await Session.findOne({ code: code?.toUpperCase() }).lean();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const results = await SessionResult.find({ sessionId: session._id })
    .sort({ percentage: -1, completedAt: 1 })
    .lean();

  const leaderboard = results.map((r, idx) => ({
    rank: idx + 1,
    name: r.name,
    studentCode: r.studentCode,
    percentage: r.percentage,
    totalScore: r.totalScore,
    totalPossible: r.totalPossible,
  }));

  return NextResponse.json(leaderboard);
});
