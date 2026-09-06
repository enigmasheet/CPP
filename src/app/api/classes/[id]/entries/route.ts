import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Class from "@/models/Class";
import ClassEntry from "@/models/ClassEntry";
import { createClassEntrySchema } from "@/lib/validations";

export const GET = withDB(async (_request: Request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context?.params ?? {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const cls = await Class.findById(id).lean();
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const entries = await ClassEntry.find({ classId: id }).sort({ date: -1 }).lean();
  return NextResponse.json(entries);
});

export const POST = withDB(async (request: Request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context?.params ?? {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const cls = await Class.findById(id).lean();
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = createClassEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const entry = await ClassEntry.create({
    classId: id,
    ...parsed.data,
  });
  return NextResponse.json(entry, { status: 201 });
});
