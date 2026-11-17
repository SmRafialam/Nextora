import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategory, queryProducts } from "@/server/catalog";
import { readListingParams, type SearchParams } from "@/lib/listingParams";
import { Listing } from "@/components/shop/Listing";

type Props = { params: Promise<{ category: string }>; searchParams: SearchParams };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = await getCategory(category);
  if (!c) return {};
  return { title: c.name, description: c.intro, alternates: { canonical: `/shop/${c.slug}` } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const c = await getCategory(category);
  if (!c) notFound();
  const q = await readListingParams(searchParams);
  const [a, b] = c.headline;
  const intro = c.intro;
  return (
    <Listing
      crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: c.name }]}
      title={[a, b]}
      intro={intro}
      products={await queryProducts({ ...q, category: c.slug })}
      activeCategory={c.slug}
    />
  );
}
