import Link from "next/link";
import { STEPS, fmtDate, getUserOrders, requireUser, statusView } from "@/server/account";
import { orderThumbs } from "@/server/orderView";
import { EmptyPanel, Thumbs } from "@/components/account/OrderBits";
import { WishCount } from "@/components/account/AccountNav";
import { VerifyBanner } from "@/components/account/VerifyBanner";

export default async function AccountOverview() {
  const u = await requireUser();
  const orders = await getUserOrders(u.id);
  const latest = orders[0];
  const sv = latest && statusView(latest.status);
  return (
    <div className="nx-pop" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {!u.emailVerified && <VerifyBanner email={u.email} />}
      <div className="nx-stats">
        <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Orders</span><span className="nx-f" style={{ fontSize: 44, fontWeight: 300 }}>{orders.length}</span></div>
        <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 8 }}><span className="nx-eyebrow" style={{ fontSize: 11 }}>Saved pieces</span><span className="nx-f" style={{ fontSize: 44, fontWeight: 300 }}><WishCount /></span></div>
        <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 8, background: "#5E6A5B", color: "#F8F5EF" }}><span style={{ fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#DCE1DA" }}>Member offer</span><span className="nx-f" style={{ fontSize: 22, lineHeight: 1.25 }}>10% off with <strong>NESTORA10</strong></span></div>
      </div>
      {latest && sv ? (
        <div className="nx-panel" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h2 className="nx-f" style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>Latest order</h2>
            <Link href="/account/orders" style={{ fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40, display: "flex", alignItems: "center" }}>All orders</Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, fontSize: 14 }}>
            <span><strong>{latest.number}</strong> · {fmtDate(latest.createdAt)}</span>
            <span style={{ padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, ...sv.pill }}>{sv.label}</span>
          </div>
          <ol aria-label="Order progress" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            {STEPS.map((l, i) => (
              <li key={l} style={{ display: "flex", flexDirection: "column", gap: 8 }}><div style={{ height: 3, borderRadius: 3, background: i <= sv.step ? "#5E6A5B" : "rgba(34,35,33,.12)" }} /><span style={{ fontSize: 12, color: i <= sv.step ? "#222321" : "#5C5D59" }}>{l}</span></li>
            ))}
          </ol>
          <Thumbs items={orderThumbs(latest)} w={72} h={80} />
          <Link className="nx-btn nx-ghost" href={`/account/orders/${latest.number}`} style={{ alignSelf: "flex-start" }}>Track order</Link>
        </div>
      ) : (
        <EmptyPanel title="No orders yet." body="When you place an order, you can follow it here from confirmation to your door." href="/shop" cta="Explore the collection" />
      )}
    </div>
  );
}
