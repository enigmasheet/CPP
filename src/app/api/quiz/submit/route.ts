import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import MCQ from "@/models/MCQ";
import QuizAttempt from "@/models/QuizAttempt";
import { MAX_SCORE_PERCENTAGE, DEFAULT_SUBJECT, DEFAULT_TOPIC } from "@/lib/constants";

export const POST = withDB(async (request) => {
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
    subject: subject || DEFAULT_SUBJECT,
    topic: topic || DEFAULT_TOPIC,
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
    percentage: Math.round((score / answers.length) * MAX_SCORE_PERCENTAGE),
    timeTaken,
  });
});
