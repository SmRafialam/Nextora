"use client";
import Link from "next/link";
import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { FREE_SHIP_MIN, findCoupon, priceCart } from "@/lib/pricing";
import { useMounted } from "@/lib/useMounted";
import { useShop } from "@/store/shop";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowRight } from "@/components/icons";
import { TrustList } from "./TrustList";

const textBtn = { border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40 } as const;

export function CartView() {
  const mounted = useMounted();
  const cart = useShop((s) => s.cart);
  const promo = useShop((s) => s.promo);
  const { setQty, setCart, setPromo, say, setWish } = useShop();
  const [code, setCode] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  const t = priceCart(mounted ? cart : [], { promo });
  const left = FREE_SHIP_MIN - t.subtotal;
  const input = code ?? promo;

  const apply = () => {
    const c = findCoupon(input);
    setErr(!c);
    setPromo(c ? input.trim().toUpperCase() : "");
    if (c) say(`${c.label} — applied`);
  };

  return (
    <section className="nx-wrap" style={{ paddingTop: 64, paddingBottom: 120 }}>
      <div className="nx-rise" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 24 }}>
        <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(48px, 6vw, 92px)", lineHeight: 0.92, letterSpacing: "-.035em" }}>Your <span style={{ fontStyle: "italic", color: "#9A5B40" }}>bag</span></h1>
        {mounted && <span style={{ fontSize: 14, color: "#5C5D59" }}>{t.count} {t.count === 1 ? "item" : "items"}</span>}
      </div>

      {!mounted && (
        <div className="nx-main-aside"><div style={{ display: "flex", flexDirection: "column", gap: 20 }}><div className="nx-skel" style={{ height: 150 }} /><div className="nx-skel" style={{ height: 150 }} /></div><div className="nx-skel" style={{ height: 360 }} /></div>
      )}

      {mounted && t.lines.length === 0 && (
        <div className="nx-pop" style={{ padding: "96px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, borderTop: "1px solid rgba(34,35,33,.12)" }}>
          <span className="nx-f" style={{ fontSize: 36, fontWeight: 300, fontStyle: "italic" }}>Your bag is waiting.</span>
          <span style={{ fontSize: 15, color: "#5C5D59" }}>Begin with a piece you love — it will be saved here.</span>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}><Link className="nx-btn" href="/shop">Explore the collection</Link><Link className="nx-btn nx-ghost" href="/wishlist">View wishlist</Link></div>
        </div>
      )}

      {t.lines.length > 0 && (
        <div className="nx-main-aside">
          <div style={{ borderTop: "1px solid rgba(34,35,33,.12)" }}>
            <div style={{ padding: "18px 0", display: "flex", flexDirection: "column", gap: 10, borderBottom: "1px solid rgba(34,35,33,.1)" }}>
              <span style={{ fontSize: 14 }}>{left > 0 ? `Add ${formatBDT(left)} more for free Dhaka delivery` : "You have unlocked free Dhaka delivery"}</span>
              <div style={{ height: 3, borderRadius: 3, background: "rgba(34,35,33,.12)" }}><div style={{ height: 3, borderRadius: 3, background: "#5E6A5B", width: `${Math.min(100, Math.round((t.subtotal / FREE_SHIP_MIN) * 100))}%`, transition: "width .6s var(--nx-ease)" }} /></div>
            </div>
            {t.lines.map((l) => {
              const href = `/product/${l.p.slug}`;
              return (
                <div key={`${l.id}-${l.c}`} className="nx-line nx-pop">
                  <Link href={href} aria-label={l.p.name} style={{ display: "block", aspectRatio: "4 / 5", borderRadius: 4, background: l.p.bg, padding: 14 }}><ProductArt kind={l.p.kind} fill={l.color.hex} /></Link>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <Link className="nx-f" href={href} style={{ fontSize: 22, lineHeight: 1.15 }}>{l.p.name}</Link>
                    <span style={{ fontSize: 13, color: "#5C5D59" }}>{l.p.meta} · {l.color.name}</span>
                    <span style={{ fontSize: 13, color: "#5E6A5B" }}>In stock · ships in {l.p.price >= 20000 ? "5–7 days" : "2–3 days"}</span>
                    <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18 }}>
                      <div className="nx-qty">
                        <button aria-label={`Decrease quantity of ${l.p.name}`} onClick={() => setQty(l.id, l.c, l.q - 1)}>−</button>
                        <span aria-live="polite">{l.q}</span>
                        <button aria-label={`Increase quantity of ${l.p.name}`} onClick={() => setQty(l.id, l.c, Math.min(9, l.q + 1))}>+</button>
                      </div>
                      <button style={textBtn} onClick={() => { setQty(l.id, l.c, 0); setWish({ ...useShop.getState().wish, [l.id]: true }); say("Saved to your wishlist"); }}>Save for later</button>
                      <button style={{ ...textBtn, color: "#5C5D59" }} onClick={() => { const before = cart; setQty(l.id, l.c, 0); say(`${l.p.name} removed`, () => setCart(before)); }}>Remove</button>
                    </div>
                  </div>
                  <div className="nx-lt" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(l.total)}</span>
                    {l.q > 1 && <span style={{ fontSize: 12, color: "#5C5D59" }}>{formatBDT(l.p.price)} each</span>}
                  </div>
                </div>
              );
            })}
            <Link className="nx-link" href="/shop" style={{ display: "inline-block", marginTop: 20, fontWeight: 600 }}>← Continue shopping</Link>
          </div>

          <aside className="nx-sticky" style={{ background: "#FFFFFF", borderRadius: 6, padding: 28, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 30px 60px -40px rgba(34,35,33,.3)" }}>
            <h2 className="nx-f" style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 400 }}>Order summary</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>Subtotal</span><span>{formatBDT(t.subtotal)}</span></div>
            {t.discount > 0 && <div className="nx-pop" style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#5E6A5B" }}><span>Promo {promo}</span><span>− {formatBDT(t.discount)}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span>Delivery (Dhaka)</span><span>{t.shipping.price ? formatBDT(t.shipping.price) : "Free"}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 16 }}><span style={{ fontSize: 15, fontWeight: 600 }}>Total</span><span className="nx-f" style={{ fontSize: 30 }}>{formatBDT(t.total)}</span></div>
            <span style={{ fontSize: 12, color: "#5C5D59", marginTop: -8 }}>VAT included where applicable</span>
            <form className="nx-field" style={{ marginTop: 4 }} onSubmit={(e) => { e.preventDefault(); apply(); }}>
              <label htmlFor="nx-promo">Promo code</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input id="nx-promo" value={input} onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(false); }} placeholder="Try NESTORA10" autoComplete="off" style={{ textTransform: "uppercase" }} />
                <button className="nx-btn nx-ghost" type="submit" style={{ minHeight: 52, padding: "0 18px" }}>Apply</button>
              </div>
              {t.coupon && <span style={{ fontSize: 12, color: "#5E6A5B" }}>{t.coupon.label} — applied</span>}
              {err && <span style={{ fontSize: 12, color: "#9A3B2A" }}>That code is not valid. Try NESTORA10.</span>}
            </form>
            <Link className="nx-btn" href="/checkout" style={{ width: "100%", marginTop: 4 }}>Secure checkout <IconArrowRight /></Link>
            <TrustList />
          </aside>
        </div>
      )}
    </section>
  );
}
