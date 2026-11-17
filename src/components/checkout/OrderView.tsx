import Link from "next/link";
import { formatBDT } from "@/lib/format";
import type { PricedLine } from "@/lib/pricing";
import { ProductArt } from "@/components/ProductArt";
import { CopyChip } from "./CopyChip";

export type OrderSummary = {
  no: string;
  sample?: boolean;
  placedAt: Date;
  name: string;
  email: string;
  phone: string;
  address: string;
  pay: "cod" | "bkash" | "nagad" | "card";
  shipId: "std" | "exp" | "out";
  shipName: string;
  lines: PricedLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

const PAYS = {
  cod: ["Cash on delivery", "Please have the exact amount ready when your order arrives."],
  bkash: ["bKash", "Payment approved in the bKash app."],
  nagad: ["Nagad", "Payment approved in the Nagad app."],
  card: ["Card", "Paid securely through SSLCommerz."],
} as const;

const fmtD = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Dhaka" });

export function OrderView({ o }: { o: OrderSummary }) {
  const heavy = o.lines.some((l) => l.p.price >= 20000);
  const days = o.shipId === "exp" ? 1 : o.shipId === "out" ? 7 : heavy ? 5 : 2;
  const eta = new Date(o.placedAt.getTime() + days * 864e5);
  const pay = PAYS[o.pay];
  const steps = [["Confirmed", "Today"], ["Being prepared", "Within 24 hours"], ["On its way", "We will text you"], ["Delivered", fmtD(eta).split(",")[0]]];
  const first = o.name.split(" ")[0] || "friend";

  return (
    <>
      <section className="nx-wrap" style={{ paddingTop: 80, paddingBottom: 56 }}>
        <div className="nx-rise" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 22 }}>
          <span style={{ width: 72, height: 72, borderRadius: 99, background: "#5E6A5B", color: "#F8F5EF", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path className="nx-draw" d="M5 12l5 5 9-10" /></svg></span>
          <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(52px, 7.6vw, 120px)", lineHeight: 0.9, letterSpacing: "-.04em" }}>Thank you, <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{first}.</span></h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 17, lineHeight: 1.7, color: "#45463F" }}>Your order is confirmed and our team is preparing it with care. A confirmation has been sent to {o.email}.</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 10px 10px 18px", borderRadius: 99, background: "#FFFFFF", fontSize: 14 }}>Order <strong>{o.no}</strong><CopyChip text={o.no} /></span>
            {o.sample && <span style={{ fontSize: 12.5, color: "#5C5D59" }}>Sample order for preview — real orders appear here once ordering is switched on.</span>}
          </div>
        </div>
      </section>

      <section className="nx-wrap" style={{ paddingBottom: 56 }}>
        <div className="nx-reveal" style={{ background: "#FFFFFF", borderRadius: 6, padding: "clamp(24px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Estimated arrival</span><span className="nx-f" style={{ fontSize: 34, fontWeight: 300 }}>{fmtD(eta)}</span></div>
            <span style={{ fontSize: 13, color: "#5C5D59" }}>{o.shipName}</span>
          </div>
          <ol className="nx-steps" aria-label="Order progress" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {steps.map(([label, note], i) => (
              <li key={label} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ height: 4, borderRadius: 4, background: "rgba(34,35,33,.1)", overflow: "hidden" }}><div style={{ height: 4, width: i === 0 ? "100%" : i === 1 ? "35%" : "0%", background: "#5E6A5B", transition: "width 1s var(--nx-ease)" }} /></div>
                <span style={{ fontSize: 14, fontWeight: i <= 1 ? 600 : 400, color: i <= 1 ? "#222321" : "#5C5D59" }}>{label}</span>
                <span style={{ fontSize: 12.5, color: "#5C5D59" }}>{note}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="nx-wrap nx-main-aside" style={{ paddingBottom: 72 }}>
        <div className="nx-reveal">
          <h2 className="nx-f" style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 400 }}>Your pieces</h2>
          {o.lines.map((l) => (
            <div key={`${l.id}-${l.c}`} style={{ display: "flex", gap: 18, alignItems: "center", padding: "20px 0", borderBottom: "1px solid rgba(34,35,33,.1)" }}>
              <span style={{ width: 96, height: 110, flex: "none", borderRadius: 4, background: l.p.bg, padding: 12, display: "block" }}><ProductArt kind={l.p.kind} fill={l.color.hex} /></span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}><span className="nx-f" style={{ fontSize: 20 }}>{l.p.name}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{l.color.name} · Qty {l.q}</span></span>
              <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(l.total)}</span>
            </div>
          ))}
        </div>
        <aside className="nx-reveal" style={{ background: "#FFFFFF", borderRadius: 6, padding: 28, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
          <h2 className="nx-f" style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 400 }}>Summary</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{formatBDT(o.subtotal)}</span></div>
          {o.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#5E6A5B" }}><span>Promo</span><span>− {formatBDT(o.discount)}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span><span>{o.shipping ? formatBDT(o.shipping) : "Free"}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 14, marginTop: 4 }}><span style={{ fontWeight: 600 }}>{o.pay === "cod" ? "Due on delivery" : "Total paid"}</span><span className="nx-f" style={{ fontSize: 30 }}>{formatBDT(o.total)}</span></div>
        </aside>
      </section>

      <section className="nx-wrap" style={{ paddingBottom: 72 }}>
        <div className="nx-info">
          <div className="nx-reveal" style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Delivering to</span><span style={{ fontSize: 15, fontWeight: 600 }}>{o.name}</span><span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>{o.address}<br />{o.phone}</span></div>
          <div className="nx-reveal" style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Payment</span><span style={{ fontSize: 15, fontWeight: 600 }}>{pay[0]}</span><span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>{pay[1]}</span></div>
          <div className="nx-reveal" style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Need help?</span><span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>Change your delivery time or ask a question about your order.</span><Link href="/contact" style={{ fontSize: 14, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>Contact us</Link></div>
        </div>
      </section>

      <section style={{ background: "#EFE9DF", padding: "96px 0" }}>
        <div className="nx-wrap nx-reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 28 }}>
          <h2 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(36px, 4.4vw, 60px)", lineHeight: 1, letterSpacing: "-.025em" }}>While you wait, <span style={{ fontStyle: "italic" }}>find its companions.</span></h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Link className="nx-btn" href="/shop">Continue shopping</Link><Link className="nx-btn nx-ghost" href="/account/orders">View my orders</Link></div>
        </div>
      </section>
    </>
  );
}
