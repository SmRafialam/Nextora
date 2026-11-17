"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";
import { useShop } from "@/store/shop";
import { useMounted } from "@/lib/useMounted";
import { ProductArt } from "@/components/ProductArt";
import { IconHeart, IconPlus } from "@/components/icons";

export function Swatches({ colors, active, onPick, size = "sm" }: { colors: Product["colors"]; active: number; onPick: (i: number) => void; size?: "sm" | "lg" }) {
  const box = size === "lg" ? 44 : 32, dot = size === "lg" ? 26 : 18;
  return (
    <div role="group" aria-label="Colour" style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: size === "lg" ? -6 : 0 }}>
      {colors.map((c, i) => (
        <button key={c.name} aria-label={c.name} aria-pressed={i === active} onClick={() => onPick(i)} style={{ width: box, height: box, border: 0, padding: 0, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: dot, height: dot, borderRadius: 99, background: c.hex, boxShadow: `0 0 0 1px rgba(34,35,33,.15), 0 0 0 3px #F8F5EF, 0 0 0 4px ${i === active ? "#222321" : "transparent"}`, transition: "box-shadow .3s" }} />
        </button>
      ))}
    </div>
  );
}

export function HeartButton({ p, style }: { p: Product; style?: React.CSSProperties }) {
  const mounted = useMounted();
  const wished = useShop((s) => mounted && !!s.wish[p.id]);
  const toggle = useShop((s) => s.toggleWish);
  const say = useShop((s) => s.say);
  return (
    <button className="nx-icon nx-heart" aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`} aria-pressed={wished} onClick={() => say(toggle(p.id) ? "Saved to your wishlist" : "Removed from wishlist")} style={{ position: "absolute", right: 8, top: 8, color: wished ? "#9A5B40" : "#222321", ...style }}>
      <IconHeart filled={wished} />
    </button>
  );
}

/** Best-seller style card (4:5) — the homepage "Pieces people keep." card. */
export function ProductCard({ p, reveal = true }: { p: Product; reveal?: boolean }) {
  const [ci, setCi] = useState(0);
  const add = useShop((s) => s.add), say = useShop((s) => s.say), quick = useShop((s) => s.openQuick);
  const color = p.colors[ci] ?? p.colors[0];
  return (
    <article className={`nx-card${reveal ? " nx-reveal" : ""}`} style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
      <div className="nx-zoom" style={{ aspectRatio: "4 / 5", borderRadius: 4, background: p.bg }}>
        <div className="nx-alt" style={{ position: "absolute", inset: 0, background: p.bgAlt }} />
        <Link href={`/product/${p.slug}`} aria-label={p.name} style={{ position: "absolute", inset: 0 }}>
          <div className="nx-art" style={{ position: "absolute", inset: "14% 10% 18%" }}><ProductArt kind={p.kind} fill={color.hex} /></div>
        </Link>
        {p.badge && <span style={{ position: "absolute", left: 14, top: 14, padding: "6px 10px", borderRadius: 99, background: p.badge === "Sale" ? "#9A5B40" : "#F8F5EF", color: p.badge === "Sale" ? "#fff" : "#222321", fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>{p.badge}</span>}
        <HeartButton p={p} />
        <div className="nx-actions" style={{ position: "absolute", left: 12, right: 12, bottom: 12, display: "flex", gap: 8 }}>
          <button className="nx-chip" onClick={() => quick(p.id)} style={{ flex: 1 }}>Quick view</button>
          <button className="nx-chip dark" onClick={() => { add(p.id, ci); say(`${p.name} added to your bag`); }} aria-label={`Add ${p.name} to bag`} style={{ flex: 1 }}>Add to bag</button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <h3 className="nx-f" style={{ margin: 0, fontSize: 20, fontWeight: 400, letterSpacing: "-.01em" }}><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
          <span style={{ fontSize: 13, color: "#5C5D59" }}>{p.meta}</span>
        </div>
        <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{formatBDT(p.price)}</span>
          {p.compareAt && <s style={{ fontSize: 12.5, color: "#5C5D59" }}>{formatBDT(p.compareAt)}</s>}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: -6 }}>
        <Swatches colors={p.colors} active={ci} onPick={setCi} />
        <span style={{ fontSize: 12, color: "#5C5D59" }}>{color.name}</span>
      </div>
    </article>
  );
}

/** Square "New arrivals" card used in the carousel. */
export function ArrivalCard({ p }: { p: Product }) {
  const add = useShop((s) => s.add), say = useShop((s) => s.say), quick = useShop((s) => s.openQuick);
  return (
    <article className="nx-slide nx-card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="nx-zoom" style={{ aspectRatio: "1 / 1", borderRadius: 4, background: p.bg }}>
        <Link href={`/product/${p.slug}`} aria-label={p.name} style={{ position: "absolute", inset: 0 }}>
          <div className="nx-art" style={{ position: "absolute", inset: "14%" }}><ProductArt kind={p.kind} fill={p.colors[0].hex} /></div>
        </Link>
        <span style={{ position: "absolute", left: 14, top: 14, padding: "6px 10px", borderRadius: 99, background: "#F8F5EF", fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>New</span>
        <HeartButton p={p} />
        <div className="nx-actions" style={{ position: "absolute", left: 12, right: 12, bottom: 12, display: "flex", gap: 8 }}>
          <button className="nx-chip" onClick={() => quick(p.id)} style={{ flex: 1 }}>Quick view</button>
          <button className="nx-chip dark" onClick={() => { add(p.id); say(`${p.name} added to your bag`); }} aria-label={`Add ${p.name} to bag`} style={{ width: 40, padding: 0 }}><IconPlus /></button>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h3 className="nx-f" style={{ margin: 0, fontSize: 19, fontWeight: 400 }}><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
        <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(p.price)}</span>
      </div>
    </article>
  );
}
