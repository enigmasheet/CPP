import { cookies } from "next/headers";
import { ADMIN_TOKEN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE_SECONDS } from "./constants";

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_TOKEN_COOKIE_NAME);
  if (!adminToken) return false;

  const expectedPassword = process.env.ADMIN_PASSWORD;
  try {
    const decoded = Buffer.from(adminToken.value, "base64").toString("utf-8");
    return decoded === expectedPassword;
  } catch {
    return false;
  }
}

export async function setAdminCookie(password: string): Promise<void> {
  const cookieStore = await cookies();
  const token = Buffer.from(password).toString("base64");
  cookieStore.set(ADMIN_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}
