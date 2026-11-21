import type { Metadata } from "next";
import Link from "next/link";
import { formatBDT } from "@/lib/format";
import { fmtDate, getUserOrders, requireUser, statusView, taka } from "@/server/account";
import { itemCount, orderLines, orderThumbs } from "@/server/orderView";
import { BuyAgain, EmptyPanel, Thumbs } from "@/components/account/OrderBits";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const u = await requireUser("/account/orders");
  const orders = await getUserOrders(u.id);
  if (!orders.length) return <EmptyPanel title="No orders yet." body="Your orders and their delivery progress will appear here." href="/shop" cta="Explore the collection" />;
  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 className="nx-sr">Your orders</h2>
      {orders.map((o) => {
        const sv = statusView(o.status), n = itemCount(o);
        return (
          <div key={o.id} className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ fontSize: 15, fontWeight: 600 }}>{o.number}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{fmtDate(o.createdAt)} · {n} {n === 1 ? "item" : "items"}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, ...sv.pill }}>{sv.label}</span><span style={{ fontSize: 15, fontWeight: 600 }}>{formatBDT(taka(o.totalPaisa))}</span></div>
            </div>
            <Thumbs items={orderThumbs(o)} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Link className="nx-pill" href={`/account/orders/${o.number}`}>View details</Link><BuyAgain items={orderLines(o)} /></div>
          </div>
        );
      })}
    </div>
  );
}
