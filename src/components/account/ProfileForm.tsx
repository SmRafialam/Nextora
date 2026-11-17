"use client";
import { useState } from "react";
import { useShop } from "@/store/shop";
import { SAMPLE_USER } from "@/lib/sampleAccount";

const PREFS = [
  { id: "news", label: "Letters from Home", note: "Monthly styling notes and new collections" },
  { id: "sms", label: "Delivery updates by SMS", note: "Know exactly when your order arrives" },
  { id: "restock", label: "Back-in-stock alerts", note: "For pieces saved to your wishlist" },
] as const;

export function ProfileForm() {
  const say = useShop((s) => s.say);
  const [p, setP] = useState({ name: SAMPLE_USER.name, phone: SAMPLE_USER.phone, email: SAMPLE_USER.email });
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ news: true, sms: true, restock: false });
  const set = (k: keyof typeof p) => (e: React.ChangeEvent<HTMLInputElement>) => setP({ ...p, [k]: e.target.value });

  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <form className="nx-panel" onSubmit={(e) => { e.preventDefault(); say("Preview only — saving arrives with accounts"); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 className="nx-f" style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>Personal details</h2>
        <div className="nx-two">
          <div className="nx-field"><label htmlFor="p-name">Full name</label><input id="p-name" autoComplete="name" value={p.name} onChange={set("name")} /></div>
          <div className="nx-field"><label htmlFor="p-phone">Mobile</label><input id="p-phone" type="tel" autoComplete="tel" value={p.phone} onChange={set("phone")} /></div>
        </div>
        <div className="nx-field"><label htmlFor="p-email">Email</label><input id="p-email" type="email" autoComplete="email" value={p.email} onChange={set("email")} /></div>
        <button className="nx-btn" type="submit" style={{ alignSelf: "flex-start" }}>Save changes</button>
      </form>
      <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h2 className="nx-f" style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 400 }}>Communication</h2>
        {PREFS.map((x) => (
          <div key={x.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "14px 0", borderTop: "1px solid rgba(34,35,33,.08)" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 3 }}><span style={{ fontSize: 14.5, fontWeight: 600 }}>{x.label}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{x.note}</span></span>
            <button className="nx-toggle" role="switch" aria-checked={prefs[x.id]} aria-label={x.label} onClick={() => setPrefs({ ...prefs, [x.id]: !prefs[x.id] })} style={{ background: prefs[x.id] ? "#5E6A5B" : "rgba(34,35,33,.2)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
