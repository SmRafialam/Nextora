import Link from "next/link";

const POLICIES = [
  { href: "/shipping-policy", label: "Delivery" },
  { href: "/return-policy", label: "Returns" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

// No policy pages exist in the design, so they reuse its type scale, eyebrow, pills and accents.
export function PolicyPage({ eyebrow, title, italic, intro, updated, current, children }: {
  eyebrow: string; title: string; italic: string; intro: string; updated: string; current: string; children: React.ReactNode;
}) {
  return (
    <>
      <section className="nx-wrap" style={{ paddingTop: 80, paddingBottom: 48 }}>
        <div className="nx-rise" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <span className="nx-eyebrow">{eyebrow}</span>
          <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(52px, 7vw, 108px)", lineHeight: 0.92, letterSpacing: "-.04em" }}>{title} <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{italic}</span></h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 17, lineHeight: 1.7, color: "#45463F" }}>{intro}</p>
          <nav aria-label="Policies" className="nx-pills" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {POLICIES.map((p) => <Link key={p.href} href={p.href} className="nx-pill" aria-current={p.href === current ? "page" : undefined}>{p.label}</Link>)}
          </nav>
        </div>
      </section>
      <section className="nx-wrap" style={{ paddingBottom: 120 }}>
        <div className="nx-prose" style={{ borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 8 }}>
          {children}
          <p style={{ marginTop: 56, fontSize: 13, color: "#5C5D59" }}>Last updated {updated}. Questions? <Link href="/contact">Contact us</Link>.</p>
        </div>
      </section>
    </>
  );
}
