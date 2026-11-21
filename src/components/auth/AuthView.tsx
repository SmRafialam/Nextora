"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowLeft } from "@/components/icons";
import { loginAction, registerAction, requestResetAction, type AuthState } from "@/app/(auth)/actions";

type Mode = "in" | "up" | "reset";
const STRENGTH = ["Weak — add more characters", "Fair — mix in numbers or symbols", "Good password", "Strong password"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function passwordScore(p: string) {
  return (p.length >= 8 ? 1 : 0) + (/[A-Z]/.test(p) && /[a-z]/.test(p) ? 1 : 0) + (/\d|[^\w]/.test(p) ? 1 : 0);
}

/** Split-screen frame from the approved Login design, reused by reset and verify pages. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="nx-auth">
      <div className="nx-authart" style={{ position: "relative", overflow: "hidden", background: "#E9DFD0", minHeight: 900 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #EFE6D8 0%, #E3D5C2 72%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "26%", background: "#D3C1A8" }} />
        <div style={{ position: "absolute", left: "18%", right: "18%", top: "14%", height: "52%", borderRadius: "999px 999px 4px 4px", background: "#FFFDF8", boxShadow: "inset 0 0 0 12px #EFE5D5" }} />
        <div style={{ position: "absolute", left: "22%", right: "22%", bottom: "14%", height: "34%" }}><ProductArt kind="chair" fill="#C68C70" /></div>
        <div style={{ position: "absolute", left: "6%", width: "22%", bottom: "16%", height: "30%" }}><ProductArt kind="plant" fill="#F1ECE3" /></div>
        <Link href="/" aria-label="Nestora home" style={{ position: "absolute", left: 40, top: 36 }}><span className="nx-f" style={{ fontSize: 26, letterSpacing: ".32em" }}>NEST<span style={{ fontStyle: "italic", color: "#9A5B40" }}>O</span>RA</span></Link>
        <p className="nx-f nx-rise" style={{ position: "absolute", left: 40, right: 40, bottom: 40, margin: 0, fontSize: "clamp(26px, 2.6vw, 38px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.2 }}>A home is never finished.<br />Welcome back to yours.</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "56px clamp(16px, 5vw, 80px)" }}>
        <div className="nx-rise" style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>
          <Link href="/" style={{ fontSize: 13, color: "#5C5D59", display: "flex", alignItems: "center", gap: 8 }}><IconArrowLeft size={16} />Back to Nestora</Link>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Submit({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { pending } = useFormStatus();
  return <button className="nx-btn" type="submit" disabled={pending} aria-busy={pending} style={{ width: "100%", opacity: pending ? 0.7 : 1, ...style }}>{pending ? "Please wait…" : children}</button>;
}

export function FormMessage({ state }: { state: AuthState }) {
  if (!state?.message) return null;
  return <p role="alert" className="nx-pop" style={{ margin: 0, padding: 14, borderRadius: 6, background: state.ok ? "#E3E7E1" : "#F1E2D9", color: state.ok ? "#3F4A3D" : "#7A4430", fontSize: 13.5, lineHeight: 1.6 }}>{state.message}</p>;
}

export function PasswordField({ id, label, autoComplete, error, strength, extra }: { id: string; label: string; autoComplete: string; error?: string; strength?: boolean; extra?: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [v, setV] = useState("");
  const score = passwordScore(v);
  return (
    <div className="nx-field">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><label htmlFor={id}>{label}</label>{extra}</div>
      <div style={{ position: "relative" }}>
        <input id={id} name="password" type={show ? "text" : "password"} autoComplete={autoComplete} required minLength={strength ? 8 : 1} maxLength={128} value={v} onChange={(e) => setV(e.target.value)} aria-invalid={!!error} style={{ paddingRight: 64 }} />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} style={{ position: "absolute", right: 4, top: 4, height: 44, padding: "0 12px", border: 0, background: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>{show ? "Hide" : "Show"}</button>
      </div>
      {strength && <span style={{ fontSize: 12, color: score >= 2 ? "#5E6A5B" : "#5C5D59" }}>{v ? STRENGTH[score] : "At least 8 characters, with a number or symbol"}</span>}
      {error && <span className="err">{error}</span>}
    </div>
  );
}

const link = { border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40, padding: 0 } as const;

export function AuthView({ initial, next }: { initial: "in" | "up"; next?: string }) {
  const [mode, setMode] = useState<Mode>(initial);
  // Controlled so a failed submit (React resets uncontrolled form fields after an action) keeps what was typed.
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [inState, inAct] = useActionState(loginAction, undefined);
  const [upState, upAct] = useActionState(registerAction, undefined);
  const [rsState, rsAct] = useActionState(requestResetAction, undefined);
  const reg = mode === "up";
  const state = reg ? upState : inState;
  const e = state?.errors ?? {};

  const go = (m: Mode) => {
    setMode(m);
    if (m !== "reset") window.history.replaceState(null, "", (m === "up" ? "/register" : "/login") + (next ? `?next=${encodeURIComponent(next)}` : ""));
  };
  // Light client check so obvious mistakes don't need a round trip; the server re-validates everything.
  const precheck = (ev: React.FormEvent<HTMLFormElement>) => {
    const f = ev.currentTarget;
    if (!EMAIL.test(String(new FormData(f).get("email") ?? "").trim())) { ev.preventDefault(); (f.elements.namedItem("email") as HTMLInputElement)?.focus(); }
  };
  const emailField = (err?: string) => (
    <div className="nx-field"><label htmlFor="a-email">Email</label><input id="a-email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(ev) => setEmail(ev.target.value)} aria-invalid={!!err} />{err && <span className="err">{err}</span>}</div>
  );

  return (
    <AuthShell>
      {mode === "reset" ? (
        <form className="nx-pop" action={rsAct} onSubmit={precheck} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: 48, lineHeight: 1, letterSpacing: "-.03em" }}>Reset your <span style={{ fontStyle: "italic", color: "#9A5B40" }}>password</span></h1>
          {rsState?.ok ? (
            <p role="status" style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>If an account exists for <strong>{email}</strong>, a reset link is on its way. It expires in one hour.</p>
          ) : (<>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>Enter your email and we will send you a link to choose a new password.</p>
            {emailField(rsState?.errors?.email)}
            <Submit>Send reset link</Submit>
            <FormMessage state={rsState} />
          </>)}
          <button type="button" onClick={() => go("in")} style={{ ...link, alignSelf: "flex-start" }}>Back to sign in</button>
        </form>
      ) : (<>
        <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(42px, 4vw, 56px)", lineHeight: 1, letterSpacing: "-.03em" }}>{reg ? "Make yourself" : "Welcome"} <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{reg ? "at home" : "back"}</span></h1>
        <div role="tablist" aria-label="Account access" style={{ display: "flex" }}>
          <button className="nx-tab" role="tab" aria-selected={!reg} onClick={() => go("in")}>Sign in</button>
          <button className="nx-tab" role="tab" aria-selected={reg} onClick={() => go("up")}>Create account</button>
        </div>
        <form key={mode} className="nx-pop" action={reg ? upAct : inAct} onSubmit={precheck} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="hidden" name="next" value={next ?? ""} />
          {reg && <div className="nx-field"><label htmlFor="a-name">Full name</label><input id="a-name" name="name" autoComplete="name" required maxLength={80} value={fullName} onChange={(ev) => setFullName(ev.target.value)} aria-invalid={!!e.name} />{e.name && <span className="err">{e.name}</span>}</div>}
          {emailField(e.email)}
          <PasswordField id="a-pass" label="Password" autoComplete={reg ? "new-password" : "current-password"} error={e.password} strength={reg}
            extra={!reg && <button type="button" onClick={() => go("reset")} style={{ ...link, fontSize: 12.5, color: "#5C5D59", minHeight: 0, padding: "4px 0" }}>Forgot password?</button>} />
          {reg && (
            <label style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5, cursor: "pointer" }}>
              <input type="checkbox" name="news" defaultChecked style={{ width: 20, height: 20, margin: 0, accentColor: "#222321", flex: "none" }} />
              Send me Letters from Home — styling notes and early access.
            </label>
          )}
          <Submit style={{ marginTop: 4 }}>{reg ? "Create account" : "Sign in"}</Submit>
          <FormMessage state={state} />
        </form>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#5C5D59" }}><span style={{ flex: 1, height: 1, background: "rgba(34,35,33,.15)" }} />or<span style={{ flex: 1, height: 1, background: "rgba(34,35,33,.15)" }} /></div>
        <Link className="nx-btn nx-ghost" href="/checkout" style={{ width: "100%" }}>Continue as guest</Link>
        {reg && <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: "#5C5D59" }}>By creating an account you agree to our <Link href="/terms" style={{ textDecoration: "underline" }}>terms</Link> and <Link href="/privacy-policy" style={{ textDecoration: "underline" }}>privacy policy</Link>.</p>}
      </>)}
    </AuthShell>
  );
}
