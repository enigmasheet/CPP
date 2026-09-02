import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import MCQ from "@/models/MCQ";
import { createMCQSchema, mcqQuerySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const parsed = mcqQuerySchema.safeParse({
      topic: searchParams.get("topic") || undefined,
      difficulty: searchParams.get("difficulty") || undefined,
      limit: searchParams.get("limit") || undefined,
      subject: searchParams.get("subject") || undefined,
    });

    const filter: Record<string, string> = {};
    if (parsed.success) {
      if (parsed.data.topic) filter.topic = parsed.data.topic;
      if (parsed.data.difficulty) filter.difficulty = parsed.data.difficulty;
      if (parsed.data.subject) filter.subject = parsed.data.subject;
    }

    const limit = parsed.success ? parsed.data.limit ?? 50 : 50;
    const mcqs = await MCQ.find(filter).limit(limit).lean();
    return NextResponse.json(mcqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch MCQs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const parsed = createMCQSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const mcq = await MCQ.create(parsed.data);
    return NextResponse.json(mcq, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create MCQ" }, { status: 500 });
  }
}
