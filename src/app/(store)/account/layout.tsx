import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE_ADDRESSES, SAMPLE_ORDERS, SAMPLE_USER } from "@/lib/sampleAccount";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata: Metadata = { title: { default: "Your account", template: "%s — Nestora" }, robots: { index: false } };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const first = SAMPLE_USER.name.split(" ")[0];
  return (
    <section className="nx-wrap" style={{ paddingTop: 64, paddingBottom: 120 }}>
      <p role="note" style={{ margin: "0 0 32px", padding: "12px 16px", borderRadius: 6, background: "#EFE9DF", fontSize: 13.5, lineHeight: 1.6 }}>
        <strong>Preview with sample data.</strong> Sign-in arrives in the accounts phase; until then these pages show an example customer, and changes here are not saved.
      </p>
      <div className="nx-rise" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="nx-eyebrow">Member since {SAMPLE_USER.since}</span>
          <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-.035em" }}>Hello, <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{first}</span></h1>
        </div>
        <Link href="/login" style={{ fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, padding: "10px 0" }}>Sign out</Link>
      </div>
      <div className="nx-acct">
        <AccountNav orders={SAMPLE_ORDERS.length} addresses={SAMPLE_ADDRESSES.length} />
        <div className="nx-body">{children}</div>
      </div>
    </section>
  );
}
