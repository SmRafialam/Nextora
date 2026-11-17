import Link from "next/link";
import { featuredProducts } from "@/server/catalog";
import { ProductCard } from "@/components/shop/ProductCard";

export async function FeaturedProducts() {
  return (
    <section id="featured" className="nx-wrap" style={{ paddingTop: 120, paddingBottom: 40 }}>
      <div className="nx-reveal nx-sec-head">
        <div>
          <p className="nx-eyebrow" style={{ margin: "0 0 14px" }}>02 — Best sellers</p>
          <h2 className="nx-h2">Pieces people <span style={{ fontStyle: "italic" }}>keep.</span></h2>
        </div>
        <Link className="nx-link" href="/shop" style={{ fontWeight: 600 }}>View all products</Link>
      </div>
      <div className="nx-prod">
        {(await featuredProducts()).map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}
