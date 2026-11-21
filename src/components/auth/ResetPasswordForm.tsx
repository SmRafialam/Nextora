"use client";
import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction } from "@/app/(auth)/actions";
import { FormMessage, PasswordField, Submit } from "./AuthView";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, act] = useActionState(resetPasswordAction, undefined);
  if (state?.ok) {
    return (
      <div role="status" className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>Your password has been changed and any other signed-in devices have been signed out.</p>
        <Link className="nx-btn" href="/login" style={{ width: "100%" }}>Sign in</Link>
      </div>
    );
  }
  return (
    <form action={act} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input type="hidden" name="token" value={token} />
      <PasswordField id="r-pass" label="New password" autoComplete="new-password" error={state?.errors?.password} strength />
      <Submit>Save new password</Submit>
      <FormMessage state={state} />
    </form>
  );
}
