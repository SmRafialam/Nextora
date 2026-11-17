import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBDT } from "@/lib/format";
import { ORDER_STEPS, SAMPLE_ADDRESSES, SAMPLE_ORDERS, SAMPLE_USER, fmtDate, getSampleOrder, statusPill } from "@/lib/sampleAccount";
import { BuyAgain } from "@/components/account/OrderBits";
import { ProductArt } from "@/components/ProductArt";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SAMPLE_ORDERS.map((o) => ({ id: o.no }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Order ${(await params).id}` };
}

export default async function OrderDetailPage({ params }: Props) {
  const o = getSampleOrder((await params).id);
  if (!o) notFound();
  const li = ORDER_STEPS.indexOf(o.status);
  const addr = SAMPLE_ADDRESSES.find((a) => a.isDefault)!;
  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Link href="/account/orders" style={{ fontSize: 13, color: "#5C5D59" }}>← All orders</Link>
      <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><h2 className="nx-f" style={{ margin: 0, fontSize: 30, fontWeight: 400 }}>Order {o.no}</h2><span style={{ fontSize: 13, color: "#5C5D59" }}>Placed {fmtDate(o.placedAt)} · {o.shipping.label}</span></div>
          <span style={{ padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, ...statusPill(o.status) }}>{o.status}</span>
        </div>
        <ol className="nx-steps" aria-label="Order progress" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {ORDER_STEPS.map((l, i) => (
            <li key={l} style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={{ height: 4, borderRadius: 4, background: i <= li ? "#5E6A5B" : "rgba(34,35,33,.12)" }} /><span style={{ fontSize: 13, fontWeight: i === li ? 600 : 400, color: i <= li ? "#222321" : "#5C5D59" }}>{l}</span></li>
          ))}
        </ol>
      </div>
      <div className="nx-panel">
        <h3 className="nx-f" style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 400 }}>Pieces</h3>
        {o.lines.map((l) => (
          <div key={`${l.id}-${l.c}`} style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(34,35,33,.1)" }}>
            <Link href={`/product/${l.p.slug}`} aria-label={l.p.name} style={{ width: 72, height: 84, flex: "none", borderRadius: 4, background: l.p.bg, padding: 10, display: "block" }}><ProductArt kind={l.p.kind} fill={l.color.hex} /></Link>
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}><span className="nx-f" style={{ fontSize: 19 }}>{l.p.name}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{l.color.name} · Qty {l.q}</span></span>
            <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(l.total)}</span>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 16, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{formatBDT(o.subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span><span>{o.shipping.price ? formatBDT(o.shipping.price) : "Free"}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 12 }}><span style={{ fontWeight: 600 }}>Paid on delivery</span><span className="nx-f" style={{ fontSize: 28 }}>{formatBDT(o.total)}</span></div>
        </div>
      </div>
      <div className="nx-info">
        <div style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Delivered to</span><span style={{ fontSize: 15, fontWeight: 600 }}>{SAMPLE_USER.name}</span><span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>{addr.line}<br />{SAMPLE_USER.phone}</span></div>
        <div style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Payment</span><span style={{ fontSize: 15, fontWeight: 600 }}>Cash on delivery</span></div>
        <div style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Need help?</span><Link href="/contact" style={{ fontSize: 14, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>Contact us</Link><BuyAgain items={o.items} /></div>
      </div>
    </div>
  );
}
