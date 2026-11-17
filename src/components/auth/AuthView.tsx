"use client";
import Link from "next/link";
import { useState } from "react";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowLeft } from "@/components/icons";

type Mode = "in" | "up" | "reset";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRENGTH = ["Weak — add more characters", "Fair — mix in numbers or symbols", "Good password", "Strong password"];

export function passwordScore(p: string) {
  return (p.length >= 8 ? 1 : 0) + (/[A-Z]/.test(p) && /[a-z]/.test(p) ? 1 : 0) + (/\d|[^\w]/.test(p) ? 1 : 0);
}

// Accounts are switched on in Phase 5 (Auth.js + database). Until then the forms validate
// but submit nothing, and say so.
export function AuthView({ initial }: { initial: "in" | "up" }) {
  const [mode, setMode] = useState<Mode>(initial);
  const [show, setShow] = useState(false);
  const [tried, setTried] = useState(false);
  const [notice, setNotice] = useState(false);
  const [v, setV] = useState({ name: "", email: "", pass: "", news: true });
  const reg = mode === "up";

  const errors: Partial<Record<"name" | "email" | "pass", string>> = {};
  if (reg && v.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(v.email.trim())) errors.email = "Please enter a valid email.";
  if (mode !== "reset" && v.pass.length < (reg ? 8 : 1)) errors.pass = reg ? "Use at least 8 characters." : "Please enter your password.";
  const e = tried ? errors : {};
  const score = passwordScore(v.pass);

  const go = (m: Mode) => {
    setMode(m); setTried(false); setNotice(false);
    if (m !== "reset") window.history.replaceState(null, "", m === "up" ? "/register" : "/login");
  };
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTried(true);
    if (Object.keys(errors).length) { document.getElementById(`a-${Object.keys(errors)[0]}`)?.focus(); return; }
    setNotice(true);
  };
  const set = (k: "name" | "email" | "pass") => (ev: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: ev.target.value });
  const link = { border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40, padding: 0 } as const;
  const notOn = (
    <p role="status" className="nx-pop" style={{ margin: 0, padding: 16, borderRadius: 6, background: "#EFE9DF", fontSize: 13.5, lineHeight: 1.6 }}>
      Accounts aren&apos;t switched on yet. Sign-in, registration and password reset arrive in the next phases, so nothing was sent and your password was not stored.
    </p>
  );

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

          {mode === "reset" ? (
            <form className="nx-pop" noValidate onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: 48, lineHeight: 1, letterSpacing: "-.03em" }}>Reset your <span style={{ fontStyle: "italic", color: "#9A5B40" }}>password</span></h1>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>Enter your email and we will send you a link to choose a new password.</p>
              <div className="nx-field"><label htmlFor="a-email">Email</label><input id="a-email" type="email" autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={!!e.email} />{e.email && <span className="err">{e.email}</span>}</div>
              <button className="nx-btn" type="submit">Send reset link</button>
              {notice && notOn}
              <button type="button" onClick={() => go("in")} style={{ ...link, alignSelf: "flex-start" }}>Back to sign in</button>
            </form>
          ) : (<>
            <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(42px, 4vw, 56px)", lineHeight: 1, letterSpacing: "-.03em" }}>{reg ? "Make yourself" : "Welcome"} <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{reg ? "at home" : "back"}</span></h1>
            <div role="tablist" aria-label="Account access" style={{ display: "flex" }}>
              <button className="nx-tab" role="tab" aria-selected={!reg} onClick={() => go("in")}>Sign in</button>
              <button className="nx-tab" role="tab" aria-selected={reg} onClick={() => go("up")}>Create account</button>
            </div>
            <form key={mode} className="nx-pop" noValidate onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reg && <div className="nx-field"><label htmlFor="a-name">Full name</label><input id="a-name" autoComplete="name" value={v.name} onChange={set("name")} aria-invalid={!!e.name} />{e.name && <span className="err">{e.name}</span>}</div>}
              <div className="nx-field"><label htmlFor="a-email">Email</label><input id="a-email" type="email" autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={!!e.email} />{e.email && <span className="err">{e.email}</span>}</div>
              <div className="nx-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="a-pass">Password</label>
                  {!reg && <button type="button" onClick={() => go("reset")} style={{ ...link, fontSize: 12.5, color: "#5C5D59", minHeight: 0, padding: "4px 0" }}>Forgot password?</button>}
                </div>
                <div style={{ position: "relative" }}>
                  <input id="a-pass" type={show ? "text" : "password"} autoComplete={reg ? "new-password" : "current-password"} value={v.pass} onChange={set("pass")} aria-invalid={!!e.pass} style={{ paddingRight: 64 }} />
                  <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} style={{ position: "absolute", right: 4, top: 4, height: 44, padding: "0 12px", border: 0, background: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600 }}>{show ? "Hide" : "Show"}</button>
                </div>
                {reg && <span style={{ fontSize: 12, color: score >= 2 ? "#5E6A5B" : "#5C5D59" }}>{v.pass ? STRENGTH[score] : "At least 8 characters, with a number or symbol"}</span>}
                {e.pass && <span className="err">{e.pass}</span>}
              </div>
              {reg && (
                <label style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5, cursor: "pointer" }}>
                  <input type="checkbox" checked={v.news} onChange={() => setV({ ...v, news: !v.news })} style={{ width: 20, height: 20, margin: 0, accentColor: "#222321", flex: "none" }} />
                  Send me Letters from Home — styling notes and early access.
                </label>
              )}
              <button className="nx-btn" type="submit" style={{ width: "100%", marginTop: 4 }}>{reg ? "Create account" : "Sign in"}</button>
              {notice && notOn}
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#5C5D59" }}><span style={{ flex: 1, height: 1, background: "rgba(34,35,33,.15)" }} />or<span style={{ flex: 1, height: 1, background: "rgba(34,35,33,.15)" }} /></div>
            <Link className="nx-btn nx-ghost" href="/checkout" style={{ width: "100%" }}>Continue as guest</Link>
          </>)}
        </div>
      </div>
    </div>
  );
}
