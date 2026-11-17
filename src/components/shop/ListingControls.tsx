"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { PRICE_BANDS, SORTS, TONES, type Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import { IconClose } from "@/components/icons";

export function ListingControls({ products }: { products: Product[] }) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [cols, setCols] = useState<3 | 4>(4);

  const sort = params.get("sort") ?? "featured";
  const price = params.get("price") ?? "";
  const tones = params.getAll("tone");
  const isNew = params.get("new") === "1";
  const sale = params.get("sale") === "1";
  const active = (price ? 1 : 0) + tones.length + (isNew ? 1 : 0) + (sale ? 1 : 0);

  const update = (mut: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(params.toString());
    mut(p);
    const qs = p.toString();
    start(() => router.replace(qs ? `${path}?${qs}` : path, { scroll: false }));
  };
  const toggle = (key: string, value = "1") => update((p) => {
    const all = p.getAll(key);
    p.delete(key);
    if (all.includes(value)) all.filter((v) => v !== value).forEach((v) => p.append(key, v));
    else [...all, value].forEach((v) => p.append(key, v));
  });
  const clear = () => update((p) => { ["price", "tone", "new", "sale"].forEach((k) => p.delete(k)); });

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <div style={{ position: "sticky", top: 77, zIndex: 30, background: "rgba(248,245,239,.94)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(34,35,33,.08)", borderBottom: "1px solid rgba(34,35,33,.08)" }}>
        <div className="nx-wrap" style={{ minHeight: 64, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 10, paddingBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <button className="nx-pill" onClick={() => setOpen(true)} aria-haspopup="dialog">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
              Filters
              {active > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: 99, background: "#9A5B40", color: "#fff", fontSize: 11, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{active}</span>}
            </button>
            {active > 0 && <button onClick={clear} style={{ border: 0, background: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3, minHeight: 40 }}>Clear all</button>}
            <span style={{ fontSize: 13, color: "#5C5D59" }} aria-live="polite">{products.length} {products.length === 1 ? "piece" : "pieces"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label htmlFor="nx-sort" style={{ fontSize: 13, color: "#5C5D59" }}>Sort</label>
            <select id="nx-sort" value={sort} onChange={(e) => update((p) => { if (e.target.value === "featured") p.delete("sort"); else p.set("sort", e.target.value); })} style={{ height: 40, border: "1px solid rgba(34,35,33,.18)", borderRadius: 99, background: "transparent", padding: "0 14px", fontSize: 13, cursor: "pointer" }}>
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <div className="nx-desk" role="group" aria-label="Grid density" style={{ display: "flex", gap: 2 }}>
              <button className="nx-icon" aria-label="Larger tiles" aria-pressed={cols === 3} onClick={() => setCols(3)} style={{ opacity: cols === 3 ? 1 : 0.45 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><rect x="3" y="3" width="8" height="8" /><rect x="13" y="3" width="8" height="8" /><rect x="3" y="13" width="8" height="8" /><rect x="13" y="13" width="8" height="8" /></svg></button>
              <button className="nx-icon" aria-label="Smaller tiles" aria-pressed={cols === 4} onClick={() => setCols(4)} style={{ opacity: cols === 4 ? 1 : 0.45 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><path d="M3 3h5v5H3zM10 3h4v5h-4zM16 3h5v5h-5zM3 10h5v4H3zM10 10h4v4h-4zM16 10h5v4h-5zM3 16h5v5H3zM10 16h4v5h-4zM16 16h5v5h-5z" /></svg></button>
            </div>
          </div>
        </div>
      </div>

      <section className="nx-wrap" style={{ paddingTop: 40, paddingBottom: 120, opacity: pending ? 0.55 : 1, transition: "opacity .3s" }} aria-busy={pending}>
        {products.length === 0 ? (
          <div className="nx-pop" style={{ padding: "96px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <span className="nx-f" style={{ fontSize: 36, fontWeight: 300, fontStyle: "italic" }}>Nothing here — yet.</span>
            <span style={{ fontSize: 15, color: "#5C5D59" }}>No pieces match these filters. Try widening your search.</span>
            <button className="nx-btn nx-ghost" onClick={clear}>Clear filters</button>
          </div>
        ) : (
          <div className={cols === 3 ? "nx-grid3" : "nx-grid4"}>
            {products.map((p) => <ProductCard key={p.id} p={p} reveal={false} />)}
          </div>
        )}
      </section>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Filters" style={{ position: "fixed", inset: 0, zIndex: 80 }}>
          <button className="nx-fade" aria-label="Close filters" onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, border: 0, background: "rgba(34,35,33,.4)", cursor: "pointer" }} />
          <aside className="nx-left" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "min(400px, 100%)", background: "#F8F5EF", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(34,35,33,.1)" }}>
              <h2 className="nx-f" style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>Refine</h2>
              <button className="nx-icon" aria-label="Close filters" onClick={() => setOpen(false)}><IconClose /></button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 32 }}>
              <FilterGroup title="Price">
                <button className="nx-pill" aria-pressed={!price} onClick={() => update((p) => p.delete("price"))}>Any price</button>
                {PRICE_BANDS.map((b) => <button key={b.key} className="nx-pill" aria-pressed={price === b.key} onClick={() => update((p) => p.set("price", b.key))}>{b.label}</button>)}
              </FilterGroup>
              <FilterGroup title="Colour family">
                {TONES.map((t) => (
                  <button key={t.key} className="nx-pill" aria-pressed={tones.includes(t.key)} onClick={() => toggle("tone", t.key)}>
                    <span style={{ width: 14, height: 14, borderRadius: 99, background: t.hex, boxShadow: "0 0 0 1px rgba(34,35,33,.2)" }} />{t.label}
                  </button>
                ))}
              </FilterGroup>
              <FilterGroup title="Show only">
                <button className="nx-pill" aria-pressed={isNew} onClick={() => toggle("new")}>New arrivals</button>
                <button className="nx-pill" aria-pressed={sale} onClick={() => toggle("sale")}>On sale</button>
              </FilterGroup>
            </div>
            <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(34,35,33,.1)", display: "flex", gap: 12 }}>
              <button className="nx-btn nx-ghost" onClick={clear} style={{ flex: 1 }}>Clear</button>
              <button className="nx-btn" onClick={() => setOpen(false)} style={{ flex: 2 }}>Show {products.length} pieces</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span className="nx-eyebrow">{title}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
    </div>
  );
}
