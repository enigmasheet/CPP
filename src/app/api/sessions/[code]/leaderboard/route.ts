import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB();
    const { code } = await params;
    const session = await Session.findOne({ code: code.toUpperCase() }).lean();

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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
