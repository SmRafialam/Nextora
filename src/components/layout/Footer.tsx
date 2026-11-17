import Link from "next/link";

const COLS: [string, [string, string][]][] = [
  ["Shop", [["All Products", "/shop"], ["New Arrivals", "/shop?sort=new"], ["Best Sellers", "/shop?sort=bestsellers"], ["Collections", "/collections"]]],
  ["Help", [["Shipping Policy", "/shipping-policy"], ["Returns", "/return-policy"], ["Your Bag", "/cart"], ["Contact", "/contact"]]],
  ["Nestora", [["Our Story", "/about"], ["My Account", "/account"], ["Privacy Policy", "/privacy-policy"], ["Terms", "/terms"]]],
];

export function Footer() {
  return (
    <footer className="nx-foot" style={{ background: "#EFE9DF", paddingTop: 88, overflow: "hidden" }}>
      <div className="nx-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="nx-f" style={{ fontSize: 26, letterSpacing: ".32em" }}>NEST<span style={{ fontStyle: "italic", color: "#9A5B40" }}>O</span>RA</span>
          <p className="nx-f" style={{ margin: 0, fontSize: 20, fontStyle: "italic", color: "#45463F", lineHeight: 1.35 }}>Make every space<br />feel like home.</p>
        </div>
        {COLS.map(([title, links]) => (
          <div key={title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "#5E6A5B", marginBottom: 4 }}>{title}</span>
            {links.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}
          </div>
        ))}
      </div>
      <div className="nx-wrap" style={{ marginTop: 72, paddingTop: 24, paddingBottom: 28, borderTop: "1px solid rgba(34,35,33,.12)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, fontSize: 12.5, color: "#5C5D59" }}>
        <span>© {new Date().getFullYear()} Nestora Home &amp; Living. All rights reserved.</span>
        <span>bKash · Nagad · Visa · Mastercard · Cash on delivery</span>
      </div>
      <div aria-hidden="true" className="nx-f" style={{ fontSize: "clamp(80px, 21vw, 320px)", lineHeight: 0.72, letterSpacing: ".06em", textAlign: "center", color: "#E4DCCF", paddingTop: 12, userSelect: "none" }}>NESTORA</div>
    </footer>
  );
}

export function AnnouncementBar() {
  return <div style={{ background: "#222321", color: "#E9DFD0", fontSize: 12, letterSpacing: ".08em", textAlign: "center", padding: "10px 16px" }}>Complimentary delivery across Dhaka on orders above ৳ 15,000 · 7-day easy returns</div>;
}
