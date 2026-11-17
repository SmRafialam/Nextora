"use client";
import { useState } from "react";
import { useShop } from "@/store/shop";
import { SAMPLE_ADDRESSES } from "@/lib/sampleAccount";

type Addr = (typeof SAMPLE_ADDRESSES)[number];
const textBtn = { border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40, padding: 0 } as const;

// Preview: edits live in this page only. Phase 5 saves addresses to the customer's account.
export function AddressBook() {
  const say = useShop((s) => s.say);
  const [list, setList] = useState<Addr[]>(SAMPLE_ADDRESSES);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: "", city: "Dhaka", line: "" });
  const [err, setErr] = useState(false);

  const remove = (id: string) => {
    const rest = list.filter((a) => a.id !== id);
    if (rest.length && !rest.some((a) => a.isDefault)) rest[0] = { ...rest[0], isDefault: true };
    setList(rest); say("Address removed");
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.line.trim().length < 5) { setErr(true); document.getElementById("ad-line")?.focus(); return; }
    setList([...list, { id: `n${Date.now()}`, label: draft.label.trim() || "Address", line: `${draft.line.trim()}, ${draft.city.trim() || "Dhaka"}`, isDefault: list.length === 0 }]);
    setAdding(false); setDraft({ label: "", city: "Dhaka", line: "" }); setErr(false); say("Address added");
  };

  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 className="nx-sr">Saved addresses</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: 14 }}>
        {list.map((a) => (
          <div key={a.id} className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 8, boxShadow: a.isDefault ? "inset 0 0 0 1px #222321" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 15, fontWeight: 600 }}>{a.label}</span>{a.isDefault && <span style={{ padding: "5px 10px", borderRadius: 99, background: "#EFE9DF", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>Default</span>}</div>
            <span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>{a.line}</span>
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              {!a.isDefault && <button style={textBtn} onClick={() => setList(list.map((b) => ({ ...b, isDefault: b.id === a.id })))}>Set as default</button>}
              <button style={{ ...textBtn, color: "#5C5D59" }} aria-label={`Remove ${a.label} address`} onClick={() => remove(a.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {adding ? (
        <form className="nx-panel nx-pop" noValidate onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="nx-two">
            <div className="nx-field"><label htmlFor="ad-label">Label</label><input id="ad-label" placeholder="Home, Office…" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></div>
            <div className="nx-field"><label htmlFor="ad-city">City</label><input id="ad-city" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /></div>
          </div>
          <div className="nx-field"><label htmlFor="ad-line">Street address and area</label><input id="ad-line" autoComplete="street-address" value={draft.line} onChange={(e) => { setDraft({ ...draft, line: e.target.value }); setErr(false); }} aria-invalid={err} />{err && <span className="err">Please add a street address.</span>}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="nx-btn" type="submit">Save address</button><button className="nx-btn nx-ghost" type="button" onClick={() => { setAdding(false); setErr(false); }}>Cancel</button></div>
        </form>
      ) : (
        <button className="nx-btn nx-ghost" onClick={() => setAdding(true)} style={{ alignSelf: "flex-start" }}>+ Add a new address</button>
      )}
    </div>
  );
}
