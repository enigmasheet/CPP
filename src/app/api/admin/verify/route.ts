import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const isAuth = await verifyAdmin();
    return NextResponse.json({ authenticated: isAuth });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
