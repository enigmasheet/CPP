import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";
import AuditLog from "@/models/AuditLog";
import MCQ from "@/models/MCQ";
import { sessionSubmitSchema } from "@/lib/validations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB();
    const { code } = await params;
    const session = await Session.findOne({ code: code.toUpperCase() });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = sessionSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { studentCode, name, answers } = parsed.data;

    const existing = await SessionResult.findOne({
      sessionId: session._id,
      studentCode,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted answers for this session" },
        { status: 409 }
      );
    }

    let totalScore = 0;
    let totalPossible = 0;
    const gradedAnswers = [];

    for (const answer of answers) {
      if (answer.contentType === "mcq") {
        const mcq = await MCQ.findById(answer.contentId).lean();
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
        totalPossible += 100;
        totalScore += answer.score || 0;
        gradedAnswers.push({
          contentId: answer.contentId,
          contentType: "game",
          score: answer.score,
        });
      }
    }

    const percentage =
      totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

    const result = await SessionResult.create({
      sessionId: session._id,
      studentCode,
      name: name || undefined,
      answers: gradedAnswers,
      totalScore,
      totalPossible,
      percentage,
    });

    const allResults = await SessionResult.find({ sessionId: session._id })
      .select("percentage")
      .lean();

    const scores = allResults.map((r: { percentage: number }) => r.percentage);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    await AuditLog.findOneAndUpdate(
      { sessionCode: code.toUpperCase() },
      {
        studentCount: allResults.length,
        averageScore: avgScore,
        highestScore,
        lowestScore,
        status: "completed",
      }
    );

    return NextResponse.json({
      resultId: result._id,
      totalScore,
      totalPossible,
      percentage,
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit answers" }, { status: 500 });
  }
}
