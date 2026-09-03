import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ from "@/models/MCQ";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const mcq = await MCQ.findById(id).lean();

    if (!mcq) {
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: mcq._id,
      question: mcq.question,
      codeSnippet: mcq.codeSnippet,
      options: mcq.options.map((o: { text: string }) => ({ text: o.text })),
      explanation: mcq.explanation,
      topic: mcq.topic,
      difficulty: mcq.difficulty,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch MCQ" }, { status: 500 });
  }
}
