import { cookies } from "next/headers";
import { ADMIN_TOKEN_COOKIE_NAME, COOKIE_CLEAR_MAX_AGE } from "@/lib/constants";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_CLEAR_MAX_AGE,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
