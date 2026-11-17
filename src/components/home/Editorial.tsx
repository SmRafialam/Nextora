import Link from "next/link";
import { ProductArt } from "@/components/ProductArt";

const VALUES = [["Natural", "Solid oak, linen, stoneware, rattan."], ["Considered", "Designed to sit well together."], ["Lasting", "Made to be lived in, for years."]];

export function Editorial() {
  return (
    <section id="story" className="nx-wrap" style={{ paddingTop: 140, paddingBottom: 40 }}>
      <div className="nx-split">
        <div className="nx-reveal nx-zoom" style={{ gridColumn: "1 / span 6", aspectRatio: "4 / 5", borderRadius: 4, background: "#E9DFD0" }}>
          <div className="nx-art" style={{ position: "absolute", inset: 0 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "30%", background: "#D3C1A8" }} />
            <div style={{ position: "absolute", left: "14%", right: "14%", top: "10%", height: "58%", borderRadius: "999px 999px 0 0", background: "#F8F5EF" }} />
            <div style={{ position: "absolute", left: "22%", right: "22%", bottom: "12%", height: "30%" }}><ProductArt kind="table" fill="#B89B7A" /></div>
            <div style={{ position: "absolute", left: "40%", width: "20%", bottom: "33%", height: "22%" }}><ProductArt kind="vase" fill="#C68C70" /></div>
          </div>
        </div>
        <div className="nx-reveal" style={{ gridColumn: "8 / span 5", display: "flex", flexDirection: "column", gap: 28 }}>
          <p className="nx-eyebrow" style={{ margin: 0 }}>04 — Our philosophy</p>
          <h2 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(48px, 6vw, 96px)", lineHeight: 0.95, letterSpacing: "-.035em" }}>Beautiful Spaces. <span style={{ fontStyle: "italic", color: "#9A5B40" }}>Better Living.</span></h2>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75, color: "#45463F" }}>We believe a home should slow you down. Every Nestora piece is chosen for honest materials, quiet proportions and the kind of craft that gets better with every year you live with it.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20, borderTop: "1px solid rgba(34,35,33,.15)", paddingTop: 24 }}>
            {VALUES.map(([t, d]) => (
              <div key={t} style={{ display: "flex", flexDirection: "column", gap: 6 }}><span className="nx-f" style={{ fontSize: 20 }}>{t}</span><span style={{ fontSize: 13, lineHeight: 1.5, color: "#5C5D59" }}>{d}</span></div>
            ))}
          </div>
          <Link className="nx-link" href="/about" style={{ alignSelf: "flex-start", fontWeight: 600 }}>Read our story</Link>
        </div>
      </div>
    </section>
  );
}
