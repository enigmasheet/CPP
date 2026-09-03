import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session, { ISessionItem } from "@/models/Session";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { SESSION_JOIN_MAX_ATTEMPTS, SESSION_JOIN_RATE_WINDOW_MS, SESSION_CODE_LENGTH } from "@/lib/constants";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`join:${ip}`, SESSION_JOIN_MAX_ATTEMPTS, SESSION_JOIN_RATE_WINDOW_MS);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many join attempts. Try again later." },
        { status: 429 }
      );
    }

    await connectDB();
    const { code } = await params;
    const session = await Session.findOne({ code: code.toUpperCase() });

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
    const name = body?.name || undefined;

    const studentCode = Math.random().toString(36).substring(2, SESSION_CODE_LENGTH + 2).toUpperCase();

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
  } catch {
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 });
  }
}
