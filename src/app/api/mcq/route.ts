import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import MCQ from "@/models/MCQ";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");
    const limit = parseInt(searchParams.get("limit") || "50");

    const filter: Record<string, string> = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const mcqs = await MCQ.find(filter).limit(limit).lean();
    return NextResponse.json(mcqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch MCQs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const mcq = await MCQ.create(body);
    return NextResponse.json(mcq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create MCQ" }, { status: 500 });
  }
}
