"use client";
import { useActionState, useEffect, useState } from "react";
import { useShop } from "@/store/shop";
import { updateProfileAction } from "@/app/(store)/account/actions";
import { Submit } from "@/components/auth/AuthView";

const PREFS = [
  { id: "marketingOptIn", label: "Letters from Home", note: "Monthly styling notes and new collections" },
  { id: "smsUpdates", label: "Delivery updates by SMS", note: "Know exactly when your order arrives" },
  { id: "restockAlerts", label: "Back-in-stock alerts", note: "For pieces saved to your wishlist" },
] as const;
type PrefId = (typeof PREFS)[number]["id"];

export function ProfileForm({ user }: { user: { name: string; phone: string; email: string; verified: boolean } & Record<PrefId, boolean> }) {
  const say = useShop((s) => s.say);
  const [state, act] = useActionState(updateProfileAction, undefined);
  const [prefs, setPrefs] = useState<Record<PrefId, boolean>>({ marketingOptIn: user.marketingOptIn, smsUpdates: user.smsUpdates, restockAlerts: user.restockAlerts });
  const e = state?.errors ?? {};
  useEffect(() => { if (state?.ok) say("Your details are saved"); }, [state, say]);

  return (
    <form action={act} className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 className="nx-f" style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>Personal details</h2>
        <div className="nx-two">
          <div className="nx-field"><label htmlFor="p-name">Full name</label><input id="p-name" name="name" autoComplete="name" defaultValue={user.name} required maxLength={80} aria-invalid={!!e.name} />{e.name && <span className="err">{e.name}</span>}</div>
          <div className="nx-field"><label htmlFor="p-phone">Mobile</label><input id="p-phone" name="phone" type="tel" autoComplete="tel" inputMode="numeric" placeholder="01XXXXXXXXX" defaultValue={user.phone} aria-invalid={!!e.phone} />{e.phone && <span className="err">{e.phone}</span>}</div>
        </div>
        <div className="nx-field">
          <label htmlFor="p-email">Email</label>
          <input id="p-email" type="email" value={user.email} readOnly aria-describedby="p-email-note" style={{ background: "#F8F5EF" }} />
          <span id="p-email-note" style={{ fontSize: 12, color: user.verified ? "#5E6A5B" : "#5C5D59" }}>{user.verified ? "Confirmed" : "Not confirmed yet"} · To change your sign-in email, contact us.</span>
        </div>
      </div>
      <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h2 className="nx-f" style={{ margin: "0 0 10px", fontSize: 26, fontWeight: 400 }}>Communication</h2>
        {PREFS.map((x) => (
          <div key={x.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "14px 0", borderTop: "1px solid rgba(34,35,33,.08)" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 3 }}><span style={{ fontSize: 14.5, fontWeight: 600 }}>{x.label}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{x.note}</span></span>
            {prefs[x.id] && <input type="hidden" name={x.id} value="on" />}
            <button type="button" className="nx-toggle" role="switch" aria-checked={prefs[x.id]} aria-label={x.label} onClick={() => setPrefs({ ...prefs, [x.id]: !prefs[x.id] })} style={{ background: prefs[x.id] ? "#5E6A5B" : "rgba(34,35,33,.2)" }} />
          </div>
        ))}
      </div>
      {state?.message && !state.ok && <span role="alert" style={{ fontSize: 13, color: "#9A3B2A" }}>{state.message}</span>}
      <Submit style={{ width: "auto", alignSelf: "flex-start" }}>Save changes</Submit>
    </form>
  );
}
