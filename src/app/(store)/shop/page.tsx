import type { Metadata } from "next";
import { SHOP_ALL_COPY } from "@/lib/catalog";
import { queryProducts } from "@/server/catalog";
import { readListingParams, type SearchParams } from "@/lib/listingParams";
import { Listing } from "@/components/shop/Listing";

export const metadata: Metadata = {
  title: "Shop all",
  description: SHOP_ALL_COPY[2],
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const q = await readListingParams(searchParams);
  const [a, b, intro] = SHOP_ALL_COPY;
  return <Listing crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]} title={[a, b]} intro={intro} products={await queryProducts(q)} activeCategory={null} />;
}
