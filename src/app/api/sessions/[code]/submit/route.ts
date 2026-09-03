import { NextResponse, type NextRequest } from "next/server";
import { withDB } from "@/lib/db";
import Session from "@/models/Session";
import SessionResult from "@/models/SessionResult";
import { sessionSubmitSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { SESSION_SUBMIT_MAX_ATTEMPTS, SESSION_SUBMIT_RATE_WINDOW_MS } from "@/lib/constants";
import { gradeAnswers, createSessionResult, updateSessionStats, updateAuditLog } from "@/services/session-service";

export const POST = withDB(async (request: NextRequest, context) => {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`submit:${ip}`, SESSION_SUBMIT_MAX_ATTEMPTS, SESSION_SUBMIT_RATE_WINDOW_MS);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submit attempts. Try again later." },
      { status: 429 }
    );
  }

  const { code } = await context?.params ?? {};
  const session = await Session.findOne({ code: code?.toUpperCase() });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!session.isActive) {
    return NextResponse.json(
      { error: "This session is no longer active" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = sessionSubmitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { studentCode, name, answers, timeTaken } = parsed.data;

  const existing = await SessionResult.findOne({
    sessionId: session._id,
    studentCode,
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already submitted answers for this session" },
      { status: 409 }
    );
  }

  const { totalScore, totalPossible, percentage, gradedAnswers } = await gradeAnswers(
    answers,
    session.timeLimit,
    timeTaken
  );

  const result = await createSessionResult({
    sessionId: session._id,
    studentCode,
    name,
    gradedAnswers,
    totalScore,
    totalPossible,
    percentage,
    timeTaken,
  });

  const stats = await updateSessionStats(session._id);
  await updateAuditLog(code.toUpperCase(), stats);

  return NextResponse.json({
    resultId: result._id,
    totalScore,
    totalPossible,
    percentage,
  });
});
