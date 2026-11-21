"use client";
import type { CartLine } from "@/store/shop";
import { useShop } from "@/store/shop";
import { ProductArt } from "@/components/ProductArt";
import type { ArtKind } from "@/lib/catalog";

export type Thumb = { key: string; name: string; kind: ArtKind; bg: string; hex: string };

export function Thumbs({ items, w = 64, h = 72 }: { items: Thumb[]; w?: number; h?: number }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {items.map((t) => (
        <span key={t.key} title={t.name} style={{ width: w, height: h, borderRadius: 4, background: t.bg, padding: 8, display: "block" }}><ProductArt kind={t.kind} fill={t.hex} /></span>
      ))}
    </div>
  );
}

export function BuyAgain({ items }: { items: CartLine[] }) {
  const add = useShop((s) => s.add);
  const say = useShop((s) => s.say);
  return <button className="nx-pill" onClick={() => { items.forEach((x) => add(x.id, x.c, x.q)); say("Added to your bag again"); }}>Buy again</button>;
}

export function EmptyPanel({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className="nx-panel nx-pop" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
      <span className="nx-f" style={{ fontSize: 28, fontWeight: 300, fontStyle: "italic" }}>{title}</span>
      <span style={{ fontSize: 14.5, color: "#5C5D59", lineHeight: 1.6 }}>{body}</span>
      <a className="nx-btn nx-ghost" href={href} style={{ marginTop: 6 }}>{cta}</a>
    </div>
  );
}
