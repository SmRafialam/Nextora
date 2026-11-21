import "server-only";
import { z } from "zod";
import { db } from "./db";
import type { CartLine } from "@/store/shop";

export const MAX_QTY = 9;
export const shopPayload = z.object({
  cart: z.array(z.object({ id: z.string().max(40), c: z.number().int().min(0).max(20), q: z.number().int().min(1).max(MAX_QTY) })).max(50),
  wish: z.array(z.string().max(40)).max(200),
});

export async function readShop(userId: string) {
  const [cart, wish] = await Promise.all([
    db.cart.findUnique({ where: { userId }, include: { items: { include: { variant: true }, orderBy: { id: "asc" } } } }),
    db.wishlistItem.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
  ]);
  return {
    cart: (cart?.items ?? []).map((i): CartLine => ({ id: i.variant.productId, c: i.variant.position, q: i.quantity })),
    wish: wish.map((w) => w.productId),
  };
}

/** Replaces the user's saved bag and wishlist. Unknown or inactive products are dropped and
 *  quantities are capped at available stock; the cleaned result is returned to the browser. */
export async function writeShop(userId: string, input: z.infer<typeof shopPayload>) {
  const ids = [...new Set([...input.cart.map((l) => l.id), ...input.wish])];
  const variants = await db.variant.findMany({ where: { productId: { in: ids }, product: { isActive: true } } });
  const byKey = new Map(variants.map((v) => [`${v.productId}:${v.position}`, v]));
  const activeIds = new Set(variants.map((v) => v.productId));

  const merged = new Map<string, { variantId: string; q: number; line: CartLine }>();
  let adjusted = false;
  for (const l of input.cart) {
    const v = byKey.get(`${l.id}:${l.c}`);
    if (!v) { adjusted = true; continue; }
    const prev = merged.get(v.id)?.q ?? 0;
    const q = Math.min(prev + l.q, MAX_QTY, v.stock);
    if (q < prev + l.q) adjusted = true;
    if (q > 0) merged.set(v.id, { variantId: v.id, q, line: { id: l.id, c: l.c, q } });
    else adjusted = true;
  }
  const wish = [...new Set(input.wish.filter((id) => activeIds.has(id)))];

  const cart = await db.cart.upsert({ where: { userId }, create: { userId }, update: {} });
  await db.$transaction([
    db.cartItem.deleteMany({ where: { cartId: cart.id } }),
    db.cartItem.createMany({ data: [...merged.values()].map((m) => ({ cartId: cart.id, variantId: m.variantId, quantity: m.q })) }),
    db.wishlistItem.deleteMany({ where: { userId, productId: { notIn: wish } } }),
    db.wishlistItem.createMany({ data: wish.map((productId) => ({ userId, productId })), skipDuplicates: true }),
  ]);
  return { cart: [...merged.values()].map((m) => m.line), wish, adjusted };
}
