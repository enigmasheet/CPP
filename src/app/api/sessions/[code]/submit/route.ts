import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";
import MCQ from "@/models/MCQ";

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

    const { studentCode, answers } = await request.json();

    if (!studentCode || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "studentCode and answers are required" },
        { status: 400 }
      );
    }

    let totalScore = 0;
    let totalPossible = 0;
    const gradedAnswers = [];

    for (const answer of answers) {
      if (answer.contentType === "mcq") {
        const mcq = await MCQ.findById(answer.contentId).lean();
        if (mcq) {
          const isCorrect = mcq.options[answer.selected]?.isCorrect === true;
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
      answers: gradedAnswers,
      totalScore,
      totalPossible,
      percentage,
    });

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
