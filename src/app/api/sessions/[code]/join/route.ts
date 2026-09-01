import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Session, { ISessionItem } from "@/models/Session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
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

    await request.json();

    const studentCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const items = session.items.map((item: ISessionItem) => ({
      contentType: item.contentType,
      contentId: item.contentId.toString(),
      gameType: item.gameType,
    }));

    return NextResponse.json({
      studentCode,
      sessionTitle: session.title,
      sessionType: session.type,
      items,
    });
  } catch {
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 });
  }
}
