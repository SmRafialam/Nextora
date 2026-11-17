"use client";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";
import { useShop } from "@/store/shop";
import { useMounted } from "@/lib/useMounted";
import { ProductArt } from "@/components/ProductArt";
import { IconHeart } from "@/components/icons";
import { Swatches } from "./ProductCard";

const VIEWS = [
  { label: "Front", inset: "16% 10% 18%", thumb: "14%", tf: "none", room: false, texture: false },
  { label: "Detail", inset: "0 -30% -10% -30%", thumb: "-20% -40% -30%", tf: "translateY(-14%)", room: false, texture: false },
  { label: "In the room", inset: "34% 18% 12%", thumb: "30% 14% 10%", tf: "none", room: true, texture: false },
  { label: "Material", inset: "0", thumb: "0", tf: "none", room: false, texture: true },
];

export function ProductDetail({ p }: { p: Product }) {
  const [ci, setCi] = useState(0);
  const [view, setView] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [dhaka, setDhaka] = useState(true);
  const mounted = useMounted();
  const { add, say, toggleWish } = useShop();
  const wished = useShop((s) => mounted && !!s.wish[p.id]);
  const color = p.colors[ci] ?? p.colors[0];
  const v = VIEWS[view];
  const heavy = p.price >= 20000;
  const delivery = dhaka
    ? heavy ? "White-glove delivery and placement in 5–7 days · free" : "Delivered in 2–3 days · free over ৳ 15,000"
    : heavy ? "Delivered and placed in 7–10 days · ৳ 1,500" : "Courier delivery in 3–5 days · ৳ 250";
  const addToBag = () => {
    add(p.id, ci, qty);
    say(`${p.name} added to your bag`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };
  const addLabel = added ? "Added to bag ✓" : `Add to bag — ${formatBDT(p.price * qty)}`;
  const viewBg = v.room || v.texture ? "#E9DFD0" : p.bg;

  return (
    <section className="nx-wrap nx-pdp" style={{ paddingTop: 28, paddingBottom: 96 }}>
      <div className="nx-pdp-gallery">
        <div role="group" aria-label="Product views" className="nx-thumbs">
          {VIEWS.map((x, i) => (
            <button key={x.label} className="nx-thumb" aria-label={`Show ${x.label.toLowerCase()} view`} aria-pressed={i === view} onClick={() => setView(i)} style={{ background: x.room || x.texture ? "#E9DFD0" : p.bg }}>
              {x.texture ? <span style={{ position: "absolute", inset: 0, background: color.hex }} /> : <span style={{ position: "absolute", inset: x.thumb, display: "block" }}><ProductArt kind={p.kind} fill={color.hex} /></span>}
            </button>
          ))}
        </div>
        <div className="nx-zoom" style={{ aspectRatio: "4 / 5", borderRadius: 4, background: viewBg }}>
          {v.room && (<>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "30%", background: "#D3C1A8" }} />
            <div style={{ position: "absolute", right: "12%", top: "10%", width: "26%", height: "44%", borderRadius: "999px 999px 4px 4px", background: "#FFFDF8", boxShadow: "inset 0 0 0 8px #EFE5D5" }} />
          </>)}
          {v.texture ? (
            <div key={`t-${ci}`} className="nx-fade" style={{ position: "absolute", inset: 0, background: color.hex, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.08) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,.05) 0 2px, transparent 2px 6px)" }} />
          ) : (
            <div key={view} className="nx-art nx-fade" style={{ position: "absolute", inset: v.inset, transform: v.tf }}><ProductArt kind={p.kind} fill={color.hex} /></div>
          )}
          {p.badge && <span style={{ position: "absolute", left: 18, top: 18, padding: "7px 12px", borderRadius: 99, background: "#F8F5EF", fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>{p.badge}</span>}
          <span style={{ position: "absolute", right: 18, bottom: 18, padding: "8px 14px", borderRadius: 99, background: "rgba(248,245,239,.9)", fontSize: 12 }}>{v.label} · {view + 1} / {VIEWS.length}</span>
        </div>
      </div>

      <div className="nx-sticky nx-rise" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <span className="nx-eyebrow">{p.type}</span>
        <h1 className="nx-f" style={{ margin: "-8px 0 0", fontWeight: 300, fontSize: "clamp(40px, 4.4vw, 64px)", lineHeight: 1, letterSpacing: "-.03em" }}>{p.name}</h1>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 22, fontWeight: 600 }}>{formatBDT(p.price)}</span>
          {p.compareAt && (<><s style={{ fontSize: 15, color: "#5C5D59" }}>{formatBDT(p.compareAt)}</s><span style={{ fontSize: 12, fontWeight: 600, color: "#9A5B40" }}>Save {formatBDT(p.compareAt - p.price)}</span></>)}
        </div>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#45463F" }}>{p.description}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 22 }}>
          <span style={{ fontSize: 13 }}>Colour — <strong>{color.name}</strong></span>
          <Swatches colors={p.colors} active={ci} onPick={setCi} size="lg" />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div className="nx-qty" style={{ height: 52 }}>
            <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span aria-live="polite">{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty(Math.min(9, qty + 1))}>+</button>
          </div>
          <button className="nx-btn" onClick={addToBag} style={{ flex: 1, minWidth: 200 }}>{addLabel}</button>
          <button className="nx-icon nx-heart" aria-label={wished ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={wished} onClick={() => say(toggleWish(p.id) ? "Saved to your wishlist" : "Removed from wishlist")} style={{ width: 52, height: 52, boxShadow: "inset 0 0 0 1px rgba(34,35,33,.3)", color: wished ? "#9A5B40" : "#222321" }}><IconHeart filled={wished} /></button>
        </div>
        <div style={{ borderRadius: 6, background: "#EFE9DF", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div role="group" aria-label="Delivery location" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="nx-pill" aria-pressed={dhaka} onClick={() => setDhaka(true)}>Inside Dhaka</button>
            <button className="nx-pill" aria-pressed={!dhaka} onClick={() => setDhaka(false)}>Outside Dhaka</button>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{delivery}</p>
          <p style={{ margin: 0, fontSize: 14 }}>7-day easy returns · 2-year craftsmanship guarantee</p>
        </div>
        <div>
          <details className="nx-acc" open style={{ borderTop: "1px solid rgba(34,35,33,.12)" }}><summary>Details &amp; dimensions</summary><p className="nx-acc-body">{p.dimensions}<br />{p.meta}</p></details>
          <details className="nx-acc" style={{ borderTop: "1px solid rgba(34,35,33,.12)" }}><summary>Materials &amp; care</summary><p className="nx-acc-body">{p.material}. Dust with a soft dry cloth; blot spills straight away and keep out of strong direct sun.</p></details>
          <details className="nx-acc" style={{ borderTop: "1px solid rgba(34,35,33,.12)", borderBottom: "1px solid rgba(34,35,33,.12)" }}><summary>Delivery &amp; returns</summary><p className="nx-acc-body">Free delivery in Dhaka on orders above ৳ 15,000. Large furniture is delivered and placed in your room of choice. Returns are accepted within 7 days in original condition.</p></details>
        </div>
      </div>

      <div className="nx-mbar">
        <span style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}><span style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span><strong style={{ fontSize: 15 }}>{formatBDT(p.price)}</strong></span>
        <button className="nx-btn" onClick={addToBag} style={{ minHeight: 48, padding: "0 22px" }}>{added ? "Added ✓" : "Add to bag"}</button>
      </div>
    </section>
  );
}
