"use client";
import { useState } from "react";
import { getProduct } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";
import { useShop } from "@/store/shop";
import { ProductArt } from "@/components/ProductArt";
import { IconArrowRight } from "@/components/icons";

type Box = React.CSSProperties;
const a = (s: Box): Box => ({ position: "absolute", ...s });

const SPOTS = [
  { id: "halden", x: 48, y: 64, tx: "24px" },
  { id: "orla", x: 80, y: 66, tx: "calc(-100% - 24px)" },
  { id: "sorrel", x: 20, y: 36, tx: "24px" },
  { id: "mira", x: 93, y: 62, tx: "calc(-100% - 24px)" },
];

function RoomScene() {
  return (<>
    <div style={a({ inset: 0, background: "linear-gradient(180deg, #74816F 0%, #67745F 72%)" })} />
    <div style={a({ left: "8%", top: "10%", width: "22%", height: "44%", borderRadius: 4, background: "#E9DFD0", boxShadow: "inset 0 0 0 10px #D9CBB6" })}><div style={a({ inset: "24% 18%", borderRadius: "99px 99px 0 0", background: "#C68C70", opacity: 0.85 })} /></div>
    <div style={a({ left: 0, right: 0, bottom: 0, height: "26%", background: "#B89B7A" })} />
    <div style={a({ left: 0, right: 0, bottom: "26%", height: "2%", background: "#F1E8DA", opacity: 0.6 })} />
    <div style={a({ left: "26%", right: "22%", bottom: "5%", height: "10%", borderRadius: "50%", background: "#CDB79A" })} />
    <div style={a({ left: "30%", width: "36%", bottom: "20%", height: "20%", borderRadius: "30px 30px 8px 8px", background: "#F1E8DA" })} />
    <div style={a({ left: "28%", width: "40%", bottom: "13%", height: "10%", borderRadius: 18, background: "#E6DACA" })} />
    <div style={a({ left: "27%", width: "4%", bottom: "13%", height: "17%", borderRadius: 30, background: "#F1E8DA" })} />
    <div style={a({ left: "65%", width: "4%", bottom: "13%", height: "17%", borderRadius: 30, background: "#F1E8DA" })} />
    <div style={a({ left: "36%", width: "6%", bottom: "26%", height: "11%", borderRadius: 14, background: "#788575", transform: "rotate(-6deg)" })} />
    <div style={a({ left: "73%", width: "14%", bottom: "13%", height: "30%", borderRadius: "60px 60px 14px 14px", background: "#C68C70" })} />
    <div style={a({ left: "71.5%", width: "17%", bottom: "13%", height: "12%", borderRadius: 22, background: "#B97D61" })} />
    <div style={a({ left: "20%", width: 2, bottom: "13%", height: "46%", background: "#222321" })} />
    <div style={a({ left: "calc(20% - 38px)", bottom: "57%", width: 78, height: 50, clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)", background: "#E9DFD0" })} />
    <div style={a({ left: "calc(20% - 110px)", bottom: "34%", width: 220, height: 160, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,236,200,.35), rgba(255,236,200,0))" })} />
    <div style={a({ left: "calc(20% - 24px)", bottom: "12%", width: 50, height: 8, borderRadius: "50%", background: "#222321" })} />
    <div style={a({ left: "89%", width: "8%", bottom: "30%", height: "2%", borderRadius: "50%", background: "#8A6B52" })} />
    <div style={a({ left: "92.6%", width: 2, bottom: "13%", height: "17%", background: "#6B523E" })} />
    <div style={a({ left: "90.6%", width: "4.4%", bottom: "31%", height: "10%", borderRadius: "40% 40% 46% 46%", background: "#222321" })} />
  </>);
}

export function ShopTheRoom() {
  const [open, setOpen] = useState<string | null>(null);
  const add = useShop((s) => s.add), say = useShop((s) => s.say), quick = useShop((s) => s.openQuick);
  const spot = SPOTS.find((s) => s.id === open);
  const sp = spot ? getProduct(spot.id) : undefined;
  const total = SPOTS.reduce((t, s) => t + (getProduct(s.id)?.price ?? 0), 0);

  return (
    <section id="room" style={{ marginTop: 120, background: "#2A2B28", color: "#F8F5EF", padding: "120px 0" }}>
      <div className="nx-wrap">
        <div className="nx-reveal nx-sec-head">
          <div>
            <p className="nx-eyebrow" style={{ margin: "0 0 14px", color: "#C9D1C6" }}>03 — Shop the room</p>
            <h2 className="nx-h2">The Sage <span style={{ fontStyle: "italic", color: "#E2B49C" }}>Reading Corner</span></h2>
          </div>
          <p style={{ margin: 0, maxWidth: 360, fontSize: 15, lineHeight: 1.7, color: "#CFCBC2" }}>Tap the markers to explore each piece. Everything you see is ready to ship.</p>
        </div>
        <div className="nx-reveal nx-roomscene" style={{ position: "relative", aspectRatio: "16 / 9", minHeight: 420, borderRadius: 4, overflow: "hidden", background: "#6E7B6B" }}>
          <RoomScene />
          {SPOTS.map((s) => {
            const p = getProduct(s.id);
            return <button key={s.id} className="nx-spot" aria-label={`View ${p?.name}`} aria-expanded={open === s.id} onClick={() => setOpen(open === s.id ? null : s.id)} style={{ left: `${s.x}%`, top: `${s.y}%` }}><span /></button>;
          })}
          {spot && sp && (
            <div key={spot.id} className="nx-pop nx-spotcard" style={{ position: "absolute", left: `${spot.x}%`, top: `${spot.y}%`, transform: `translate(${spot.tx}, -50%)`, width: 300, background: "#F8F5EF", color: "#222321", borderRadius: 6, padding: 14, display: "flex", gap: 14, alignItems: "center", boxShadow: "0 30px 60px rgba(0,0,0,.3)" }}>
              <div style={{ width: 84, height: 84, flex: "none", borderRadius: 4, background: sp.bg, padding: 8 }}><ProductArt kind={sp.kind} fill={sp.colors[0].hex} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
                <span className="nx-f" style={{ fontSize: 18, lineHeight: 1.15 }}>{sp.name}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{formatBDT(sp.price)}</span>
                <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
                  <button onClick={() => { add(sp.id); say(`${sp.name} added to your bag`); }} style={{ border: 0, background: "none", padding: "6px 0", cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: 4 }}>Add to bag</button>
                  <button onClick={() => quick(sp.id)} style={{ border: 0, background: "none", padding: "6px 0", cursor: "pointer", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#4A4B47" }}>Details</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "#CFCBC2" }}>4 pieces · Complete the look for <strong style={{ color: "#F8F5EF" }}>{formatBDT(total)}</strong></span>
          <button className="nx-btn nx-light" onClick={() => { SPOTS.forEach((s) => add(s.id)); say("The Reading Corner — 4 pieces added to your bag"); }}>Add all to bag <IconArrowRight /></button>
        </div>
      </div>
    </section>
  );
}
