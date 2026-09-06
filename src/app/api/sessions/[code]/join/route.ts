import { NextResponse } from "next/server";
import { withDB } from "@/lib/db";
import Session, { type ISessionItem } from "@/models/Session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { SESSION_JOIN_MAX_ATTEMPTS, SESSION_JOIN_RATE_WINDOW_MS, SESSION_CODE_LENGTH } from "@/lib/constants";
import { sessionJoinSchema } from "@/lib/validations";
import crypto from "crypto";

const STUDENT_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateStudentCode(): string {
  const bytes = crypto.randomBytes(SESSION_CODE_LENGTH);
  let code = "";
  for (let i = 0; i < SESSION_CODE_LENGTH; i++) {
    code += STUDENT_CODE_CHARSET[bytes[i] % STUDENT_CODE_CHARSET.length];
  }
  return code;
}

export const POST = withDB(async (request, context) => {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`join:${ip}`, SESSION_JOIN_MAX_ATTEMPTS, SESSION_JOIN_RATE_WINDOW_MS);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many join attempts. Try again later." },
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
  const parsed = sessionJoinSchema.safeParse(body);
  const name = parsed.success ? parsed.data.name || undefined : undefined;

  const studentCode = generateStudentCode();

  const items = session.items.map((item: ISessionItem) => ({
    contentType: item.contentType,
    contentId: item.contentId.toString(),
    gameType: item.gameType,
  }));

  return NextResponse.json({
    studentCode,
    name,
    sessionTitle: session.title,
    sessionType: session.type,
    items,
  });
});
