import type { Metadata } from "next";
import Link from "next/link";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowRight } from "@/components/icons";
import { ProcessSteps } from "@/components/about/ProcessSteps";

export const metadata: Metadata = {
  title: "Our story",
  description: "Nestora makes calm, lasting furniture and home décor for the homes we actually live in — honest materials, quiet design, made to stay.",
  alternates: { canonical: "/about" },
};

const BELIEFS = [
  ["01", "Honest materials", "Solid wood instead of wrap, linen instead of plastic blends, stoneware fired to be used. Materials that age with character rather than wear out."],
  ["02", "Quiet design", "Soft lines, warm neutrals and proportions that suit apartments and family homes alike. Every collection is designed to sit well together."],
  ["03", "Made to stay", "Removable covers, replaceable parts and a craftsmanship guarantee — because the most sustainable piece is the one you never need to replace."],
];
const MATS = [
  ["Solid oak", "#C9AE8A", "repeating-linear-gradient(92deg, rgba(107,82,62,.18) 0 2px, transparent 2px 9px, rgba(255,255,255,.08) 9px 11px, transparent 11px 22px)", "Kiln-dried and finished with natural hard-wax oil."],
  ["Washed linen", "#D8CBB5", "repeating-linear-gradient(0deg, rgba(255,255,255,.14) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 1px, transparent 1px 4px)", "Breathable, softer with every wash."],
  ["Stoneware", "#C68C70", "radial-gradient(circle at 30% 30%, rgba(255,255,255,.18) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(0,0,0,.08) 0 2px, transparent 3px)", "Hand-thrown and glazed to be used every day."],
  ["Rattan", "#B89B7A", "repeating-linear-gradient(45deg, rgba(107,82,62,.22) 0 3px, transparent 3px 10px), repeating-linear-gradient(-45deg, rgba(107,82,62,.22) 0 3px, transparent 3px 10px)", "Woven by hand for light that dances."],
];

export default function AboutPage() {
  return (
    <>
      <section className="nx-wrap" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="nx-hero2">
          <div className="nx-rise" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <span className="nx-eyebrow">Our story</span>
            <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(56px, 8vw, 132px)", lineHeight: 0.9, letterSpacing: "-.04em" }}>Made for the way <span style={{ fontStyle: "italic", color: "#9A5B40" }}>you live.</span></h1>
            <p style={{ margin: 0, maxWidth: 460, fontSize: 17, lineHeight: 1.75, color: "#45463F" }}>Nestora began with a simple question: why is it so hard to find furniture that feels calm, lasts for years and suits the homes we actually live in? We are building the answer, one considered piece at a time.</p>
          </div>
          <div className="nx-rise" aria-hidden="true" style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: 4, overflow: "hidden", background: "#E9DFD0", animationDelay: ".2s" }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "30%", background: "#D3C1A8" }} />
            <div style={{ position: "absolute", left: "16%", right: "16%", top: "9%", height: "58%", borderRadius: "999px 999px 0 0", background: "#FFFDF8", boxShadow: "inset 0 0 0 12px #EFE5D5" }} />
            <div style={{ position: "absolute", left: "50%", top: "10%", bottom: "33%", width: 1, background: "#D9CBB6" }} />
            <div style={{ position: "absolute", left: "8%", right: "8%", bottom: "10%", height: "36%" }}><ProductArt kind="sofa" fill="#8E9A89" /></div>
            <div style={{ position: "absolute", right: "4%", width: "24%", bottom: "26%", height: "30%" }}><ProductArt kind="lamp" fill="#F3ECE1" /></div>
          </div>
        </div>
      </section>

      <section style={{ background: "#EFE9DF", padding: "120px 0" }}>
        <div className="nx-wrap nx-reveal" style={{ maxWidth: 1100, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
          <span className="nx-eyebrow">What we believe</span>
          <p className="nx-f" style={{ margin: 0, fontSize: "clamp(30px, 3.6vw, 52px)", fontWeight: 300, lineHeight: 1.22, letterSpacing: "-.02em" }}>A home should slow you down. It should hold your mornings, your long dinners and your quiet evenings — and it should <span style={{ fontStyle: "italic", color: "#9A5B40" }}>get better</span> the longer you live in it.</p>
        </div>
      </section>

      <section className="nx-wrap" style={{ paddingTop: 128, paddingBottom: 40 }}>
        <div className="nx-cols3">
          {BELIEFS.map(([n, t, b]) => (
            <div key={n} className="nx-reveal" style={{ display: "flex", flexDirection: "column", gap: 16, borderTop: "1px solid #222321", paddingTop: 24 }}>
              <span className="nx-f" style={{ fontSize: 15, color: "#9A5B40" }}>{n}</span>
              <h2 className="nx-f" style={{ margin: 0, fontSize: 34, fontWeight: 300, letterSpacing: "-.02em" }}>{t}</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "#45463F" }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="nx-wrap" style={{ paddingTop: 128, paddingBottom: 40 }}>
        <div className="nx-reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 48 }}>
          <h2 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1, letterSpacing: "-.025em" }}>How a piece <span style={{ fontStyle: "italic" }}>becomes Nestora</span></h2>
          <p style={{ margin: 0, maxWidth: 340, fontSize: 15, lineHeight: 1.7, color: "#4A4B47" }}>Fewer pieces, chosen carefully. Each one passes four simple tests before it reaches your home.</p>
        </div>
        <ProcessSteps />
      </section>

      <section className="nx-wrap" style={{ paddingTop: 128, paddingBottom: 128 }}>
        <h2 className="nx-f nx-reveal" style={{ margin: "0 0 40px", fontWeight: 300, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1, letterSpacing: "-.025em" }}>Our <span style={{ fontStyle: "italic" }}>materials</span></h2>
        <div className="nx-cols4">
          {MATS.map(([name, base, tex, note]) => (
            <div key={name} className="nx-mat nx-reveal" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ aspectRatio: "3 / 4", borderRadius: 4, overflow: "hidden", position: "relative" }}><div className="nx-mat-t" style={{ position: "absolute", inset: 0, backgroundColor: base, backgroundImage: tex }} /></div>
              <span className="nx-f" style={{ fontSize: 24 }}>{name}</span>
              <span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F", marginTop: -6 }}>{note}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "#2A2B28", color: "#F8F5EF", padding: "120px 0" }}>
        <div className="nx-wrap nx-reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 680 }}>
            <span style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#C9D1C6" }}>Visit us</span>
            <h2 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.95, letterSpacing: "-.03em" }}>Sit on it <span style={{ fontStyle: "italic", color: "#E2B49C" }}>before you buy it.</span></h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "#CFCBC2" }}>Book a calm, one-to-one appointment at our Dhaka showroom, or ask our stylists for free advice on your space.</p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link className="nx-btn" href="/contact?topic=visit" style={{ background: "#F8F5EF", color: "#222321" }}>Book a visit <IconArrowRight /></Link>
            <Link className="nx-btn" href="/shop" style={{ background: "transparent", boxShadow: "inset 0 0 0 1px rgba(248,245,239,.4)" }}>Shop the collection</Link>
          </div>
        </div>
      </section>
    </>
  );
}
