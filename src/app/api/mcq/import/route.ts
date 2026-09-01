import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ from "@/models/MCQ";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { mcqs } = body;

    if (!Array.isArray(mcqs) || mcqs.length === 0) {
      return NextResponse.json({ error: "No MCQs provided" }, { status: 400 });
    }

    const result = await MCQ.insertMany(mcqs);
    return NextResponse.json({ imported: result.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to import MCQs" }, { status: 500 });
  }
}
