import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, CATEGORY_COPY, getCategory, queryProducts } from "@/lib/catalog";
import { readListingParams, type SearchParams } from "@/lib/listingParams";
import { Listing } from "@/components/shop/Listing";

type Props = { params: Promise<{ category: string }>; searchParams: SearchParams };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return { title: c.name, description: CATEGORY_COPY[c.slug]?.[2], alternates: { canonical: `/shop/${c.slug}` } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const q = await readListingParams(searchParams);
  const [a, b, intro] = CATEGORY_COPY[c.slug] ?? [c.name, "", c.sub];
  return (
    <Listing
      crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: c.name }]}
      title={[a, b]}
      intro={intro}
      products={queryProducts({ ...q, category: c.slug })}
      activeCategory={c.slug}
    />
  );
}
