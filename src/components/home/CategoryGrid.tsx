import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowUpRight } from "@/components/icons";

export function CategoryGrid() {
  return (
    <section id="categories" className="nx-wrap" style={{ paddingTop: 128, paddingBottom: 40 }}>
      <div className="nx-reveal nx-sec-head">
        <div>
          <p className="nx-eyebrow" style={{ margin: "0 0 14px" }}>01 — Shop by space</p>
          <h2 className="nx-h2">Every room, <span style={{ fontStyle: "italic" }}>considered.</span></h2>
        </div>
        <p style={{ margin: 0, maxWidth: 340, fontSize: 15, lineHeight: 1.7, color: "#4A4B47" }}>Eight worlds of natural materials and quiet forms — find where your next piece belongs.</p>
      </div>
      <div className="nx-cats">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`} className={`nx-cat nx-zoom nx-reveal ${c.span ?? ""}`} style={{ borderRadius: 4, background: c.bg, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24 }}>
            <div className="nx-art" style={{ position: "absolute", inset: c.inset }}><ProductArt kind={c.kind} fill={c.fill} /></div>
            <div className="nx-cat-label" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="nx-f" style={{ fontSize: c.size, lineHeight: 1, letterSpacing: "-.01em" }}>{c.name}</span>
                <span style={{ fontSize: 12.5, color: "#4A4B47" }}>{c.sub}</span>
              </div>
              <span className="nx-cat-arrow" style={{ width: 44, height: 44, flex: "none", borderRadius: 99, background: "#222321", color: "#F8F5EF", display: "flex", alignItems: "center", justifyContent: "center" }}><IconArrowUpRight /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
