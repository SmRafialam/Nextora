import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { QuickViewChip } from "./QuickViewChip";

type Box = React.CSSProperties;
const a = (s: Box): Box => ({ position: "absolute", ...s });

/** Illustrated living room — composed in CSS so the hero paints instantly (no LCP image). */
function HeroScene() {
  return (
    <div className="nx-scene" style={a({ inset: 0 })}>
      <div className="nx-par" style={a({ inset: "-60px 0 0 0" })}>
        <div style={a({ inset: 0, background: "linear-gradient(180deg, #EFE6D8 0%, #E6D9C7 76%)" })} />
        <div style={a({ right: "9%", top: "13%", width: "25%", height: "56%", borderRadius: "999px 999px 4px 4px", background: "linear-gradient(180deg, #FFFEFA 0%, #F6EEE1 100%)", boxShadow: "inset 0 0 0 12px #EFE5D5, 0 40px 90px rgba(120,96,64,.18)" })}>
          <div style={a({ left: "50%", top: 12, bottom: 12, width: 1, background: "#D9CBB6" })} />
          <div style={a({ left: 12, right: 12, top: "58%", height: 1, background: "#D9CBB6" })} />
        </div>
        <div style={a({ left: 0, right: 0, bottom: 0, height: "25%", background: "linear-gradient(180deg, #D3C1A8, #CDB99E)" })} />
        <div style={a({ right: 0, bottom: 0, width: "56%", height: "25%", background: "rgba(255,251,242,.5)", clipPath: "polygon(38% 0, 70% 0, 100% 100%, 8% 100%)", filter: "blur(10px)" })} />
        <div style={a({ left: "30%", right: "8%", bottom: "4%", height: "10%", borderRadius: "50%", background: "#E4D6C1" })} />
        <div style={a({ left: "63%", top: 0, width: 1, height: "21%", background: "#222321" })} />
        <div style={a({ left: "calc(63% - 64px)", top: "21%", width: 128, height: 64, borderRadius: "128px 128px 0 0", background: "#222321" })} />
        <div style={a({ left: "calc(63% - 120px)", top: "calc(21% + 60px)", width: 240, height: 120, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,240,210,.7), rgba(255,240,210,0))" })} />
        <div style={a({ left: "39%", width: "44%", bottom: "19%", height: "21%", borderRadius: "44px 44px 10px 10px", background: "#8E9A89" })} />
        <div style={a({ left: "37%", width: "48%", bottom: "12%", height: "11%", borderRadius: 22, background: "#7E8B79" })} />
        <div style={a({ left: "35.5%", width: "4.5%", bottom: "12%", height: "19%", borderRadius: 40, background: "#8E9A89" })} />
        <div style={a({ left: "82%", width: "4.5%", bottom: "12%", height: "19%", borderRadius: 40, background: "#8E9A89" })} />
        <div style={a({ left: "44%", width: "7%", bottom: "25%", height: "12%", borderRadius: 16, background: "#C68C70", transform: "rotate(-8deg)" })} />
        <div style={a({ left: "52%", width: "6.5%", bottom: "24.5%", height: "11%", borderRadius: 16, background: "#F1E8DA", transform: "rotate(5deg)" })} />
        <div style={a({ left: "40%", width: 3, bottom: "8%", height: "4%", background: "#4A4B47" })} />
        <div style={a({ left: "83%", width: 3, bottom: "8%", height: "4%", background: "#4A4B47" })} />
        <div style={a({ left: "88%", width: "9%", bottom: "25%", height: "2%", borderRadius: "50%", background: "#A9876A" })} />
        <div style={a({ left: "92.4%", width: 2, bottom: "8%", height: "17%", background: "#8A6B52" })} />
        <div style={a({ left: "90%", width: "5%", bottom: "26%", height: "9%", borderRadius: "40% 40% 46% 46%", background: "#F3ECE1" })} />
        <div style={a({ left: "92.3%", width: 1, bottom: "34%", height: "12%", background: "#5E6A5B", transform: "rotate(10deg)", transformOrigin: "bottom" })} />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" style={{ position: "relative", minHeight: 760, overflow: "hidden", background: "#E9DFD0" }}>
      <HeroScene />
      <div className="nx-heroveil" style={a({ inset: 0, background: "linear-gradient(90deg, rgba(248,245,239,.97) 0%, rgba(248,245,239,.86) 30%, rgba(248,245,239,0) 58%)" })} />
      <div className="nx-wrap" style={{ position: "relative", minHeight: 760, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 72, paddingBottom: 120 }}>
        <p className="nx-rise" style={{ margin: "0 0 28px", fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#5E6A5B", display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 36, height: 1, background: "#5E6A5B" }} />Autumn / Winter Collection</p>
        <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(60px, 9.4vw, 152px)", lineHeight: 0.9, letterSpacing: "-.035em" }}>
          <span className="nx-mask"><span className="d1">Your Space.</span></span>
          <span className="nx-mask"><span className="d2" style={{ fontStyle: "italic", color: "#9A5B40", paddingLeft: ".5em" }}>Your Story.</span></span>
        </h1>
        <p className="nx-rise d3" style={{ margin: "34px 0 0", maxWidth: 430, fontSize: 17, lineHeight: 1.65, color: "#45463F" }}>Discover thoughtfully curated pieces that turn everyday spaces into extraordinary places.</p>
        <div className="nx-rise d4" style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link className="nx-btn" href="/shop">Explore Collection <IconArrowRight /></Link>
          <a className="nx-btn nx-ghost" href="#room">Shop the Room</a>
        </div>
      </div>
      <div className="nx-wrap nx-rise d4" style={{ position: "absolute", left: 0, right: 0, bottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "none" }}>
        <a href="#categories" style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 14, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#45463F" }}><span className="nx-scroll" />Scroll to discover</a>
        <QuickViewChip />
      </div>
    </section>
  );
}
