import "server-only";
// TEMPORARY preview orders for the account pages (see lib/sampleAccount.ts). Replaced in Phase 5/6.
import { priceCart, type ShipId } from "@/lib/pricing";
import type { CartLine } from "@/store/shop";
import type { OrderStatus } from "@/lib/sampleAccount";
import { getAllProducts } from "./catalog";

const RAW: { no: string; date: string; status: OrderStatus; ship: ShipId; items: CartLine[] }[] = [
  { no: "NS-482190", date: "2026-10-02", status: "Delivered", ship: "std", items: [{ id: "orla", c: 0, q: 1 }, { id: "mira", c: 1, q: 2 }] },
  { no: "NS-417733", date: "2026-07-14", status: "Delivered", ship: "std", items: [{ id: "kiri", c: 0, q: 1 }] },
];

export const getSampleOrders = async () => {
  const all = await getAllProducts();
  const byId = new Map(all.map((p) => [p.id, p]));
  return RAW.map((o) => {
  const t = priceCart(o.items, (id) => byId.get(id), { ship: o.ship, inDhaka: true });
  return { ...o, placedAt: new Date(`${o.date}T10:00:00+06:00`), lines: t.lines, count: t.count, subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total };
});
};
export type SampleOrder = Awaited<ReturnType<typeof getSampleOrders>>[number];

export const getSampleOrder = async (no: string) => (await getSampleOrders()).find((o) => o.no === no);
