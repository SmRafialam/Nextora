"use server";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/server/db";
import { clientIp, rateLimit } from "@/server/rateLimit";
import { emailConfigured, sendMail } from "@/server/mailer";
import { consumeToken, issueToken } from "@/server/tokens";
import { fieldErrors, loginSchema, registerSchema, resetRequestSchema, resetSchema } from "@/lib/validation";

export type AuthState = { ok?: boolean; message?: string; errors?: Record<string, string> } | undefined;

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const safeNext = (n: unknown) => (typeof n === "string" && n.startsWith("/") && !n.startsWith("//") ? n : "/account");
const tooMany = (s: number): AuthState => ({ message: `Too many attempts. Please wait ${Math.ceil(s / 60)} minute${s > 60 ? "s" : ""} and try again.` });

async function sendVerification(userId: string, email: string) {
  const token = await issueToken(userId, "VERIFY_EMAIL");
  return sendMail(email, "Confirm your Nestora email", `Welcome to Nestora.\n\nConfirm your email address:\n${site()}/verify-email?token=${token}\n\nThis link expires in 24 hours.`);
}

export async function registerAction(_: AuthState, fd: FormData): Promise<AuthState> {
  const ip = await clientIp();
  const rl = rateLimit(`register:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) return tooMany(rl.retryAfter);
  const parsed = registerSchema.safeParse({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password"), news: fd.get("news") === "on" });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const { name, email, password, news } = parsed.data;

  const exists = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) return { errors: { email: "An account with this email already exists. Try signing in." } };
  const user = await db.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12), marketingOptIn: news } });
  if (news) await db.newsletterSubscriber.upsert({ where: { email }, create: { email }, update: { unsubscribed: false } });
  await sendVerification(user.id, email);

  try {
    await signIn("credentials", { email, password, redirectTo: safeNext(fd.get("next")) });
  } catch (e) {
    if (e instanceof AuthError) return { message: "Your account was created, but we couldn't sign you in. Please sign in." };
    throw e; // the redirect after a successful sign-in
  }
}

export async function loginAction(_: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const ip = await clientIp();
  const rl = rateLimit(`login:${ip}:${parsed.data.email}`, 8, 15 * 60_000);
  if (!rl.ok) return tooMany(rl.retryAfter);
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: safeNext(fd.get("next")) });
  } catch (e) {
    if (e instanceof AuthError) return { message: "That email and password don't match. Please try again." };
    throw e;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function requestResetAction(_: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = resetRequestSchema.safeParse({ email: fd.get("email") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const ip = await clientIp();
  const rl = rateLimit(`reset:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) return tooMany(rl.retryAfter);
  if (process.env.NODE_ENV === "production" && !emailConfigured()) {
    return { message: "Password reset by email isn't available yet. Please contact us and we'll help you get back in." };
  }
  const user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } });
  if (user) {
    const token = await issueToken(user.id, "RESET_PASSWORD");
    await sendMail(parsed.data.email, "Reset your Nestora password", `Choose a new password here:\n${site()}/reset-password?token=${token}\n\nThis link expires in 1 hour. If you didn't ask for this, you can ignore this email.`);
  }
  // Same answer whether or not the account exists.
  return { ok: true };
}

export async function resetPasswordAction(_: AuthState, fd: FormData): Promise<AuthState> {
  const parsed = resetSchema.safeParse({ token: fd.get("token"), password: fd.get("password") });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const ip = await clientIp();
  const rl = rateLimit(`reset-confirm:${ip}`, 10, 15 * 60_000);
  if (!rl.ok) return tooMany(rl.retryAfter);
  const userId = await consumeToken(parsed.data.token, "RESET_PASSWORD");
  if (!userId) return { message: "This reset link is invalid or has expired. Please request a new one." };
  await db.user.update({
    where: { id: userId },
    // Bumping sessionVersion signs out every other session; the link also proves the email.
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 12), sessionVersion: { increment: 1 }, emailVerified: new Date() },
  });
  await db.auditLog.create({ data: { actor: userId, action: "user.password_reset", target: `user:${userId}` } });
  return { ok: true };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature required by useActionState
export async function resendVerificationAction(_prev?: AuthState): Promise<AuthState> {
  const s = await auth();
  if (!s?.user?.id) return { message: "Please sign in first." };
  const rl = rateLimit(`verify:${s.user.id}`, 3, 60 * 60_000);
  if (!rl.ok) return tooMany(rl.retryAfter);
  const u = await db.user.findUnique({ where: { id: s.user.id }, select: { email: true, emailVerified: true } });
  if (!u || u.emailVerified) return { ok: true };
  const r = await sendVerification(s.user.id, u.email);
  return { ok: true, message: r.sent ? "We've sent a new confirmation link." : "Email isn't configured yet, so no message was sent." };
}
