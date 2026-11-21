"use client";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useShop } from "@/store/shop";
import { DISTRICTS } from "@/lib/bd";
import { addAddressAction, deleteAddressAction, setDefaultAddressAction } from "@/app/(store)/account/actions";
import { Submit } from "@/components/auth/AuthView";

export type AddressView = { id: string; label: string; name: string; phone: string; line: string; area: string; district: string; isDefault: boolean };
const textBtn = { border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40, padding: 0 } as const;

export function AddressBook({ list, defaults }: { list: AddressView[]; defaults: { name: string; phone: string } }) {
  const say = useShop((s) => s.say);
  const [adding, setAdding] = useState(list.length === 0);
  const [state, act] = useActionState(addAddressAction, undefined);
  const [pending, start] = useTransition();
  const e = state?.errors ?? {};

  useEffect(() => {
    if (state?.ok) { setAdding(false); say("Address saved"); }
  }, [state, say]);

  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 14, opacity: pending ? 0.6 : 1 }}>
      <h2 className="nx-sr">Saved addresses</h2>
      {list.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: 14 }}>
          {list.map((a) => (
            <div key={a.id} className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 8, boxShadow: a.isDefault ? "inset 0 0 0 1px #222321" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 15, fontWeight: 600 }}>{a.label}</span>{a.isDefault && <span style={{ padding: "5px 10px", borderRadius: 99, background: "#EFE9DF", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>Default</span>}</div>
              <span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>{a.name} · {a.phone}<br />{a.line}, {a.area}, {a.district}</span>
              <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                {!a.isDefault && <button style={textBtn} disabled={pending} onClick={() => start(async () => { await setDefaultAddressAction(a.id); say("Default address updated"); })}>Set as default</button>}
                <button style={{ ...textBtn, color: "#5C5D59" }} disabled={pending} aria-label={`Remove ${a.label} address`} onClick={() => start(async () => { await deleteAddressAction(a.id); say("Address removed"); })}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {adding ? (
        <form className="nx-panel nx-pop" action={act} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="nx-two">
            <div className="nx-field"><label htmlFor="ad-label">Label</label><input id="ad-label" name="label" placeholder="Home, Office…" maxLength={30} /></div>
            <div className="nx-field"><label htmlFor="ad-name">Recipient name</label><input id="ad-name" name="name" autoComplete="name" defaultValue={defaults.name} required maxLength={80} aria-invalid={!!e.name} />{e.name && <span className="err">{e.name}</span>}</div>
          </div>
          <div className="nx-field"><label htmlFor="ad-phone">Mobile number</label><input id="ad-phone" name="phone" type="tel" autoComplete="tel" inputMode="numeric" placeholder="01XXXXXXXXX" defaultValue={defaults.phone} required aria-invalid={!!e.phone} />{e.phone && <span className="err">{e.phone}</span>}</div>
          <div className="nx-field"><label htmlFor="ad-line">Street address</label><input id="ad-line" name="line" autoComplete="street-address" placeholder="House, road, block" required maxLength={200} aria-invalid={!!e.line} />{e.line && <span className="err">{e.line}</span>}</div>
          <div className="nx-two">
            <div className="nx-field"><label htmlFor="ad-area">Area</label><input id="ad-area" name="area" placeholder="e.g. Gulshan, Dhanmondi" required maxLength={80} aria-invalid={!!e.area} />{e.area && <span className="err">{e.area}</span>}</div>
            <div className="nx-field"><label htmlFor="ad-district">District</label><select id="ad-district" name="district" defaultValue="Dhaka" aria-invalid={!!e.district}>{DISTRICTS.map((d) => <option key={d}>{d}</option>)}</select>{e.district && <span className="err">{e.district}</span>}</div>
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13.5, cursor: "pointer" }}><input type="checkbox" name="isDefault" style={{ width: 18, height: 18, accentColor: "#222321" }} />Make this my default address</label>
          {state?.message && !state.ok && <span role="alert" className="err" style={{ fontSize: 13, color: "#9A3B2A" }}>{state.message}</span>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Submit style={{ width: "auto" }}>Save address</Submit>{list.length > 0 && <button className="nx-btn nx-ghost" type="button" onClick={() => setAdding(false)}>Cancel</button>}</div>
        </form>
      ) : (
        <button className="nx-btn nx-ghost" onClick={() => setAdding(true)} style={{ alignSelf: "flex-start" }}>+ Add a new address</button>
      )}
    </div>
  );
}
