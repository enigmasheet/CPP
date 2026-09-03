import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ, { IMCQDoc } from "@/models/MCQ";
import { shuffleArray } from "@/lib/utils";
import { DEFAULT_QUIZ_LIMIT } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { topic, difficulty, limit = DEFAULT_QUIZ_LIMIT } = await request.json();

    const filter: Record<string, string> = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const allMcqs = await MCQ.find(filter).lean();
    const selected = shuffleArray(allMcqs).slice(0, Math.min(limit, allMcqs.length));

    const questions = selected.map((q: IMCQDoc & { _id: { toString(): string } }) => {
      const correctIdx = q.options.findIndex((o) => o.isCorrect);
      return {
        id: q._id.toString(),
        question: q.question,
        codeSnippet: q.codeSnippet,
        options: q.options.map((o) => o.text),
        difficulty: q.difficulty,
        topic: q.topic,
        correctAnswer: correctIdx,
        explanation: q.explanation,
      };
    });

    return NextResponse.json({ questions, total: questions.length });
  } catch {
    return NextResponse.json({ error: "Failed to start quiz" }, { status: 500 });
  }
}
