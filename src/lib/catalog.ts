// Catalog types and listing options shared by server and client code.
// Data now lives in PostgreSQL (see prisma/schema.prisma and src/server/catalog.ts).
// Prices on these objects are whole taka for display; the database stores paisa.

export type ArtKind = "sofa" | "chair" | "lamp" | "vase" | "table" | "bed" | "shelf" | "plant";

export type Product = {
  id: string;
  slug: string;
  name: string;
  meta: string;
  category: string;
  type: string;
  price: number;
  compareAt?: number;
  kind: ArtKind;
  bg: string;
  bgAlt: string;
  badge?: "Bestseller" | "New" | "Sale";
  isNew: boolean;
  colors: { name: string; hex: string }[];
  /** Units in stock, by colour index. */
  stock: number[];
  description: string;
  dimensions: string;
  material: string;
};

export type Category = { slug: string; name: string; sub: string; kind: ArtKind; fill: string; bg: string; span?: "big" | "wide"; inset: string; size: string; headline: [string, string]; intro: string };
export type Collection = { slug: string; title: [string, string]; intro: string; kind: ArtKind; fill: string; bg: string; ids: string[] };

/** Listing headline for /shop (all products), from the approved Shop design. */
export const SHOP_ALL_COPY: [string, string, string] = ["All", "products", "Furniture, lighting and objects chosen to live well together — and to last."];

export const TONES: { key: string; label: string; hex: string; names: string[] }[] = [
  { key: "neutral", label: "Neutrals", hex: "#E4D6C1", names: ["Oat", "Ivory", "Bouclé", "Chalk", "Travertine", "Ash"] },
  { key: "green", label: "Greens", hex: "#8E9A89", names: ["Sage", "Moss"] },
  { key: "warm", label: "Warm", hex: "#C68C70", names: ["Clay", "Terracotta", "Rust"] },
  { key: "wood", label: "Wood", hex: "#C9AE8A", names: ["Natural oak", "Smoked oak", "Walnut", "Oak", "Natural"] },
  { key: "dark", label: "Dark", hex: "#4A4B47", names: ["Charcoal", "Black"] },
];
export const PRICE_BANDS = [
  { key: "u10", label: "Under ৳ 10,000", min: 0, max: 9999 },
  { key: "m50", label: "৳ 10,000 – 50,000", min: 10000, max: 50000 },
  { key: "o50", label: "Over ৳ 50,000", min: 50001, max: Infinity },
] as const;
export const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "new", label: "Newest" },
  { key: "bestsellers", label: "Best sellers" },
  { key: "low", label: "Price: low to high" },
  { key: "high", label: "Price: high to low" },
] as const;

export type ListingQuery = { category?: string; ids?: string[]; q?: string; sort?: string; price?: string; tone?: string[]; isNew?: boolean; sale?: boolean };

