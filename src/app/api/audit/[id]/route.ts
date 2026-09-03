import { NextResponse, type NextRequest } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import AuditLog from "@/models/AuditLog";

export const PATCH = withDB(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();

  const log = await AuditLog.findByIdAndUpdate(id, body, { new: true });
  if (!log) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 });
  }
  return NextResponse.json(log);
});

export const DELETE = withDB(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const log = await AuditLog.findByIdAndDelete(id);
  if (!log) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
});
