import Link from "next/link";
import type { ArtKind } from "@/lib/catalog";
import { ProductArt } from "@/components/ProductArt";

const GALLERY: { title: string; tag: string; kind: ArtKind; fill: string; bg: string; floor: string; col: string; row: string; inset: string; hero?: boolean }[] = [
  { title: "The Dhanmondi Apartment", tag: "Living", kind: "sofa", fill: "#C68C70", bg: "#E9DFD0", floor: "#D3C1A8", col: "1 / span 7", row: "span 5", inset: "30% 18% 14%", hero: true },
  { title: "Morning light, slow rituals", tag: "Bedroom", kind: "bed", fill: "#8E9A89", bg: "#EEE8DE", floor: "#DCCDB8", col: "8 / span 5", row: "span 3", inset: "22% 16% 20%" },
  { title: "A table for long dinners", tag: "Dining", kind: "table", fill: "#C9AE8A", bg: "#E6E3DA", floor: "#CDBBA2", col: "8 / span 5", row: "span 2", inset: "18% 30% 12%" },
  { title: "Green corners", tag: "Outdoor", kind: "plant", fill: "#C68C70", bg: "#DFE3DA", floor: "#C7BBA6", col: "1 / span 4", row: "span 3", inset: "18% 24% 14%" },
  { title: "The art of the shelf", tag: "Storage", kind: "shelf", fill: "#EFE8DC", bg: "#E3DACB", floor: "#CDB99E", col: "5 / span 8", row: "span 3", inset: "14% 38% 10%" },
];

export function Inspiration() {
  return (
    <section id="inspire" className="nx-wrap" style={{ paddingTop: 140, paddingBottom: 140 }}>
      <div className="nx-reveal" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 56 }}>
        <p className="nx-eyebrow" style={{ margin: 0 }}>06 — The Nestora Journal</p>
        <h2 className="nx-h2">Homes that <span style={{ fontStyle: "italic" }}>inspire us</span></h2>
      </div>
      <div className="nx-gallery">
        {GALLERY.map((g) => (
          <Link key={g.title} href="/collections" className={`nx-gal nx-zoom nx-reveal${g.hero ? " g-hero" : ""}`} style={{ gridColumn: g.col, gridRow: g.row, borderRadius: 4, background: g.bg, display: "flex", alignItems: "flex-end", padding: 22 }}>
            <div className="nx-art" style={{ position: "absolute", inset: 0 }}>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "28%", background: g.floor }} />
              <div style={{ position: "absolute", inset: g.inset }}><ProductArt kind={g.kind} fill={g.fill} /></div>
            </div>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4, background: "rgba(248,245,239,.9)", backdropFilter: "blur(6px)", padding: "12px 16px", borderRadius: 4 }}>
              <span style={{ fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#5E6A5B" }}>{g.tag}</span>
              <span className="nx-f" style={{ fontSize: 18 }}>{g.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
