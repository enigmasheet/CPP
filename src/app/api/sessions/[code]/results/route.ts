import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { code } = await params;
    const session = await Session.findOne({ code: code.toUpperCase() }).lean();

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

    return NextResponse.json({
      session: {
        code: session.code,
        title: session.title,
        type: session.type,
        isActive: session.isActive,
        createdAt: session.createdAt,
      },
      results: results.map((r) => ({
        studentCode: r.studentCode,
        name: r.name,
        totalScore: r.totalScore,
        totalPossible: r.totalPossible,
        percentage: r.percentage,
        completedAt: r.completedAt,
      })),
      stats,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
