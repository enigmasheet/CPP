import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import MCQ from "@/models/MCQ";
import { createMCQSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
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
  } catch {
    return NextResponse.json({ error: "Failed to import MCQs" }, { status: 500 });
  }
}
