import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import TeachingPlan from "@/models/TeachingPlan";
import { updatePlanSchema } from "@/lib/validations";

export const PATCH = withDB(async (request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context?.params ?? {};
  const body = await request.json();
  const parsed = updatePlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const plan = await TeachingPlan.findByIdAndUpdate(id, parsed.data, { returnDocument: "after" });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json(plan);
});

export const DELETE = withDB(async (_request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await context?.params ?? {};
  const plan = await TeachingPlan.findByIdAndDelete(id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
});
