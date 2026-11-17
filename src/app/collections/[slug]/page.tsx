import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COLLECTIONS, getCollection, queryProducts } from "@/lib/catalog";
import { readListingParams, type SearchParams } from "@/lib/listingParams";
import { Listing } from "@/components/shop/Listing";

type Props = { params: Promise<{ slug: string }>; searchParams: SearchParams };

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCollection((await params).slug);
  if (!c) return {};
  return { title: c.title.join(" "), description: c.intro, alternates: { canonical: `/collections/${c.slug}` } };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const c = getCollection((await params).slug);
  if (!c) notFound();
  const q = await readListingParams(searchParams);
  return (
    <Listing
      crumbs={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: c.title.join(" ") }]}
      title={c.title}
      intro={c.intro}
      products={queryProducts({ ...q, ids: c.ids })}
      showPills={false}
    />
  );
}
