"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatBDT } from "@/lib/format";
import { useShop } from "@/store/shop";
import { IconArrowRight } from "@/components/icons";
import type { HeroScene } from "./scene";

export type HeroPiece = { id: string; slug: string; name: string; meta: string; price: number };

type Stage = { key: string; eyebrow: string; body: string; piece?: HeroPiece };

/**
 * Opening 3D scroll hero. The section is several screens tall; the 3D room stays pinned while
 * scrolling moves the camera from the whole room to the Orla chair, then the Sorrel lamp (which
 * switches on), then the Halden sofa. Three.js loads after first paint; the headline is server-rendered.
 * Reduced motion or no WebGL: the illustrated static hero (`fallback`) is shown instead.
 */
export function Hero3D({ chair, lamp, sofa, fallback }: { chair?: HeroPiece; lamp?: HeroPiece; sofa?: HeroPiece; fallback: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState<"loading" | "ready" | "static">("loading");
  const add = useShop((s) => s.add), say = useShop((s) => s.say);

  const stages: Stage[] = [
    { key: "intro", eyebrow: "Autumn / Winter Collection", body: "" },
    { key: "chair", eyebrow: "Sit a while", body: "A deep, low seat in soft bouclé on a solid ash frame.", piece: chair },
    { key: "lamp", eyebrow: "When the light goes", body: "Pleated linen on brass — warm, low light that feels like evening.", piece: lamp },
    { key: "sofa", eyebrow: "The centrepiece", body: "Deep seats in washed Belgian linen, made to soften with every evening.", piece: sofa },
  ];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setMode("static"); return; }
    const section = sectionRef.current, canvas = canvasRef.current;
    if (!section || !canvas) return;
    let room: HeroScene | null = null, raf = 0, visible = true, disposed = false, lastStage = 0;

    const progress = () => {
      const r = section.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return span > 0 ? Math.min(Math.max(-r.top / span, 0), 1) : 0;
    };
    const loop = (t: number) => {
      if (!room || disposed) return;
      const p = progress();
      room.setProgress(p);
      room.frame(t);
      const s = p < 0.17 ? 0 : p < 0.47 ? 1 : p < 0.78 ? 2 : 3;
      if (s !== lastStage) { lastStage = s; setStage(s); }
      if (visible) raf = requestAnimationFrame(loop);
    };
    const resize = () => room?.resize(canvas.clientWidth, canvas.clientHeight);

    (async () => {
      try {
        const { createHeroScene, detectTier } = await import("./scene");
        if (disposed) return;
        room = createHeroScene(canvas, { mobile: window.innerWidth < 760, tier: detectTier() });
        resize();
        setMode("ready");
        raf = requestAnimationFrame(loop);
      } catch {
        if (!disposed) setMode("static"); // WebGL unavailable or blocked
      }
    })();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && room) raf = requestAnimationFrame(loop);
    });
    io.observe(section);
    const onPointer = (e: PointerEvent) => { if (e.pointerType === "mouse") room?.setPointer(e.clientX / window.innerWidth * 2 - 1, e.clientY / window.innerHeight * 2 - 1); };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      disposed = true;
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      room?.dispose();
    };
  }, []);

  if (mode === "static") return <>{fallback}</>;

  const s = stages[stage];
  return (
    <section ref={sectionRef} id="top" className="nx-hero3d" aria-label="Introduction">
      <div className="nx-hero3d-pin">
        <canvas ref={canvasRef} aria-hidden="true" className="nx-hero3d-canvas" style={{ opacity: mode === "ready" ? 1 : 0 }} />
        {mode !== "ready" && <div aria-hidden="true" className="nx-hero3d-backdrop" />}

        {stage === 0 ? (
          <div key="intro" className="nx-wrap nx-hero3d-intro">
            <p className="nx-rise" style={{ margin: "0 0 24px", fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#5E6A5B", display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 36, height: 1, background: "#5E6A5B" }} />{s.eyebrow}</p>
            <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(56px, 8.6vw, 140px)", lineHeight: 0.9, letterSpacing: "-.035em" }}>
              <span className="nx-mask"><span className="d1">Your Space.</span></span>
              <span className="nx-mask"><span className="d2" style={{ fontStyle: "italic", color: "#9A5B40", paddingLeft: ".5em" }}>Your Story.</span></span>
            </h1>
            <p className="nx-rise d3" style={{ margin: "28px 0 0", maxWidth: 420, fontSize: 17, lineHeight: 1.65, color: "#45463F" }}>Discover thoughtfully curated pieces that turn everyday spaces into extraordinary places.</p>
            <div className="nx-rise d4" style={{ marginTop: 34, display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link className="nx-btn" href="/shop">Explore Collection <IconArrowRight /></Link>
              <a className="nx-btn nx-ghost" href="#room">Shop the Room</a>
            </div>
          </div>
        ) : s.piece ? (
          <div key={s.key} className="nx-hero3d-card nx-rise">
            <span className="nx-eyebrow">{s.eyebrow}</span>
            <h2 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(36px, 4.2vw, 64px)", lineHeight: 0.98, letterSpacing: "-.03em" }}>{s.piece.name.split(" ").slice(0, -1).join(" ")} <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{s.piece.name.split(" ").slice(-1)}</span></h2>
            <span style={{ fontSize: 13, color: "#5C5D59" }}>{s.piece.meta}</span>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "#45463F" }}>{s.body}</p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{formatBDT(s.piece.price)}</span>
              <button className="nx-btn" style={{ minHeight: 46, padding: "0 20px" }} onClick={() => { add(s.piece!.id); say(`${s.piece!.name} added to your bag`); }}>Add to bag</button>
              <Link className="nx-link" href={`/product/${s.piece.slug}`} style={{ fontWeight: 600 }}>View piece</Link>
            </div>
          </div>
        ) : null}

        <ol aria-hidden="true" className="nx-hero3d-dots">
          {stages.map((x, i) => <li key={x.key} style={{ width: i === stage ? 28 : 8, background: i === stage ? "#222321" : "rgba(34,35,33,.25)" }} />)}
        </ol>
        {stage === 0 && <span aria-hidden="true" className="nx-hero3d-cue nx-rise d4"><span className="nx-scroll" />Scroll to step inside</span>}
      </div>
    </section>
  );
}
