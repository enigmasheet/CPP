import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import AuditLog from "@/models/AuditLog";

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const logs = await AuditLog.find().sort({ date: -1 }).lean();
    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const log = await AuditLog.create({
      date: body.date || new Date(),
      sessionCode: body.sessionCode || undefined,
      section: body.section || undefined,
      topicsCovered: body.topicsCovered || [],
      mcqsUsed: body.mcqsUsed || 0,
      studentCount: body.studentCount || 0,
      averageScore: body.averageScore,
      highestScore: body.highestScore,
      lowestScore: body.lowestScore,
      duration: body.duration,
      notes: body.notes || undefined,
      status: body.status || "completed",
    });

    return NextResponse.json(log, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 });
  }
}
