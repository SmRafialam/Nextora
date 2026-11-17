// Pricing rules shared by the bag, checkout and (from Phase 6) the server.
// The server will recompute every total from these rules; client totals are display only.
import type { Product } from "./catalog";
import type { CartLine } from "@/store/shop";

export const FREE_SHIP_MIN = 15000;

// TEMPORARY: coupons move to the database in Phase 8 (limits, expiry, usage counts).
export const COUPONS: Record<string, { pct: number; label: string }> = {
  NESTORA10: { pct: 10, label: "10% off your order" },
};
export const findCoupon = (code: string) => COUPONS[code.trim().toUpperCase()];

export type ShipId = "std" | "exp" | "out";
export type ShipOption = { id: ShipId; label: string; note: string; price: number };

export function shippingOptions(subtotal: number, inDhaka: boolean): ShipOption[] {
  return inDhaka
    ? [
        { id: "std", label: "Standard delivery", note: "Small items 2–3 days · furniture placed in 5–7 days", price: subtotal >= FREE_SHIP_MIN || subtotal === 0 ? 0 : 600 },
        { id: "exp", label: "Express", note: "Next working day for in-stock pieces", price: 1200 },
      ]
    : [{ id: "out", label: "Nationwide courier", note: "Small items 3–5 days · furniture 7–10 days", price: 1500 }];
}

export type PricedLine = CartLine & { p: Product; color: Product["colors"][number]; total: number };

export type ProductLookup = (id: string) => Product | undefined;

export function priceCart(cart: CartLine[], getProduct: ProductLookup, opts: { promo?: string; ship?: ShipId; inDhaka?: boolean } = {}) {
  const lines: PricedLine[] = [];
  for (const x of cart) {
    const p = getProduct(x.id);
    if (p) lines.push({ ...x, p, color: p.colors[x.c] ?? p.colors[0], total: p.price * x.q });
  }
  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const count = lines.reduce((a, l) => a + l.q, 0);
  const coupon = opts.promo ? findCoupon(opts.promo) : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.pct) / 100) : 0;
  const options = shippingOptions(subtotal, opts.inDhaka ?? true);
  const shipping = options.find((o) => o.id === opts.ship) ?? options[0];
  return { lines, count, subtotal, discount, coupon, options, shipping, total: subtotal - discount + shipping.price };
}
