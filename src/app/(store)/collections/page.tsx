import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS, getProduct } from "@/lib/catalog";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated Nestora edits — pieces chosen to live well together.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <>
      <section className="nx-wrap" style={{ paddingTop: 72, paddingBottom: 48 }}>
        <div className="nx-rise" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="nx-eyebrow">Curated edits</span>
            <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(52px, 7vw, 112px)", lineHeight: 0.92, letterSpacing: "-.035em" }}>Our <span style={{ fontStyle: "italic", color: "#9A5B40" }}>collections</span></h1>
          </div>
          <p style={{ margin: 0, maxWidth: 360, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>Small groups of pieces we love together — styled once, ready to bring home as a set or one at a time.</p>
        </div>
      </section>
      <section className="nx-wrap" style={{ paddingBottom: 120, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 520px), 1fr))", gap: 24 }}>
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="nx-cat nx-zoom nx-reveal" style={{ borderRadius: 4, background: c.bg, minHeight: 440, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 28 }}>
            <div className="nx-art" style={{ position: "absolute", inset: "10% 24% 34%" }}><ProductArt kind={c.kind} fill={c.fill} /></div>
            <div className="nx-cat-label" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="nx-f" style={{ fontSize: 36, lineHeight: 1, letterSpacing: "-.02em" }}>{c.title[0]} <span style={{ fontStyle: "italic" }}>{c.title[1]}</span></span>
                <span style={{ fontSize: 13.5, color: "#4A4B47", maxWidth: 360, lineHeight: 1.55 }}>{c.intro}</span>
                <span style={{ fontSize: 12, color: "#5C5D59" }}>{c.ids.filter(getProduct).length} pieces</span>
              </div>
              <span className="nx-cat-arrow" style={{ width: 44, height: 44, flex: "none", borderRadius: 99, background: "#222321", color: "#F8F5EF", display: "flex", alignItems: "center", justifyContent: "center" }}><IconArrowUpRight /></span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
