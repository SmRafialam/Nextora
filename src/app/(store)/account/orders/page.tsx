import type { Metadata } from "next";
import Link from "next/link";
import { formatBDT } from "@/lib/format";
import { fmtDate, statusPill } from "@/lib/sampleAccount";
import { getSampleOrders } from "@/server/sampleOrders";
import { BuyAgain, Thumbs } from "@/components/account/OrderBits";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const SAMPLE_ORDERS = await getSampleOrders();
  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 className="nx-sr">Your orders</h2>
      {SAMPLE_ORDERS.map((o) => (
        <div key={o.no} className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ fontSize: 15, fontWeight: 600 }}>{o.no}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{fmtDate(o.placedAt)} · {o.count} {o.count === 1 ? "item" : "items"}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, ...statusPill(o.status) }}>{o.status}</span><span style={{ fontSize: 15, fontWeight: 600 }}>{formatBDT(o.total)}</span></div>
          </div>
          <Thumbs lines={o.lines} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Link className="nx-pill" href={`/account/orders/${o.no}`}>View details</Link><BuyAgain items={o.items} /></div>
        </div>
      ))}
    </div>
  );
}
