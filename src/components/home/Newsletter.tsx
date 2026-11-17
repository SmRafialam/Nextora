"use client";
import { useState } from "react";
import { IconCheck } from "@/components/icons";

// Phase 8 connects this to a server action + NewsletterSubscriber table. Until then it validates only.
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(false);
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) setDone(true);
    else setErr(true);
  };
  return (
    <section style={{ background: "#5E6A5B", color: "#F8F5EF" }}>
      <div className="nx-wrap nx-split" style={{ paddingTop: 104, paddingBottom: 104 }}>
        <div className="nx-reveal" style={{ gridColumn: "1 / span 6" }}>
          <h2 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1, letterSpacing: "-.025em" }}>Letters from <span style={{ fontStyle: "italic" }}>home.</span></h2>
          <p style={{ margin: "20px 0 0", maxWidth: 440, fontSize: 16, lineHeight: 1.7, color: "#E3E7E1" }}>Styling notes, new collections and early access — once a month, never more.</p>
        </div>
        <div className="nx-reveal" style={{ gridColumn: "8 / span 5" }}>
          {done ? (
            <div className="nx-pop" role="status" style={{ display: "flex", alignItems: "center", gap: 16, minHeight: 56 }}>
              <span style={{ width: 44, height: 44, borderRadius: 99, background: "#F8F5EF", color: "#5E6A5B", display: "flex", alignItems: "center", justifyContent: "center" }}><IconCheck size={20} /></span>
              <span className="nx-f" style={{ fontSize: 22 }}>Welcome home. Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <label htmlFor="nx-email" className="nx-sr">Email address</label>
                <input id="nx-email" className="nx-input" type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(e) => { setEmail(e.target.value); setErr(false); }} aria-invalid={err} aria-describedby="nx-email-hint" />
                <button className="nx-btn nx-light" type="submit">Subscribe</button>
              </div>
              <p id="nx-email-hint" style={{ margin: "14px 0 0", fontSize: 12.5, color: "#DCE1DA" }}>{err ? "Please enter a valid email address." : "Unsubscribe anytime. We respect your inbox."}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
