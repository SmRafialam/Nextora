import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ArtKind } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";
import { STEPS, fmtDate, getUserOrder, requireUser, statusView, taka } from "@/server/account";
import { orderLines } from "@/server/orderView";
import { BuyAgain } from "@/components/account/OrderBits";
import { ProductArt } from "@/components/ProductArt";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Order ${(await params).id}` };
}

const PAY: Record<string, string> = { COD: "Cash on delivery", BKASH: "bKash", NAGAD: "Nagad", SSLCOMMERZ: "Card (SSLCommerz)" };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const u = await requireUser(`/account/orders/${id}`);
  const o = await getUserOrder(u.id, id); // only the owner's orders are found
  if (!o) notFound();
  const sv = statusView(o.status);
  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Link href="/account/orders" style={{ fontSize: 13, color: "#5C5D59" }}>← All orders</Link>
      <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><h2 className="nx-f" style={{ margin: 0, fontSize: 30, fontWeight: 400 }}>Order {o.number}</h2><span style={{ fontSize: 13, color: "#5C5D59" }}>Placed {fmtDate(o.createdAt)} · {o.shipMethod}</span></div>
          <span style={{ padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, ...sv.pill }}>{sv.label}</span>
        </div>
        <ol className="nx-steps" aria-label="Order progress" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {STEPS.map((l, i) => (
            <li key={l} style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={{ height: 4, borderRadius: 4, background: i <= sv.step ? "#5E6A5B" : "rgba(34,35,33,.12)" }} /><span style={{ fontSize: 13, fontWeight: i === sv.step ? 600 : 400, color: i <= sv.step ? "#222321" : "#5C5D59" }}>{l}</span></li>
          ))}
        </ol>
      </div>
      <div className="nx-panel">
        <h3 className="nx-f" style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 400 }}>Pieces</h3>
        {o.items.map((i) => (
          <div key={i.id} style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 0", borderBottom: "1px solid rgba(34,35,33,.1)" }}>
            <Link href={`/product/${i.variant.product.slug}`} aria-label={i.productName} style={{ width: 72, height: 84, flex: "none", borderRadius: 4, background: i.variant.product.bg, padding: 10, display: "block" }}><ProductArt kind={i.variant.product.artKind as ArtKind} fill={i.variant.colorHex} /></Link>
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}><span className="nx-f" style={{ fontSize: 19 }}>{i.productName}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{i.colorName} · Qty {i.quantity}</span></span>
            <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(taka(i.unitPricePaisa * i.quantity))}</span>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 16, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{formatBDT(taka(o.subtotalPaisa))}</span></div>
          {o.discountPaisa > 0 && <div style={{ display: "flex", justifyContent: "space-between", color: "#5E6A5B" }}><span>Promo {o.couponCode}</span><span>− {formatBDT(taka(o.discountPaisa))}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery</span><span>{o.shippingPaisa ? formatBDT(taka(o.shippingPaisa)) : "Free"}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px solid rgba(34,35,33,.12)", paddingTop: 12 }}><span style={{ fontWeight: 600 }}>{o.paymentStatus === "PAID" ? "Total paid" : "Total"}</span><span className="nx-f" style={{ fontSize: 28 }}>{formatBDT(taka(o.totalPaisa))}</span></div>
        </div>
      </div>
      <div className="nx-info">
        <div style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Delivering to</span><span style={{ fontSize: 15, fontWeight: 600 }}>{o.name}</span><span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>{o.addressLine}, {o.area}, {o.district}<br />{o.phone}</span></div>
        <div style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Payment</span><span style={{ fontSize: 15, fontWeight: 600 }}>{PAY[o.paymentMethod]}</span><span style={{ fontSize: 14, color: "#45463F" }}>{o.paymentStatus === "PAID" ? "Paid" : o.paymentMethod === "COD" ? "Due on delivery" : "Not yet paid"}</span></div>
        <div style={{ borderTop: "1px solid #222321", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Need help?</span><Link href={`/contact?topic=order`} style={{ fontSize: 14, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>Contact us</Link><BuyAgain items={orderLines(o)} /></div>
      </div>
    </div>
  );
}
