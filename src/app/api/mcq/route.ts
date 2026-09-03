import { NextResponse, type NextRequest } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MCQ from "@/models/MCQ";
import { createMCQSchema, mcqQuerySchema } from "@/lib/validations";
import { DEFAULT_MCQ_FETCH_LIMIT } from "@/lib/constants";

export const GET = withDB(async (request: NextRequest) => {
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

  const limit = parsed.success ? parsed.data.limit ?? DEFAULT_MCQ_FETCH_LIMIT : DEFAULT_MCQ_FETCH_LIMIT;
  const mcqs = await MCQ.find(filter).limit(limit).lean();
  return NextResponse.json(mcqs);
});

export const POST = withDB(async (request: NextRequest) => {
  const authError = await requireAdmin();
  if (authError) return authError;

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
});
