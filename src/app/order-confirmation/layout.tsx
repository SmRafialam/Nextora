import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { IconUser } from "@/components/icons";

export default function ConfirmationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{ borderBottom: "1px solid rgba(34,35,33,.08)" }}>
        <div className="nx-wrap" style={{ height: 76, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <Link href="/" aria-label="Nestora home"><span className="nx-f" style={{ fontSize: 25, letterSpacing: ".32em" }}>NEST<span style={{ fontStyle: "italic", color: "#9A5B40" }}>O</span>RA</span></Link>
          <Link href="/account" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}><IconUser size={18} />My account</Link>
        </div>
      </header>
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
