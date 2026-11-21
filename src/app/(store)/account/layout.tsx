import type { Metadata } from "next";
import { db } from "@/server/db";
import { requireUser } from "@/server/account";
import { logoutAction } from "@/app/(auth)/actions";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata: Metadata = { title: { default: "Your account", template: "%s — Nestora" }, robots: { index: false } };

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const u = await requireUser();
  const [orders, addresses] = await Promise.all([db.order.count({ where: { userId: u.id } }), db.address.count({ where: { userId: u.id } })]);
  const first = (u.name ?? u.email).split(" ")[0];
  return (
    <section className="nx-wrap" style={{ paddingTop: 64, paddingBottom: 120 }}>
      <div className="nx-rise" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="nx-eyebrow">Member since {u.createdAt.getFullYear()}</span>
          <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-.035em" }}>Hello, <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{first}</span></h1>
        </div>
        <form action={logoutAction}><button type="submit" style={{ border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, padding: "10px 0" }}>Sign out</button></form>
      </div>
      <div className="nx-acct">
        <AccountNav orders={orders} addresses={addresses} />
        <div className="nx-body">{children}</div>
      </div>
    </section>
  );
}
