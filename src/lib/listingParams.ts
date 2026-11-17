import type { ListingQuery } from "./catalog";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const many = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** Turns URL search params into a catalog query (sort, price band, colour tones, new, sale, q). */
export async function readListingParams(sp: SearchParams): Promise<ListingQuery> {
  const p = await sp;
  return {
    sort: one(p.sort),
    price: one(p.price),
    tone: many(p.tone),
    isNew: one(p.new) === "1",
    sale: one(p.sale) === "1",
    q: one(p.q)?.slice(0, 80),
  };
}
