"use client";
import { useShop } from "@/store/shop";
import { getProduct } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";

export function QuickViewChip() {
  const quick = useShop((s) => s.openQuick);
  const p = getProduct("halden");
  if (!p) return null;
  return (
    <button className="nx-herocap" onClick={() => quick(p.id)} style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 14, padding: "12px 18px 12px 12px", border: 0, borderRadius: 99, background: "rgba(248,245,239,.8)", backdropFilter: "blur(10px)", cursor: "pointer", textAlign: "left" }}>
      <span style={{ width: 40, height: 40, borderRadius: 99, background: p.colors[0].hex }} />
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name} · {p.colors[0].name}</span>
        <span style={{ fontSize: 12, color: "#5C5D59" }}>{formatBDT(p.price)} — Quick view</span>
      </span>
    </button>
  );
}
