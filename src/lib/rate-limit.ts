import { TIMER_INTERVAL_MS } from "./constants";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    const resetIn = Math.ceil((entry.resetTime - now) / TIMER_INTERVAL_MS);
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: Math.ceil((entry.resetTime - now) / TIMER_INTERVAL_MS) };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
