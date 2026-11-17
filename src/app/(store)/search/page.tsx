import type { Metadata } from "next";
import { queryProducts } from "@/lib/catalog";
import { readListingParams, type SearchParams } from "@/lib/listingParams";
import { Listing } from "@/components/shop/Listing";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const q = await readListingParams(searchParams);
  const term = q.q?.trim() ?? "";
  const products = term ? queryProducts(q) : [];
  return (
    <Listing
      crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      title={term ? ["Results for", `“${term}”`] : ["Search", "Nestora"]}
      intro={term ? `${products.length} ${products.length === 1 ? "piece matches" : "pieces match"} your search.` : "Use the search icon above to find sofas, lamps, linen and more."}
      products={products}
      showPills={false}
    />
  );
}
