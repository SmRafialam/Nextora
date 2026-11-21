"use client";
import { useActionState } from "react";
import { resendVerificationAction } from "@/app/(auth)/actions";

export function VerifyBanner({ email }: { email: string }) {
  const [state, act, pending] = useActionState(resendVerificationAction, undefined);
  return (
    <div role="note" style={{ padding: "14px 18px", borderRadius: 6, background: "#EFE9DF", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", fontSize: 14 }}>
      <span>Please confirm <strong>{email}</strong> using the link we sent.{state?.message ? ` ${state.message}` : ""}</span>
      <form action={act}><button type="submit" disabled={pending} style={{ border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40 }}>{pending ? "Sending…" : "Resend link"}</button></form>
    </div>
  );
}
