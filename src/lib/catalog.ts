// TEMPORARY catalog source for Phase 2 (design migration).
// Phase 4 replaces this module with Prisma/PostgreSQL queries behind the same functions.
// Prices are integer BDT poisha-free whole taka here; Phase 4 stores minor units (paisa).

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
  description: string;
  dimensions: string;
  material: string;
};

const p = (x: Omit<Product, "slug" | "bgAlt"> & { bgAlt?: string }): Product => ({
  ...x,
  slug: x.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  bgAlt: x.bgAlt ?? x.bg,
});
const c = (...pairs: [string, string][]) => pairs.map(([name, hex]) => ({ name, hex }));

export const PRODUCTS: Product[] = [
  p({ id: "halden", name: "Halden Linen Sofa", meta: "3-seater · Belgian linen", category: "living-room", type: "Sofas", price: 148000, kind: "sofa", bg: "#ECE4D7", bgAlt: "#E4DACA", badge: "Bestseller", isNew: false, colors: c(["Sage", "#8E9A89"], ["Oat", "#D8CBB5"], ["Clay", "#C68C70"]), description: "Deep, feather-wrapped seat cushions in stonewashed linen over a kiln-dried hardwood frame. Covers are removable and washable.", dimensions: "W 228 × D 96 × H 78 cm", material: "Stonewashed Belgian linen, kiln-dried hardwood, feather and foam cushions" }),
  p({ id: "orla", name: "Orla Lounge Chair", meta: "Bouclé · Solid ash", category: "furniture", type: "Chairs", price: 42500, kind: "chair", bg: "#E9E4DA", bgAlt: "#DED8CC", badge: "Bestseller", isNew: false, colors: c(["Clay", "#C68C70"], ["Bouclé", "#EFE8DC"], ["Charcoal", "#4A4B47"]), description: "A low, enveloping silhouette upholstered in soft bouclé, on tapered ash legs.", dimensions: "W 78 × D 82 × H 74 cm", material: "Wool-blend bouclé, solid ash" }),
  p({ id: "sorrel", name: "Sorrel Pleated Lamp", meta: "Linen shade · Brass", category: "lighting", type: "Table lamps", price: 9800, kind: "lamp", bg: "#F0E7DA", bgAlt: "#E8DCCB", isNew: false, colors: c(["Ivory", "#F3ECE1"], ["Sage", "#A3AE9F"], ["Terracotta", "#C68C70"]), description: "A hand-pleated linen shade casts a warm, diffused glow. Brushed brass stem, weighted base.", dimensions: "Ø 32 × H 52 cm", material: "Pleated linen, brushed brass" }),
  p({ id: "mira", name: "Mira Stoneware Vase", meta: "Hand-thrown · Matte glaze", category: "home-decor", type: "Vases", price: 3200, kind: "vase", bg: "#E6E3DA", bgAlt: "#DBD7CC", badge: "New", isNew: true, colors: c(["Terracotta", "#C68C70"], ["Chalk", "#F1ECE3"], ["Moss", "#788575"]), description: "Each vase is thrown by hand, so no two are quite alike. Watertight matte glaze.", dimensions: "Ø 18 × H 26 cm", material: "Glazed stoneware" }),
  p({ id: "tove", name: "Tove Oak Side Table", meta: "Solid white oak", category: "furniture", type: "Tables", price: 14500, kind: "table", bg: "#EFE6D8", bgAlt: "#E6DBC9", isNew: true, colors: c(["Natural oak", "#C9AE8A"], ["Smoked oak", "#6B523E"]), description: "A turned pedestal in solid white oak, finished with a hard-wax oil.", dimensions: "Ø 45 × H 52 cm", material: "Solid white oak, hard-wax oil" }),
  p({ id: "saga", name: "Saga Modular Sofa", meta: "4-seat · Wool blend", category: "living-room", type: "Sofas", price: 210000, kind: "sofa", bg: "#E9E1D3", bgAlt: "#E0D6C5", isNew: true, colors: c(["Oat", "#D8CBB5"], ["Charcoal", "#4A4B47"]), description: "Rearrangeable modules in a hard-wearing wool blend.", dimensions: "W 312 × D 102 × H 74 cm", material: "Wool blend, hardwood frame" }),
  p({ id: "juni", name: "Juni Accent Chair", meta: "Cotton velvet", category: "furniture", type: "Chairs", price: 36000, compareAt: 42000, kind: "chair", bg: "#EDE5DA", bgAlt: "#E3D9CC", badge: "Sale", isNew: true, colors: c(["Sage", "#8E9A89"], ["Rust", "#B5745A"]), description: "Compact, curved and generously padded.", dimensions: "W 70 × D 74 × H 80 cm", material: "Cotton velvet, beech" }),
  p({ id: "ellis", name: "Ellis Rattan Lamp", meta: "Hand-woven rattan", category: "lighting", type: "Floor lamps", price: 11900, kind: "lamp", bg: "#EFE8DD", bgAlt: "#E6DDCF", isNew: true, colors: c(["Natural", "#C9AE8A"], ["Black", "#3A3B38"]), description: "Woven by hand from natural rattan for a soft, patterned light.", dimensions: "Ø 40 × H 150 cm", material: "Natural rattan, steel" }),
  p({ id: "arlo", name: "Arlo Coffee Table", meta: "Travertine top", category: "living-room", type: "Tables", price: 28900, kind: "table", bg: "#E8E2D7", bgAlt: "#DED6C8", isNew: true, colors: c(["Travertine", "#E4D6C1"], ["Walnut", "#7A5A43"]), description: "Honed travertine on a sculpted pedestal base.", dimensions: "Ø 90 × H 38 cm", material: "Honed travertine" }),
  p({ id: "wren", name: "Wren Storage Cabinet", meta: "Oak veneer · 3 shelves", category: "storage", type: "Cabinets", price: 46000, kind: "shelf", bg: "#EDE6DB", bgAlt: "#E3DBCD", isNew: true, colors: c(["Oak", "#C9AE8A"], ["Ivory", "#EFE8DC"]), description: "Fluted doors with adjustable shelves inside.", dimensions: "W 90 × D 42 × H 120 cm", material: "Oak veneer, solid oak legs" }),
  p({ id: "luma", name: "Luma Linen Bed", meta: "Queen · Upholstered", category: "bedroom", type: "Beds", price: 98000, kind: "bed", bg: "#ECE5DA", bgAlt: "#E2D9CB", isNew: true, colors: c(["Oat", "#D8CBB5"], ["Sage", "#8E9A89"]), description: "A softly padded headboard in washed linen.", dimensions: "W 168 × L 212 × H 110 cm", material: "Washed linen, pine slats" }),
  p({ id: "nara", name: "Nara Bedside Cabinet", meta: "Ash · 1 drawer", category: "bedroom", type: "Bedside", price: 18500, kind: "shelf", bg: "#EEE8DE", isNew: false, colors: c(["Ash", "#D9C4A3"], ["Sage", "#8E9A89"]), description: "A rounded bedside with a soft-close drawer.", dimensions: "W 48 × D 38 × H 52 cm", material: "Solid ash" }),
  p({ id: "kiri", name: "Kiri Dining Table", meta: "Seats 6 · Solid oak", category: "kitchen-dining", type: "Tables", price: 86000, kind: "table", bg: "#E6E3DA", badge: "Bestseller", isNew: false, colors: c(["Natural oak", "#C9AE8A"], ["Smoked oak", "#6B523E"]), description: "A generous round table made for long dinners.", dimensions: "Ø 140 × H 75 cm", material: "Solid white oak" }),
  p({ id: "sela", name: "Sela Serving Bowl", meta: "Stoneware · Set of 2", category: "kitchen-dining", type: "Serveware", price: 4200, kind: "vase", bg: "#EFE6D8", isNew: false, colors: c(["Chalk", "#F1ECE3"], ["Terracotta", "#C68C70"]), description: "Reactive-glaze bowls for everyday sharing.", dimensions: "Ø 24 / Ø 18 cm", material: "Reactive-glaze stoneware" }),
  p({ id: "olive", name: "Olive Terracotta Planter", meta: "Indoor / outdoor", category: "outdoor", type: "Planters", price: 6800, compareAt: 8500, kind: "plant", bg: "#DFE3DA", badge: "Sale", isNew: false, colors: c(["Terracotta", "#C68C70"], ["Chalk", "#F1ECE3"]), description: "Frost-resistant terracotta with a drainage hole and saucer.", dimensions: "Ø 38 × H 36 cm", material: "Unglazed terracotta" }),
  p({ id: "tala", name: "Tala Ceramic Vase", meta: "Ribbed · Satin glaze", category: "home-decor", type: "Vases", price: 2800, kind: "vase", bg: "#ECE4D7", isNew: false, colors: c(["Moss", "#788575"], ["Chalk", "#F1ECE3"]), description: "A ribbed form that catches the light.", dimensions: "Ø 14 × H 22 cm", material: "Satin-glaze ceramic" }),
];

export type Category = { slug: string; name: string; sub: string; kind: ArtKind; fill: string; bg: string; span?: "big" | "wide"; inset: string; size: string };

export const CATEGORIES: Category[] = [
  { slug: "living-room", name: "Living Room", sub: "Sofas, armchairs, coffee tables", kind: "sofa", fill: "#8E9A89", bg: "#E9DFD0", span: "big", inset: "20% 16% 30%", size: "44px" },
  { slug: "bedroom", name: "Bedroom", sub: "Beds, linen, bedside", kind: "bed", fill: "#D8CBB5", bg: "#EEE8DE", inset: "12% 14% 38%", size: "26px" },
  { slug: "kitchen-dining", name: "Kitchen & Dining", sub: "Tables, ceramics, serveware", kind: "table", fill: "#C9AE8A", bg: "#E6E3DA", inset: "12% 14% 38%", size: "26px" },
  { slug: "home-decor", name: "Home Décor", sub: "Vases, objects, textiles", kind: "vase", fill: "#C68C70", bg: "#EFE6D8", inset: "10% 20% 38%", size: "26px" },
  { slug: "lighting", name: "Lighting", sub: "Table, floor, pendant", kind: "lamp", fill: "#F3ECE1", bg: "#DCD5C7", inset: "10% 20% 38%", size: "26px" },
  { slug: "furniture", name: "Furniture", sub: "Chairs, tables, benches", kind: "chair", fill: "#4A4B47", bg: "#E9E4DA", inset: "12% 18% 38%", size: "26px" },
  { slug: "storage", name: "Storage", sub: "Cabinets, shelves, baskets", kind: "shelf", fill: "#C9AE8A", bg: "#EDE6DB", inset: "10% 22% 38%", size: "26px" },
  { slug: "outdoor", name: "Outdoor Living", sub: "Planters, loungers, lanterns", kind: "plant", fill: "#C68C70", bg: "#DFE3DA", span: "wide", inset: "8% 36% 34%", size: "30px" },
];

export const getProduct = (id: string) => PRODUCTS.find((x) => x.id === id);
export const featuredProducts = () => PRODUCTS.slice(0, 4);
export const newArrivals = () => PRODUCTS.slice(4, 11);
