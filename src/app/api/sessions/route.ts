import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import Session from "@/models/Session";
import AuditLog from "@/models/AuditLog";
import MCQ from "@/models/MCQ";
import { generateSessionCode } from "@/lib/session-code";

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const sessions = await Session.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
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
    const { title, type, items, section, maxAttempts, timeLimit } = body;

    if (!title || !type || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Title, type, and at least one item are required" },
        { status: 400 }
      );
    }

    let code = generateSessionCode();
    let existing = await Session.findOne({ code });
    while (existing) {
      code = generateSessionCode();
      existing = await Session.findOne({ code });
    }

    const session = await Session.create({
      code,
      title,
      type,
      items,
      section,
      maxAttempts,
      timeLimit,
    });

    const mcqIds = items
      .filter((item: { contentType: string }) => item.contentType === "mcq")
      .map((item: { contentId: string }) => item.contentId);

    let topicsCovered: string[] = [];
    if (mcqIds.length > 0) {
      const mcqs = await MCQ.find({ _id: { $in: mcqIds } }).select("topic").lean();
      topicsCovered = [...new Set(mcqs.map((m: { topic: string }) => m.topic))];
    }

    await AuditLog.create({
      date: new Date(),
      sessionCode: code,
      section: section || undefined,
      topicsCovered,
      mcqsUsed: mcqIds.length,
      studentCount: 0,
      status: "planned",
      notes: `Auto-logged on session creation: ${title}`,
    });

    return NextResponse.json(session, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
