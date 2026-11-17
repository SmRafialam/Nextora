"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ArrivalCard } from "@/components/shop/ProductCard";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";

const perView = (w: number) => (w <= 760 ? 1 : w <= 1080 ? 2 : 4);

export function NewArrivals({ items }: { items: Product[] }) {
  const [slide, setSlide] = useState(0);
  const [n, setN] = useState(4);
  useEffect(() => {
    const on = () => setN(perView(window.innerWidth));
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  const max = Math.max(0, items.length - n);
  const s = Math.min(slide, max);
  const pad = (x: number) => String(x).padStart(2, "0");

  return (
    <section id="new" className="nx-wrap" style={{ paddingTop: 140, paddingBottom: 40 }}>
      <div className="nx-reveal nx-sec-head">
        <div>
          <p className="nx-eyebrow" style={{ margin: "0 0 14px" }}>05 — Just landed</p>
          <h2 className="nx-h2">New <span style={{ fontStyle: "italic" }}>arrivals</span></h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "#5C5D59", fontVariantNumeric: "tabular-nums" }} aria-live="polite">{pad(s + 1)} / {pad(max + 1)}</span>
          <button className="nx-arrow" aria-label="Previous products" disabled={s === 0} onClick={() => setSlide(Math.max(0, s - 1))}><IconArrowLeft /></button>
          <button className="nx-arrow" aria-label="Next products" disabled={s >= max} onClick={() => setSlide(Math.min(max, s + 1))}><IconArrowRight size={20} /></button>
        </div>
      </div>
      <div className="nx-car nx-reveal" style={{ overflow: "hidden" }}>
        <div className="nx-track" style={{ transform: `translateX(calc(${-s} * (100% + 24px) / var(--n)))` }}>
          {items.map((p) => <ArrivalCard key={p.id} p={p} />)}
        </div>
      </div>
      <div style={{ marginTop: 28, height: 1, background: "rgba(34,35,33,.12)", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: -1, height: 3, background: "#222321", width: `${Math.round(((s + 1) / (max + 1)) * 100)}%`, transition: "width .9s cubic-bezier(.2,.7,.1,1)" }} />
      </div>
    </section>
  );
}
