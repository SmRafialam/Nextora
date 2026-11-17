"use client";
import Link from "next/link";
import { PRODUCTS } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { useShop } from "@/store/shop";
import { ProductArt } from "@/components/ProductArt";
import { IconClose, IconHeart } from "@/components/icons";

export function WishlistView() {
  const mounted = useMounted();
  const wish = useShop((s) => s.wish);
  const { add, say, setWish, toggleWish } = useShop();
  const saved = mounted ? PRODUCTS.filter((p) => wish[p.id]) : [];
  const suggest = PRODUCTS.filter((p) => !(mounted && wish[p.id])).slice(0, 4);
  const drop = (id: string) => { const w = { ...useShop.getState().wish }; delete w[id]; setWish(w); };

  const share = async () => {
    // The list lives in this browser until accounts sync it (Phase 5), so share the product links themselves.
    const text = saved.map((p) => `${p.name} — ${window.location.origin}/product/${p.slug}`).join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "My Nestora wishlist", text });
      else { await navigator.clipboard.writeText(text); say("Wishlist links copied"); }
    } catch { /* share sheet dismissed */ }
  };
  const moveAll = () => { saved.forEach((p) => add(p.id)); setWish({}); say(`${saved.length} ${saved.length === 1 ? "piece" : "pieces"} moved to your bag`); };

  return (
    <>
      <section className="nx-wrap" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="nx-rise" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, borderBottom: "1px solid rgba(34,35,33,.12)", paddingBottom: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="nx-eyebrow">Saved for later</span>
            <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(52px, 7vw, 104px)", lineHeight: 0.92, letterSpacing: "-.035em" }}>Your <span style={{ fontStyle: "italic", color: "#9A5B40" }}>wishlist</span></h1>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
            {mounted && <span style={{ fontSize: 14, color: "#5C5D59" }}>{saved.length} {saved.length === 1 ? "piece" : "pieces"} saved</span>}
            {saved.length > 0 && (<>
              <button className="nx-btn nx-ghost" onClick={share}>Share list</button>
              <button className="nx-btn" onClick={moveAll}>Move all to bag</button>
            </>)}
          </div>
        </div>
      </section>

      <section className="nx-wrap" style={{ paddingBottom: 120 }}>
        {!mounted && (
          <div className="nx-grid4" style={{ marginTop: 40 }}>{[1, 2, 3, 4].map((k) => (<div key={k} style={{ display: "flex", flexDirection: "column", gap: 12 }}><div className="nx-skel" style={{ aspectRatio: "4 / 5" }} /><div className="nx-skel" style={{ height: 18, width: "70%" }} /></div>))}</div>
        )}
        {mounted && saved.length === 0 && (
          <div className="nx-pop" style={{ padding: "72px 0 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
            <span style={{ width: 72, height: 72, borderRadius: 99, background: "#E9DFD0", display: "flex", alignItems: "center", justifyContent: "center", color: "#9A5B40" }}><IconHeart size={28} /></span>
            <span className="nx-f" style={{ fontSize: 34, fontWeight: 300, fontStyle: "italic" }}>Nothing saved yet.</span>
            <span style={{ fontSize: 15, color: "#5C5D59", maxWidth: 360, lineHeight: 1.6 }}>Tap the heart on any piece to keep it here while you decide.</span>
            <Link className="nx-btn" href="/shop" style={{ marginTop: 8 }}>Explore the collection</Link>
          </div>
        )}
        {saved.length > 0 && (
          <div className="nx-grid4" style={{ marginTop: 40 }}>
            {saved.map((p) => (
              <article key={p.id} className="nx-card nx-pop" style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
                <div className="nx-zoom" style={{ aspectRatio: "4 / 5", borderRadius: 4, background: p.bg }}>
                  <Link href={`/product/${p.slug}`} aria-label={p.name} style={{ position: "absolute", inset: 0 }}><span className="nx-art" style={{ position: "absolute", inset: "16% 12% 20%", display: "block" }}><ProductArt kind={p.kind} fill={p.colors[0].hex} /></span></Link>
                  <button className="nx-icon" aria-label={`Remove ${p.name} from wishlist`} onClick={() => { drop(p.id); say("Removed from wishlist"); }} style={{ position: "absolute", right: 8, top: 8, background: "rgba(248,245,239,.9)" }}><IconClose size={18} /></button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: 4 }}><span className="nx-f" style={{ fontSize: 19 }}>{p.name}</span><span style={{ fontSize: 13, color: "#5C5D59" }}>{p.colors[0].name}</span></span>
                  <span style={{ fontSize: 15, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(p.price)}</span>
                </div>
                <button className="nx-btn nx-ghost" onClick={() => { add(p.id); drop(p.id); say(`${p.name} moved to your bag`); }} style={{ minHeight: 46 }}>Move to bag</button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ background: "#EFE9DF", padding: "96px 0" }}>
        <div className="nx-wrap">
          <h2 className="nx-f nx-reveal" style={{ margin: "0 0 40px", fontWeight: 300, fontSize: "clamp(34px, 4vw, 52px)", letterSpacing: "-.025em" }}>You may <span style={{ fontStyle: "italic" }}>also love</span></h2>
          <div className="nx-grid4">
            {suggest.map((r) => (
              <div key={r.id} className="nx-card nx-reveal" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="nx-zoom" style={{ aspectRatio: "1 / 1", borderRadius: 4, background: r.bg }}>
                  <Link href={`/product/${r.slug}`} aria-label={r.name} style={{ position: "absolute", inset: 0 }}><span className="nx-art" style={{ position: "absolute", inset: "16%", display: "block" }}><ProductArt kind={r.kind} fill={r.colors[0].hex} /></span></Link>
                  <button className="nx-icon nx-heart" aria-label={`Save ${r.name} to wishlist`} aria-pressed={false} onClick={() => { toggleWish(r.id); say("Saved to wishlist"); }} style={{ position: "absolute", right: 8, top: 8 }}><IconHeart /></button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span className="nx-f" style={{ fontSize: 18 }}>{r.name}</span><span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(r.price)}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
