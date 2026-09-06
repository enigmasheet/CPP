import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import MCQ from "@/models/MCQ";
import { updateMCQSchema } from "@/lib/validations";

export const GET = withDB(async (_request, context) => {
  const { id } = await context?.params ?? {};
  const mcq = await MCQ.findById(id).lean();
  if (!mcq) {
    return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
  }
  return NextResponse.json(mcq);
});

export const PATCH = withDB(async (request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context?.params ?? {};
  const body = await request.json();
  const parsed = updateMCQSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const mcq = await MCQ.findByIdAndUpdate(id, parsed.data, { returnDocument: "after" }).lean();
  if (!mcq) {
    return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
  }
  return NextResponse.json(mcq);
});

export const DELETE = withDB(async (_request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context?.params ?? {};
  const mcq = await MCQ.findByIdAndDelete(id).lean();
  if (!mcq) {
    return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
});
