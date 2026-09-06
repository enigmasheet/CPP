import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import ClassEntry from "@/models/ClassEntry";
import { updateClassEntrySchema } from "@/lib/validations";

export const PATCH = withDB(async (request: Request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { entryId } = await context?.params ?? {};
  if (!entryId) return NextResponse.json({ error: "Missing entryId" }, { status: 400 });

  const body = await request.json();
  const parsed = updateClassEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const entry = await ClassEntry.findByIdAndUpdate(entryId, parsed.data, { returnDocument: "after" }).lean();
  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json(entry);
});

export const DELETE = withDB(async (_request: Request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { entryId } = await context?.params ?? {};
  if (!entryId) return NextResponse.json({ error: "Missing entryId" }, { status: 400 });

  const entry = await ClassEntry.findByIdAndDelete(entryId).lean();
  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
});
