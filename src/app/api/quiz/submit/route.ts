import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ from "@/models/MCQ";
import QuizAttempt from "@/models/QuizAttempt";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { sessionId, subject, topic, answers, timeTaken } = await request.json();

    if (!sessionId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let score = 0;
    const questionResults = [];

    for (const answer of answers) {
      const mcq = await MCQ.findById(answer.questionId).lean();
      if (mcq) {
        const isCorrect = mcq.options[answer.selected]?.isCorrect === true;
        if (isCorrect) score++;
        questionResults.push({
          questionId: answer.questionId,
          selected: answer.selected,
          isCorrect,
        });
      }
    }

    const attempt = await QuizAttempt.create({
      sessionId,
      subject: subject || "unknown",
      topic: topic || "general",
      questions: questionResults,
      score,
      totalQuestions: answers.length,
      timeTaken,
      completedAt: new Date(),
    });

    return NextResponse.json({
      attemptId: attempt._id,
      score,
      totalQuestions: answers.length,
      percentage: Math.round((score / answers.length) * 100),
      timeTaken,
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
