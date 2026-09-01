import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import Session from "@/models/Session";
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
    const { title, type, items, maxAttempts } = body;

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
      maxAttempts,
    });

    return NextResponse.json(session, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
