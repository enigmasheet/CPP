import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Class from "@/models/Class";
import ClassEntry from "@/models/ClassEntry";
import { updateClassSchema } from "@/lib/validations";

export const GET = withDB(async (request: Request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context!.params;
  const cls = await Class.findById(id).lean();
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }
  return NextResponse.json(cls);
});

export const PATCH = withDB(async (request: Request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context!.params;
  const body = await request.json();
  const parsed = updateClassSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const cls = await Class.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }
  return NextResponse.json(cls);
});

export const DELETE = withDB(async (_request: Request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context!.params;
  const cls = await Class.findByIdAndDelete(id).lean();
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }
  await ClassEntry.deleteMany({ classId: id });
  return NextResponse.json({ success: true });
});
