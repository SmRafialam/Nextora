import type { Metadata } from "next";
import { CATEGORY_COPY, queryProducts } from "@/lib/catalog";
import { readListingParams, type SearchParams } from "@/lib/listingParams";
import { Listing } from "@/components/shop/Listing";

export const metadata: Metadata = {
  title: "Shop all",
  description: CATEGORY_COPY.all[2],
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const q = await readListingParams(searchParams);
  const [a, b, intro] = CATEGORY_COPY.all;
  return <Listing crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]} title={[a, b]} intro={intro} products={queryProducts(q)} activeCategory={null} />;
}
