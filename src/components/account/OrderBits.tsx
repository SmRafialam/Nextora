"use client";
import type { CartLine } from "@/store/shop";
import { useShop } from "@/store/shop";
import { ProductArt } from "@/components/ProductArt";
import type { PricedLine } from "@/lib/pricing";

export function Thumbs({ lines, w = 64, h = 72 }: { lines: PricedLine[]; w?: number; h?: number }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {lines.map((l) => (
        <span key={`${l.id}-${l.c}`} title={l.p.name} style={{ width: w, height: h, borderRadius: 4, background: l.p.bg, padding: 8, display: "block" }}><ProductArt kind={l.p.kind} fill={l.color.hex} /></span>
      ))}
    </div>
  );
}

export function BuyAgain({ items }: { items: CartLine[] }) {
  const add = useShop((s) => s.add);
  const say = useShop((s) => s.say);
  return <button className="nx-pill" onClick={() => { items.forEach((x) => add(x.id, x.c, x.q)); say("Added to your bag again"); }}>Buy again</button>;
}
