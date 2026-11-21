import "server-only";
import type { ArtKind } from "@/lib/catalog";
import type { getUserOrders } from "./account";
import type { Thumb } from "@/components/account/OrderBits";
import type { CartLine } from "@/store/shop";

type O = Awaited<ReturnType<typeof getUserOrders>>[number];

/** Plain data for client components (thumbnails and "Buy again"). */
export const orderThumbs = (o: O): Thumb[] =>
  o.items.map((i) => {
    const p = i.variant.product;
    return { key: i.id, name: i.productName, kind: p.artKind as ArtKind, bg: p.bg, hex: i.variant.colorHex };
  });
export const orderLines = (o: O): CartLine[] => o.items.map((i) => ({ id: i.variant.productId, c: i.variant.position, q: i.quantity }));
export const itemCount = (o: O) => o.items.reduce((a, i) => a + i.quantity, 0);
