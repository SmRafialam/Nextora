import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthView";
import { db } from "@/server/db";
import { consumeToken } from "@/server/tokens";

export const metadata: Metadata = { title: "Confirm your email", robots: { index: false } };

// Confirmation needs a button press (POST), so email link scanners that pre-open links can't use up the token.
async function confirm(fd: FormData) {
  "use server";
  const userId = await consumeToken(String(fd.get("token") ?? ""), "VERIFY_EMAIL");
  if (userId) await db.user.update({ where: { id: userId }, data: { emailVerified: new Date() } });
  redirect(`/verify-email?done=${userId ? 1 : 0}`);
}

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; done?: string }> }) {
  const { token, done } = await searchParams;
  return (
    <main id="main">
      <AuthShell>
        <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: 48, lineHeight: 1, letterSpacing: "-.03em" }}>Confirm your <span style={{ fontStyle: "italic", color: "#9A5B40" }}>email</span></h1>
        {done === "1" && <><p role="status" style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>Thank you — your email is confirmed.</p><Link className="nx-btn" href="/account">Go to my account</Link></>}
        {done === "0" && <p role="alert" style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>This link is invalid or has expired. You can send a new one from <Link href="/account" style={{ textDecoration: "underline" }}>your account</Link>.</p>}
        {!done && token && (
          <form action={confirm} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input type="hidden" name="token" value={token} />
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>Press the button to confirm this email address for your Nestora account.</p>
            <button className="nx-btn" type="submit">Confirm my email</button>
          </form>
        )}
        {!done && !token && <p style={{ margin: 0, fontSize: 15 }}>This link is incomplete.</p>}
      </AuthShell>
    </main>
  );
}
