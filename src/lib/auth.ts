import { cookies } from "next/headers";

export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-token");
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
  cookieStore.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}
