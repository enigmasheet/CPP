import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";
import AuditLog from "@/models/AuditLog";
import MCQ from "@/models/MCQ";
import { generateSessionCode } from "@/lib/session-code";

export const GET = withDB(async () => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const sessions = await Session.find()
    .sort({ createdAt: -1 })
    .lean();

  const sessionsWithStats = await Promise.all(
    sessions.map(async (session) => {
      const results = await SessionResult.find({ sessionCode: session.code })
        .select("score")
        .lean();
      const submissions = results.length;
      const avgScore =
        submissions > 0
          ? Math.round(
              results.reduce((sum, r) => sum + (r.score || 0), 0) / submissions
            )
          : null;
      return { ...session, submissions, avgScore };
    })
  );

  return NextResponse.json(sessionsWithStats);
});

export const POST = withDB(async (request) => {
  const authError = await requireAdmin();
  if (authError) return authError;

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
});
