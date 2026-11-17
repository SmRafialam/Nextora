import Link from "next/link";
import { IconArrowLeft } from "@/components/icons";

// Checkout uses the design's distraction-free header: no navigation, no footer.
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{ borderBottom: "1px solid rgba(34,35,33,.08)" }}>
        <div className="nx-wrap" style={{ height: 76, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
          <Link href="/cart" aria-label="Back to bag" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}><IconArrowLeft /><span className="nx-desk">Back to bag</span></Link>
          <Link href="/" aria-label="Nestora home"><span className="nx-f" style={{ fontSize: 25, letterSpacing: ".32em", marginRight: "-.32em" }}>NEST<span style={{ fontStyle: "italic", letterSpacing: ".18em", color: "#9A5B40" }}>O</span>RA</span></Link>
          <span style={{ justifySelf: "end", display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#45463F" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></svg>
            <span className="nx-desk">Secure checkout</span>
          </span>
        </div>
      </header>
      <main id="main">{children}</main>
    </>
  );
}
