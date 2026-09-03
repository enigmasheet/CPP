import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import TeachingPlan from "@/models/TeachingPlan";
import { createPlanSchema } from "@/lib/validations";
import { PLAN_STATUSES, PLAN_PRIORITIES } from "@/lib/constants";

export const GET = withDB(async () => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const plans = await TeachingPlan.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(plans);
});

export const POST = withDB(async (request) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const parsed = createPlanSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const plan = await TeachingPlan.create({
    title: parsed.data.title,
    description: parsed.data.description || undefined,
    targetDate: parsed.data.targetDate || undefined,
    topics: parsed.data.topics || [],
    status: parsed.data.status || PLAN_STATUSES[0], // todo
    priority: parsed.data.priority || PLAN_PRIORITIES[1], // medium
    notes: parsed.data.notes || undefined,
  });

  return NextResponse.json(plan, { status: 201 });
});
