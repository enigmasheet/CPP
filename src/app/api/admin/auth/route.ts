import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`login:${ip}`, 5, 60000);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again in 1 minute." },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
    }

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await setAdminCookie(password);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
