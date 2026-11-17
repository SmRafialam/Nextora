import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import { PRICE_BANDS, TONES, type ArtKind, type Category, type Collection, type ListingQuery, type Product } from "@/lib/catalog";

const withVariants = { variants: { orderBy: { position: "asc" } } } satisfies Prisma.ProductInclude;
type Row = Prisma.ProductGetPayload<{ include: typeof withVariants }>;

const taka = (paisa: number) => paisa / 100;

/** Database row → the display shape the components use (prices in taka). */
function toProduct(r: Row): Product {
  const first = r.variants[0];
  return {
    id: r.id, slug: r.slug, name: r.name, meta: r.meta, category: r.categorySlug, type: r.type,
    price: first ? taka(first.pricePaisa) : 0,
    compareAt: first?.compareAtPaisa ? taka(first.compareAtPaisa) : undefined,
    kind: r.artKind as ArtKind, bg: r.bg, bgAlt: r.bgAlt,
    badge: (r.badge ?? undefined) as Product["badge"], isNew: r.isNew,
    colors: r.variants.map((v) => ({ name: v.colorName, hex: v.colorHex })),
    stock: r.variants.map((v) => v.stock),
    description: r.description, dimensions: r.dimensions, material: r.material,
  };
}

const active = { isActive: true } satisfies Prisma.ProductWhereInput;

/** Every active product, in catalogue order. Cached per request. */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const rows = await db.product.findMany({ where: active, include: withVariants, orderBy: { position: "asc" } });
  return rows.map(toProduct);
});

export const getProductBySlug = cache(async (slug: string) => {
  const r = await db.product.findFirst({ where: { slug, ...active }, include: withVariants });
  return r ? toProduct(r) : undefined;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const rows = await db.category.findMany({ orderBy: { position: "asc" } });
  return rows.map((c) => ({
    slug: c.slug, name: c.name, sub: c.sub, kind: c.artKind as ArtKind, fill: c.artFill, bg: c.bg,
    span: (c.span ?? undefined) as Category["span"], inset: c.artInset, size: c.labelSize,
    headline: [c.headline, c.headlineEm], intro: c.intro,
  }));
});
export const getCategory = async (slug: string) => (await getCategories()).find((c) => c.slug === slug);

export const getCollections = cache(async (): Promise<Collection[]> => {
  const rows = await db.collection.findMany({ orderBy: { position: "asc" }, include: { products: { orderBy: { position: "asc" } } } });
  return rows.map((c) => ({ slug: c.slug, title: [c.title, c.titleEm], intro: c.intro, kind: c.artKind as ArtKind, fill: c.artFill, bg: c.bg, ids: c.products.map((p) => p.productId) }));
});
export const getCollection = async (slug: string) => (await getCollections()).find((c) => c.slug === slug);

export const featuredProducts = async () => (await getAllProducts()).slice(0, 4);
export const newArrivals = async () => (await getAllProducts()).slice(4, 11);

/** Filtered, sorted listing. Filters run in PostgreSQL; sorting by display price is done on the result. */
export async function queryProducts(f: ListingQuery): Promise<Product[]> {
  const band = PRICE_BANDS.find((b) => b.key === f.price);
  const toneNames = TONES.filter((t) => f.tone?.includes(t.key)).flatMap((t) => t.names);
  const q = f.q?.trim();
  const and: Prisma.ProductWhereInput[] = [active];
  if (f.category) and.push({ categorySlug: f.category });
  if (f.ids) and.push({ id: { in: f.ids } });
  if (f.isNew) and.push({ isNew: true });
  if (f.sale) and.push({ variants: { some: { compareAtPaisa: { not: null } } } });
  if (toneNames.length) and.push({ variants: { some: { colorName: { in: toneNames } } } });
  if (band) and.push({ variants: { some: { position: 0, pricePaisa: { gte: band.min * 100, ...(Number.isFinite(band.max) ? { lte: band.max * 100 } : {}) } } } });
  if (q) {
    const has = { contains: q, mode: "insensitive" as const };
    and.push({ OR: [{ name: has }, { meta: has }, { type: has }, { material: has }, { category: { name: has } }] });
  }
  const rows = await db.product.findMany({ where: { AND: and }, include: withVariants, orderBy: { position: "asc" } });
  let list = rows.map(toProduct);
  if (f.ids) list.sort((a, b) => f.ids!.indexOf(a.id) - f.ids!.indexOf(b.id));
  if (f.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (f.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (f.sort === "new") list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
  if (f.sort === "bestsellers") list = [...list].sort((a, b) => Number(b.badge === "Bestseller") - Number(a.badge === "Bestseller"));
  return list;
}

export async function relatedProducts(p: Product, n = 4) {
  const all = await getAllProducts();
  return [...all.filter((x) => x.id !== p.id && x.category === p.category), ...all.filter((x) => x.id !== p.id && x.category !== p.category && x.kind !== p.kind)].slice(0, n);
}
