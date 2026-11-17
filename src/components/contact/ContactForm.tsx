"use client";
import { useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { TOPICS, type Topic } from "./topics";


const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The message service (email delivery + spam protection) is connected in a later phase.
// Until then the form validates and says plainly that nothing was sent.
export function ContactForm({ initialTopic }: { initialTopic: Topic }) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const [v, setV] = useState({ name: "", email: "", order: "", day: "Saturday", time: "Afternoon (2–5)", msg: "" });

  const errors: Partial<Record<"name" | "email" | "msg", string>> = {};
  if (v.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL.test(v.email.trim())) errors.email = "Please enter a valid email.";
  if (v.msg.trim().length < 10) errors.msg = "A few more words, please (at least 10 characters).";
  const e = tried ? errors : {};
  const on = (k: keyof typeof v) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV({ ...v, [k]: ev.target.value.slice(0, k === "msg" ? 800 : 120) });
  const label = TOPICS.find((t) => t[0] === topic)![1].toLowerCase();

  const send = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTried(true);
    const first = Object.keys(errors)[0];
    if (first) { document.getElementById(`c-${first}`)?.focus(); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="nx-pop" role="status" style={{ minHeight: 420, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 18 }}>
        <span style={{ width: 64, height: 64, borderRadius: 99, background: "#5E6A5B", color: "#F8F5EF", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg></span>
        <h2 className="nx-f" style={{ margin: 0, fontSize: 40, fontWeight: 300, letterSpacing: "-.02em" }}>Thank you, {v.name.trim().split(" ")[0]}.</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F", maxWidth: 440 }}>Your message about <strong>{label}</strong> is ready. Message sending isn&apos;t switched on yet, so it has not been delivered — please contact us by phone or email for now.</p>
        <button className="nx-btn nx-ghost" onClick={() => { setSent(false); setTried(false); setV({ ...v, msg: "", order: "" }); }}>Write another message</button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={send} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span id="c-topic" style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".06em", color: "#45463F" }}>How can we help?</span>
        <div role="group" aria-labelledby="c-topic" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TOPICS.map(([id, l]) => <button key={id} type="button" className="nx-pill" aria-pressed={topic === id} onClick={() => setTopic(id)}>{l}</button>)}
        </div>
      </div>
      <div className="nx-two">
        <div className="nx-field"><label htmlFor="c-name">Name</label><input id="c-name" autoComplete="name" value={v.name} onChange={on("name")} aria-invalid={!!e.name} />{e.name && <span className="err">{e.name}</span>}</div>
        <div className="nx-field"><label htmlFor="c-email">Email</label><input id="c-email" type="email" autoComplete="email" value={v.email} onChange={on("email")} aria-invalid={!!e.email} />{e.email && <span className="err">{e.email}</span>}</div>
      </div>
      {topic === "order" && <div className="nx-field nx-pop"><label htmlFor="c-order">Order number</label><input id="c-order" placeholder="NS-000000" value={v.order} onChange={on("order")} /></div>}
      {topic === "visit" && (
        <div className="nx-two nx-pop">
          <div className="nx-field"><label htmlFor="c-day">Preferred day</label><select id="c-day" value={v.day} onChange={on("day")}>{["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].map((d) => <option key={d}>{d}</option>)}</select></div>
          <div className="nx-field"><label htmlFor="c-time">Preferred time</label><select id="c-time" value={v.time} onChange={on("time")}>{["Morning (11–1)", "Afternoon (2–5)", "Evening (5–8)"].map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
      )}
      <div className="nx-field">
        <label htmlFor="c-msg">Message</label>
        <textarea id="c-msg" rows={6} value={v.msg} onChange={on("msg")} aria-invalid={!!e.msg} placeholder={topic === "styling" ? "Tell us about your room — size, light, what you love…" : "How can we help?"} style={{ minHeight: 160 }} />
        <span style={{ fontSize: 12, color: "#5C5D59", alignSelf: "flex-end" }}>{v.msg.length} / 800</span>
        {e.msg && <span className="err">{e.msg}</span>}
      </div>
      <button className="nx-btn" type="submit" style={{ alignSelf: "flex-start" }}>Send message <IconArrowRight /></button>
    </form>
  );
}
