import { NextResponse, type NextRequest } from "next/server";
import { withDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import AuditLog from "@/models/AuditLog";
import { createAuditSchema } from "@/lib/validations";
import { AUDIT_STATUSES } from "@/lib/constants";

export const GET = withDB(async () => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const logs = await AuditLog.find().sort({ date: -1 }).lean();
  return NextResponse.json(logs);
});

export const POST = withDB(async (request: NextRequest) => {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const parsed = createAuditSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const log = await AuditLog.create({
    date: parsed.data.date || new Date(),
    sessionCode: parsed.data.sessionCode || undefined,
    section: parsed.data.section || undefined,
    topicsCovered: parsed.data.topicsCovered || [],
    mcqsUsed: parsed.data.mcqsUsed || 0,
    studentCount: parsed.data.studentCount || 0,
    averageScore: parsed.data.averageScore,
    highestScore: parsed.data.highestScore,
    lowestScore: parsed.data.lowestScore,
    duration: parsed.data.duration,
    notes: parsed.data.notes || undefined,
    status: parsed.data.status || AUDIT_STATUSES[1], // completed
  });

  return NextResponse.json(log, { status: 201 });
});
