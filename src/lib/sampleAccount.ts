// TEMPORARY preview data for the account pages. Phase 5 replaces it with the signed-in
// customer's real profile, addresses and orders; the pages are labelled as a preview until then.
import { priceCart, type ShipId } from "./pricing";
import type { CartLine } from "@/store/shop";

export const ORDER_STEPS = ["Confirmed", "Packed", "On its way", "Delivered"] as const;
export type OrderStatus = (typeof ORDER_STEPS)[number];

export const SAMPLE_USER = { name: "Nadia Karim", email: "nadia@example.com", phone: "01700000000", since: 2025 };

export const SAMPLE_ADDRESSES = [
  { id: "a1", label: "Home", line: "House 12, Road 5, Dhanmondi, Dhaka 1205", isDefault: true },
  { id: "a2", label: "Office", line: "Level 4, 22 Gulshan Avenue, Dhaka 1212", isDefault: false },
];

const RAW: { no: string; date: string; status: OrderStatus; ship: ShipId; items: CartLine[] }[] = [
  { no: "NS-482190", date: "2026-10-02", status: "Delivered", ship: "std", items: [{ id: "orla", c: 0, q: 1 }, { id: "mira", c: 1, q: 2 }] },
  { no: "NS-417733", date: "2026-07-14", status: "Delivered", ship: "std", items: [{ id: "kiri", c: 0, q: 1 }] },
];

export const SAMPLE_ORDERS = RAW.map((o) => {
  const t = priceCart(o.items, { ship: o.ship, inDhaka: true });
  return { ...o, placedAt: new Date(`${o.date}T10:00:00+06:00`), lines: t.lines, count: t.count, subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total };
});
export type SampleOrder = (typeof SAMPLE_ORDERS)[number];

export const getSampleOrder = (no: string) => SAMPLE_ORDERS.find((o) => o.no === no);
export const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });
export const statusPill = (s: OrderStatus) => (s === "Delivered" ? { background: "#E3E7E1", color: "#3F4A3D" } : { background: "#F1E2D9", color: "#7A4430" });
