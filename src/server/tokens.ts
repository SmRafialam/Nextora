import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { AuthTokenType } from "@prisma/client";
import { db } from "./db";

const hash = (t: string) => createHash("sha256").update(t).digest("hex");
const TTL: Record<AuthTokenType, number> = { RESET_PASSWORD: 60 * 60 * 1000, VERIFY_EMAIL: 24 * 60 * 60 * 1000 };

/** Creates a one-time token (only its hash is stored) and invalidates older ones of the same type. */
export async function issueToken(userId: string, type: AuthTokenType) {
  const token = randomBytes(32).toString("base64url");
  await db.$transaction([
    db.authToken.deleteMany({ where: { userId, type, usedAt: null } }),
    db.authToken.create({ data: { userId, type, tokenHash: hash(token), expiresAt: new Date(Date.now() + TTL[type]) } }),
  ]);
  return token;
}

/** Marks a valid token used and returns its user id, or null if missing, used or expired. */
export async function consumeToken(token: string, type: AuthTokenType) {
  const row = await db.authToken.findUnique({ where: { tokenHash: hash(token) } });
  if (!row || row.type !== type || row.usedAt || row.expiresAt < new Date()) return null;
  const { count } = await db.authToken.updateMany({ where: { id: row.id, usedAt: null }, data: { usedAt: new Date() } });
  return count === 1 ? row.userId : null; // updateMany guards against a double submit
}
