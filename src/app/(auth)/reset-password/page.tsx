import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthView";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token ?? "";
  return (
    <main id="main">
      <AuthShell>
        <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: 48, lineHeight: 1, letterSpacing: "-.03em" }}>Choose a new <span style={{ fontStyle: "italic", color: "#9A5B40" }}>password</span></h1>
        {token.length >= 20 ? <ResetPasswordForm token={token} /> : (
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>This link is incomplete. <Link href="/login" style={{ textDecoration: "underline" }}>Request a new reset link</Link>.</p>
        )}
      </AuthShell>
    </main>
  );
}
