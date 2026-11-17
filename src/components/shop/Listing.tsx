import Link from "next/link";
import { Suspense } from "react";
import { CATEGORIES, type Product } from "@/lib/catalog";
import { ListingControls } from "./ListingControls";

export type ListingProps = {
  crumbs: { label: string; href?: string }[];
  title: [string, string];
  intro: string;
  products: Product[];
  activeCategory?: string | null;
  showPills?: boolean;
};

export function Listing({ crumbs, title, intro, products, activeCategory, showPills = true }: ListingProps) {
  return (
    <>
      <section className="nx-wrap" style={{ paddingTop: 64, paddingBottom: 32 }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: "#5C5D59" }}>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {crumbs.map((c, i) => (
              <li key={c.label} style={{ display: "flex", gap: 8 }}>
                {i > 0 && <span aria-hidden="true">/</span>}
                {c.href ? <Link href={c.href} style={{ color: "#5C5D59" }}>{c.label}</Link> : <span aria-current="page" style={{ color: "#222321" }}>{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <div className="nx-rise" style={{ marginTop: 28, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(52px, 7vw, 112px)", lineHeight: 0.92, letterSpacing: "-.035em" }}>{title[0]} <span style={{ fontStyle: "italic", color: "#9A5B40" }}>{title[1]}</span></h1>
          <p style={{ margin: 0, maxWidth: 360, fontSize: 15, lineHeight: 1.7, color: "#45463F" }}>{intro}</p>
        </div>
        {showPills && (
          <nav aria-label="Collections" className="nx-pills" style={{ marginTop: 40 }}>
            <Link className="nx-pill" href="/shop" aria-current={!activeCategory ? "page" : undefined} data-on={!activeCategory}>All products</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} className="nx-pill" href={`/shop/${c.slug}`} aria-current={activeCategory === c.slug ? "page" : undefined} data-on={activeCategory === c.slug}>{c.name}</Link>
            ))}
          </nav>
        )}
      </section>
      <Suspense fallback={<div className="nx-wrap" style={{ height: 64 }} />}>
        <ListingControls products={products} />
      </Suspense>
    </>
  );
}
