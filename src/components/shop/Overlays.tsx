"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useShop } from "@/store/shop";
import { useMounted } from "@/lib/useMounted";
import { getProduct } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowRight, IconCheck, IconClose, IconHeart } from "@/components/icons";
import { Swatches } from "./ProductCard";
import { useState } from "react";

import { FREE_SHIP_MIN } from "@/lib/pricing";

export function Overlays() {
  const mounted = useMounted();
  if (!mounted) return null;
  return (<><CartDrawer /><QuickView /><Toast /></>);
}

function useLockScroll(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { useShop.getState().openCart(false); useShop.getState().openQuick(null); } };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [on]);
}

function CartDrawer() {
  const { cart, cartOpen, openCart, setQty } = useShop();
  useLockScroll(cartOpen);
  if (!cartOpen) return null;
  const lines = cart.flatMap((x) => { const p = getProduct(x.id); return p ? [{ x, p, color: p.colors[x.c] ?? p.colors[0] }] : []; });
  const count = lines.reduce((a, l) => a + l.x.q, 0);
  const subtotal = lines.reduce((a, l) => a + l.p.price * l.x.q, 0);
  const left = FREE_SHIP_MIN - subtotal;
  return (
    <div role="dialog" aria-modal="true" aria-label="Shopping bag" style={{ position: "fixed", inset: 0, zIndex: 80 }}>
      <button className="nx-fade" aria-label="Close bag" onClick={() => openCart(false)} style={{ position: "absolute", inset: 0, border: 0, background: "rgba(34,35,33,.4)", backdropFilter: "blur(3px)", cursor: "pointer" }} />
      <aside className="nx-drawer" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(440px, 100%)", background: "#F8F5EF", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(34,35,33,.1)" }}>
          <h2 className="nx-f" style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>Your bag <span style={{ fontSize: 15, color: "#5C5D59" }}>({count})</span></h2>
          <button className="nx-icon" aria-label="Close bag" onClick={() => openCart(false)}><IconClose /></button>
        </div>
        <div style={{ padding: "14px 24px", background: "#E9DFD0", fontSize: 13 }}>
          <span>{left > 0 ? `You are ${formatBDT(left)} away from free Dhaka delivery` : "You have unlocked free Dhaka delivery"}</span>
          <div style={{ marginTop: 8, height: 3, borderRadius: 3, background: "rgba(34,35,33,.12)" }}><div style={{ height: 3, borderRadius: 3, background: "#5E6A5B", width: `${Math.min(100, Math.round((subtotal / FREE_SHIP_MIN) * 100))}%`, transition: "width .6s" }} /></div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "8px 24px" }}>
          {lines.length === 0 && (
            <div style={{ padding: "64px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <span className="nx-f" style={{ fontSize: 26, fontStyle: "italic" }}>Your bag is waiting.</span>
              <span style={{ fontSize: 14, color: "#5C5D59" }}>Begin with a piece you love.</span>
              <Link className="nx-btn" href="/shop" onClick={() => openCart(false)}>Explore Collection</Link>
            </div>
          )}
          {lines.map(({ x, p, color }) => (
            <div key={`${x.id}-${x.c}`} className="nx-pop" style={{ display: "flex", gap: 16, padding: "18px 0", borderBottom: "1px solid rgba(34,35,33,.08)" }}>
              <div style={{ width: 92, height: 108, flex: "none", borderRadius: 4, background: p.bg, padding: 12 }}><ProductArt kind={p.kind} fill={color.hex} /></div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span className="nx-f" style={{ fontSize: 17 }}>{p.name}</span><span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(p.price * x.q)}</span></div>
                <span style={{ fontSize: 12.5, color: "#5C5D59" }}>{color.name}</span>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="nx-qty"><button aria-label={`Decrease quantity of ${p.name}`} onClick={() => setQty(x.id, x.c, x.q - 1)}>−</button><span>{x.q}</span><button aria-label={`Increase quantity of ${p.name}`} onClick={() => setQty(x.id, x.c, Math.min(9, x.q + 1))}>+</button></div>
                  <button onClick={() => setQty(x.id, x.c, 0)} style={{ border: 0, background: "none", cursor: "pointer", fontSize: 12.5, color: "#5C5D59", textDecoration: "underline", textUnderlineOffset: 3, minHeight: 36 }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div style={{ padding: "20px 24px 24px", borderTop: "1px solid rgba(34,35,33,.1)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}><span>Subtotal</span><strong>{formatBDT(subtotal)}</strong></div>
            <span style={{ fontSize: 12.5, color: "#5C5D59" }}>Delivery and VAT calculated at checkout.</span>
            <Link className="nx-btn" href="/checkout" onClick={() => openCart(false)} style={{ width: "100%" }}>Checkout <IconArrowRight /></Link>
            <Link className="nx-btn nx-ghost" href="/cart" onClick={() => openCart(false)} style={{ width: "100%" }}>View full bag</Link>
          </div>
        )}
      </aside>
    </div>
  );
}

function QuickView() {
  const { quickId, openQuick, add, say, wish, toggleWish } = useShop();
  const [ci, setCi] = useState(0);
  useEffect(() => setCi(0), [quickId]);
  useLockScroll(!!quickId);
  const p = quickId ? getProduct(quickId) : undefined;
  if (!p) return null;
  const color = p.colors[ci] ?? p.colors[0];
  const wished = !!wish[p.id];
  return (
    <div role="dialog" aria-modal="true" aria-label={`Quick view: ${p.name}`} style={{ position: "fixed", inset: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <button className="nx-fade" aria-label="Close quick view" onClick={() => openQuick(null)} style={{ position: "absolute", inset: 0, border: 0, background: "rgba(34,35,33,.45)", backdropFilter: "blur(4px)", cursor: "pointer" }} />
      <div className="nx-pop nx-qv" style={{ position: "relative", width: "min(960px, 100%)", maxHeight: "calc(100dvh - 32px)", overflow: "auto", background: "#F8F5EF", borderRadius: 6 }}>
        <div style={{ background: p.bg, minHeight: 320, padding: "12%", display: "flex" }}><ProductArt kind={p.kind} fill={color.hex} /></div>
        <div style={{ padding: "clamp(24px, 4vw, 48px)", display: "flex", flexDirection: "column", gap: 18 }}>
          <button className="nx-icon" aria-label="Close quick view" onClick={() => openQuick(null)} style={{ alignSelf: "flex-end", margin: "-12px -12px 0 0" }}><IconClose /></button>
          <span className="nx-eyebrow" style={{ fontSize: 11 }}>{p.type}</span>
          <h2 className="nx-f" style={{ margin: 0, fontSize: 38, fontWeight: 300, lineHeight: 1.05, letterSpacing: "-.02em" }}>{p.name}</h2>
          <span style={{ fontSize: 20, fontWeight: 600 }}>{formatBDT(p.price)}</span>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>{p.description}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13 }}>Colour — <strong>{color.name}</strong></span>
            <Swatches colors={p.colors} active={ci} onPick={setCi} size="lg" />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="nx-btn" onClick={() => { add(p.id, ci); say(`${p.name} added to your bag`); }} style={{ flex: 1 }}>Add to bag — {formatBDT(p.price)}</button>
            <button className="nx-icon nx-heart" aria-label={wished ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={wished} onClick={() => say(toggleWish(p.id) ? "Saved to your wishlist" : "Removed from wishlist")} style={{ width: 52, height: 52, boxShadow: "inset 0 0 0 1px rgba(34,35,33,.3)", color: wished ? "#9A5B40" : "#222321" }}><IconHeart filled={wished} /></button>
          </div>
          <Link className="nx-link" href={`/product/${p.slug}`} onClick={() => openQuick(null)} style={{ alignSelf: "flex-start", fontWeight: 600 }}>View full details</Link>
          <span style={{ fontSize: 12.5, color: "#5C5D59" }}>Delivered in Dhaka within 5–7 days · Free returns within 7 days</span>
        </div>
      </div>
    </div>
  );
}

function Toast() {
  const toast = useShop((s) => s.toast);
  const openCart = useShop((s) => s.openCart);
  const undo = useShop((s) => s.undo);
  if (!toast) return null;
  const linkStyle = { border: 0, background: "none", color: "#E2B49C", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, padding: "4px 0" } as const;
  return (
    <div className="nx-pop" role="status" style={{ position: "fixed", left: "50%", bottom: 24, zIndex: 90, transform: "translateX(-50%)", background: "#222321", color: "#F8F5EF", padding: "14px 22px", borderRadius: 99, fontSize: 14, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 20px 40px rgba(0,0,0,.2)", whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)" }}>
      <IconCheck color="#C9D1C6" />{toast}
      {undo ? <button onClick={() => { undo(); useShop.setState({ toast: "", undo: null }); }} style={linkStyle}>Undo</button>
        : /added to your bag/.test(toast) && <button onClick={() => openCart(true)} style={linkStyle}>View bag</button>}
    </div>
  );
}
