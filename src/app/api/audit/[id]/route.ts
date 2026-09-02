import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import AuditLog from "@/models/AuditLog";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const log = await AuditLog.findByIdAndUpdate(id, body, { new: true });
    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }
    return NextResponse.json(log);
  } catch {
    return NextResponse.json({ error: "Failed to update audit log" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const log = await AuditLog.findByIdAndDelete(id);
    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete audit log" }, { status: 500 });
  }
}
