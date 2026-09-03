import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MCQ from "@/models/MCQ";
import { createMCQSchema } from "@/lib/validations";

export const POST = withDB(async (request) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { mcqs } = body;

  if (!Array.isArray(mcqs) || mcqs.length === 0) {
    return NextResponse.json({ error: "No MCQs provided" }, { status: 400 });
  }

  const validated = [];
  const errors: string[] = [];

  for (let i = 0; i < mcqs.length; i++) {
    const parsed = createMCQSchema.safeParse(mcqs[i]);
    if (parsed.success) {
      validated.push(parsed.data);
    } else {
      errors.push(`Item ${i + 1}: ${parsed.error.message}`);
    }
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 }
    );
  }

  const result = await MCQ.insertMany(validated);
  return NextResponse.json({ imported: result.length }, { status: 201 });
});
