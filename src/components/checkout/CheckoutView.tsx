"use client";
import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { priceCart, type ShipId } from "@/lib/pricing";
import { useMounted } from "@/lib/useMounted";
import { useShop } from "@/store/shop";
import { useCatalog } from "@/components/CatalogProvider";
import { ProductArt } from "@/components/ProductArt";
import Link from "next/link";

const CITIES = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Other"];
// Only Cash on Delivery can complete an order. Online methods stay disabled until their
// sandbox credentials are configured and server-side verification is built (Phase 6).
const PAY = [
  { id: "cod", label: "Cash on delivery", note: "Pay when your order arrives", ready: true },
  { id: "bkash", label: "bKash", note: "Available once bKash is connected", ready: false },
  { id: "nagad", label: "Nagad", note: "Available once Nagad is connected", ready: false },
  { id: "card", label: "Credit or debit card", note: "Paid on SSLCommerz's secure page · available once connected", ready: false },
] as const;
const STEPS = ["Contact & address", "Delivery", "Payment"];

type Form = { name: string; phone: string; email: string; address: string; area: string; city: string; note: string };
type Errs = Partial<Record<keyof Form, string>>;

export function validateContact(v: Form): Errs {
  const e: Errs = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^01[3-9]\d{8}$/.test(v.phone.replace(/\D/g, ""))) e.phone = "Enter an 11-digit mobile number starting with 01.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email.";
  if (v.address.trim().length < 5) e.address = "Please add your house and road.";
  if (!v.area.trim()) e.area = "Please add your area.";
  return e;
}

export function CheckoutView() {
  const mounted = useMounted();
  const { getProduct } = useCatalog();
  const cart = useShop((s) => s.cart);
  const promo = useShop((s) => s.promo);
  const [step, setStep] = useState(1);
  const [ship, setShip] = useState<ShipId>("std");
  const [pay, setPay] = useState("cod");
  const [agree, setAgree] = useState(false);
  const [agreeErr, setAgreeErr] = useState(false);
  const [notice, setNotice] = useState(false);
  const [errs, setErrs] = useState<Errs>({});
  const [v, setV] = useState<Form>({ name: "", phone: "", email: "", address: "", area: "", city: "Dhaka", note: "" });
  const inDhaka = v.city === "Dhaka";
  const t = priceCart(mounted ? cart : [], getProduct, { promo, ship, inDhaka });

  const on = (k: keyof Form) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setV({ ...v, [k]: ev.target.value });
    if (errs[k]) { const n = { ...errs }; delete n[k]; setErrs(n); }
  };
  const view = (n: number) => {
    const done = step > n, open = step === n;
    return { done, open, mark: done ? "✓" : String(n), bg: done ? "#5E6A5B" : open ? "#222321" : "transparent", ink: done || open ? "#F8F5EF" : "#5C5D59", title: done || open ? "#222321" : "#5C5D59", ring: !done && !open ? "inset 0 0 0 1px rgba(34,35,33,.25)" : "none" };
  };
  const next1 = () => {
    const e = validateContact(v);
    setErrs(e);
    if (Object.keys(e).length) { document.getElementById(`f-${Object.keys(e)[0]}`)?.focus(); return; }
    setShip(inDhaka ? (ship === "out" ? "std" : ship) : "out");
    setStep(2);
  };
  const place = () => {
    if (!agree) { setAgreeErr(true); return; }
    setNotice(true);
  };

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="nx-field">
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} value={v[k]} onChange={on(k)} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `e-${k}` : undefined} {...props} />
      {errs[k] && <span className="err" id={`e-${k}`}>{errs[k]}</span>}
    </div>
  );
  const head = (n: number, label: string, edit?: () => void) => {
    const s = view(n);
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 14, fontSize: 18, fontWeight: 600, color: s.title }}><span className="nx-num" style={{ background: s.bg, color: s.ink, boxShadow: s.ring }}>{s.mark}</span>{label}</h2>
        {s.done && edit && <button className="nx-edit" onClick={edit}>Edit</button>}
      </div>
    );
  };

  if (mounted && t.lines.length === 0) {
    return (
      <section className="nx-wrap nx-pop" style={{ paddingTop: 120, paddingBottom: 140, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
        <span className="nx-f" style={{ fontSize: 36, fontWeight: 300, fontStyle: "italic" }}>Your bag is empty.</span>
        <span style={{ fontSize: 15, color: "#5C5D59" }}>Add a piece you love, then come back to check out.</span>
        <Link className="nx-btn" href="/shop" style={{ marginTop: 8 }}>Explore the collection</Link>
      </section>
    );
  }

  return (
    <section className="nx-wrap" style={{ paddingTop: 48, paddingBottom: 120 }}>
      <ol aria-label="Checkout progress" style={{ listStyle: "none", margin: "0 0 40px", padding: 0, display: "flex", flexWrap: "wrap", gap: "8px 28px", fontSize: 13 }}>
        {STEPS.map((l, i) => (
          <li key={l} aria-current={step === i + 1 ? "step" : undefined} style={{ display: "flex", alignItems: "center", gap: 10, color: step >= i + 1 ? "#222321" : "#5C5D59", fontWeight: step === i + 1 ? 600 : 400 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: step > i + 1 ? "#5E6A5B" : step === i + 1 ? "#222321" : "rgba(34,35,33,.2)" }} />{l}
          </li>
        ))}
      </ol>
      <div className="nx-main-aside">
        <div>
          <h1 className="nx-f nx-rise" style={{ margin: "0 0 32px", fontWeight: 300, fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1, letterSpacing: "-.03em" }}>Checkout</h1>

          <div className="nx-step">
            {head(1, "Contact & address", () => setStep(1))}
            {view(1).done && <p style={{ margin: "14px 0 0 46px", fontSize: 14, lineHeight: 1.7, color: "#45463F" }}>{v.name} · {v.phone} · {v.email}<br />{v.address}, {v.area}, {v.city}</p>}
            {step === 1 && (
              <form className="nx-pop" noValidate onSubmit={(e) => { e.preventDefault(); next1(); }} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="nx-two">
                  {field("name", "Full name", { autoComplete: "name" })}
                  {field("phone", "Mobile number", { type: "tel", autoComplete: "tel", placeholder: "01XXXXXXXXX", inputMode: "numeric" })}
                </div>
                {field("email", "Email", { type: "email", autoComplete: "email" })}
                {field("address", "Street address", { autoComplete: "street-address", placeholder: "House, road, block" })}
                <div className="nx-two">
                  <div className="nx-field"><label htmlFor="f-city">City</label><select id="f-city" value={v.city} onChange={on("city")}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                  {field("area", "Area", { placeholder: "e.g. Gulshan, Dhanmondi" })}
                </div>
                <button className="nx-btn" type="submit" style={{ alignSelf: "flex-start", marginTop: 8 }}>Continue to delivery</button>
              </form>
            )}
          </div>

          <div className="nx-step">
            {head(2, "Delivery", () => setStep(2))}
            {view(2).done && <p style={{ margin: "14px 0 0 46px", fontSize: 14, color: "#45463F" }}>{t.shipping.label} · {t.shipping.price ? formatBDT(t.shipping.price) : "Free"}</p>}
            {step === 2 && (
              <div className="nx-pop" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                {t.options.map((o) => (
                  <button key={o.id} className="nx-opt" aria-pressed={o.id === t.shipping.id} onClick={() => setShip(o.id)}>
                    <span className="nx-radio" />
                    <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}><span style={{ fontSize: 15, fontWeight: 600 }}>{o.label}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{o.note}</span></span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{o.price ? formatBDT(o.price) : "Free"}</span>
                  </button>
                ))}
                <div className="nx-field" style={{ marginTop: 8 }}><label htmlFor="f-note">Delivery note (optional)</label><textarea id="f-note" placeholder="Floor, lift access, preferred time…" value={v.note} onChange={on("note")} maxLength={300} /></div>
                <button className="nx-btn" onClick={() => { setShip(t.shipping.id); setStep(3); }} style={{ alignSelf: "flex-start", marginTop: 8 }}>Continue to payment</button>
              </div>
            )}
          </div>

          <div className="nx-step" style={{ borderBottom: "1px solid rgba(34,35,33,.12)" }}>
            {head(3, "Payment")}
            {step === 3 && (
              <div className="nx-pop" style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                {PAY.map((o) => (
                  <button key={o.id} className="nx-opt" aria-pressed={pay === o.id} disabled={!o.ready} onClick={() => setPay(o.id)}>
                    <span className="nx-radio" />
                    <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}><span style={{ fontSize: 15, fontWeight: 600 }}>{o.label}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{o.note}</span></span>
                  </button>
                ))}
                <label style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5, marginTop: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={agree} onChange={() => { setAgree(!agree); setAgreeErr(false); }} style={{ width: 20, height: 20, margin: 0, accentColor: "#222321", flex: "none" }} />
                  <span>I agree to the <Link href="/shipping-policy" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>delivery</Link> and <Link href="/return-policy" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>returns</Link> terms.</span>
                </label>
                {agreeErr && <span role="alert" style={{ fontSize: 12, color: "#9A3B2A" }}>Please accept the terms to place your order.</span>}
                <button className="nx-btn" onClick={place} style={{ width: "100%", marginTop: 10 }}>Place order — {formatBDT(t.total)}</button>
                {notice && (
                  <p role="status" className="nx-pop" style={{ margin: 0, padding: 16, borderRadius: 6, background: "#EFE9DF", fontSize: 13.5, lineHeight: 1.6 }}>
                    Ordering isn&apos;t switched on yet. The order system (stock checks, server-side totals and order records) is built in the next phase, so nothing has been placed or charged and your details have not been sent anywhere.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="nx-sticky" style={{ background: "#FFFFFF", borderRadius: 6, padding: 28, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 30px 60px -40px rgba(34,35,33,.3)" }}>
          <h2 className="nx-f" style={{ margin: 0, fontSize: 24, fontWeight: 400 }}>In your bag <span style={{ fontSize: 14, color: "#5C5D59" }}>({t.count})</span></h2>
          {!mounted && (<><div className="nx-skel" style={{ height: 72 }} /><div className="nx-skel" style={{ height: 72 }} /></>)}
          {t.lines.map((l) => (
            <div key={`${l.id}-${l.c}`} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ position: "relative", width: 64, height: 72, flex: "none", borderRadius: 4, background: l.p.bg, padding: 8 }}><ProductArt kind={l.p.kind} fill={l.color.hex} /><span style={{ position: "absolute", top: -6, right: -6, minWidth: 20, height: 20, borderRadius: 99, background: "#222321", color: "#F8F5EF", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{l.q}</span></span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{l.p.name}</span><span style={{ fontSize: 12.5, color: "#5C5D59" }}>{l.color.name}</span></span>
              <span style={{ fontSize: 14, whiteSpace: "nowrap" }}>{formatBDT(l.total)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{formatBDT(t.subtotal)}</span></div>
            {t.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#5E6A5B" }}><span>Promo {promo}</span><span>− {formatBDT(t.discount)}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span><span>{t.shipping.price ? formatBDT(t.shipping.price) : "Free"}</span></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 16 }}><span style={{ fontWeight: 600 }}>Total</span><span className="nx-f" style={{ fontSize: 30 }}>{formatBDT(t.total)}</span></div>
        </aside>
      </div>
    </section>
  );
}
