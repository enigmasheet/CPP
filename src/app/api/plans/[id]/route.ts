import { NextResponse, type NextRequest } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import TeachingPlan from "@/models/TeachingPlan";

export const PATCH = withDB(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();

  const plan = await TeachingPlan.findByIdAndUpdate(id, body, { new: true });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json(plan);
});

export const DELETE = withDB(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const plan = await TeachingPlan.findByIdAndDelete(id);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
});
