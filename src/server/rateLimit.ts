import "server-only";
import { headers } from "next/headers";

// Fixed-window limiter kept in this server process's memory. Enough for one server;
// a multi-instance production deploy should swap this for Redis/Upstash (Phase 10).
const hits = new Map<string, { n: number; reset: number }>();

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 10_000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(key);
  if (!h || h.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  h.n += 1;
  return h.n > max ? { ok: false, retryAfter: Math.ceil((h.reset - now) / 1000) } : { ok: true, retryAfter: 0 };
}

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}
