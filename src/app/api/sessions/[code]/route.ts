import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Session from "@/models/Session";
import { updateSessionSchema } from "@/lib/validations";

export const GET = withDB(async (_request, context) => {
  const { code } = await context?.params ?? {};
  const session = await Session.findOne({ code: code?.toUpperCase() }).lean();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const authError = await requireAdmin();
  if (authError && !session.isActive) {
    return NextResponse.json(
      { error: "This session is no longer active" },
      { status: 403 }
    );
  }

  return NextResponse.json(session);
});

export const PATCH = withDB(async (request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { code } = await context?.params ?? {};
  const body = await request.json();
  const parsed = updateSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const session = await Session.findOneAndUpdate(
    { code: code?.toUpperCase() },
    { $set: parsed.data },
    { new: true }
  );

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
});

export const DELETE = withDB(async (_request, context) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { code } = await context?.params ?? {};
  await Session.findOneAndDelete({ code: code?.toUpperCase() });

  return NextResponse.json({ success: true });
});
