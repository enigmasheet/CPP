import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Class from "@/models/Class";
import { createClassSchema } from "@/lib/validations";

export const GET = withDB(async () => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const classes = await Class.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(classes);
});

export const POST = withDB(async (request: Request) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const parsed = createClassSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const cls = await Class.create(parsed.data);
  return NextResponse.json(cls, { status: 201 });
});
