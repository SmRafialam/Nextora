import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getCategory, getProductBySlug, relatedProducts } from "@/lib/catalog";
import { formatBDT } from "@/lib/format";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductArt } from "@/components/ProductArt";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProductBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.description} ${formatBDT(p.price)}.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} — Nestora`, description: p.description, type: "website" },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = getProductBySlug((await params).slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.id,
    brand: { "@type": "Brand", name: "Nestora" },
    category: cat?.name,
    material: p.material,
    color: p.colors.map((c) => c.name).join(", "),
    offers: { "@type": "Offer", url: `${site}/product/${p.slug}`, priceCurrency: "BDT", price: p.price, availability: "https://schema.org/InStock" },
  };
  const crumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: cat?.name ?? "Shop", item: `${site}/shop/${cat?.slug ?? ""}` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${site}/product/${p.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, crumbsLd]).replace(/</g, "\\u003c") }} />
      <div className="nx-wrap" style={{ paddingTop: 28 }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 12.5, color: "#5C5D59" }}>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <li><Link href="/" style={{ color: "#5C5D59" }}>Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/shop/${cat?.slug ?? ""}`} style={{ color: "#5C5D59" }}>{cat?.name ?? "Shop"}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" style={{ color: "#222321" }}>{p.name}</li>
          </ol>
        </nav>
      </div>
      <ProductDetail p={p} />
      <section className="nx-wrap" style={{ paddingBottom: 120 }}>
        <div className="nx-reveal nx-sec-head" style={{ marginBottom: 40 }}>
          <h2 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1, letterSpacing: "-.025em" }}>Complete <span style={{ fontStyle: "italic" }}>the look</span></h2>
          <Link className="nx-link" href="/shop" style={{ fontWeight: 600 }}>Shop all</Link>
        </div>
        <div className="nx-grid4">
          {relatedProducts(p).map((r) => (
            <Link key={r.id} href={`/product/${r.slug}`} className="nx-card nx-reveal" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="nx-zoom" style={{ display: "block", aspectRatio: "1 / 1", borderRadius: 4, background: r.bg }}><span className="nx-art" style={{ position: "absolute", inset: "16%", display: "block" }}><ProductArt kind={r.kind} fill={r.colors[0].hex} /></span></span>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span className="nx-f" style={{ fontSize: 18 }}>{r.name}</span><span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>{formatBDT(r.price)}</span></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
