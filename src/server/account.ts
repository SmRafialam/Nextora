import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "./db";

/** The signed-in user, or a redirect to sign-in. Middleware already guards /account; this is the second check. */
export const requireUser = cache(async (next = "/account") => {
  const s = await auth();
  if (!s?.user?.id) redirect(`/login?next=${encodeURIComponent(next)}`);
  const u = await db.user.findUnique({ where: { id: s.user.id } });
  if (!u) redirect("/login");
  return u;
});

export const STEPS = ["Confirmed", "Packed", "On its way", "Delivered"] as const;
const STEP_OF: Partial<Record<OrderStatus, number>> = { CONFIRMED: 0, PACKED: 1, SHIPPED: 2, DELIVERED: 3 };
const LABEL: Record<OrderStatus, string> = {
  PENDING: "Awaiting payment", CONFIRMED: "Confirmed", PACKED: "Packed", SHIPPED: "On its way",
  DELIVERED: "Delivered", CANCELLED: "Cancelled", REFUNDED: "Refunded",
};
export const statusView = (s: OrderStatus) => ({
  label: LABEL[s],
  step: STEP_OF[s] ?? -1,
  pill: s === "DELIVERED" ? { background: "#E3E7E1", color: "#3F4A3D" } : s === "CANCELLED" || s === "REFUNDED" ? { background: "#ECEAE6", color: "#45463F" } : { background: "#F1E2D9", color: "#7A4430" },
});

const orderInclude = { items: { include: { variant: { include: { product: true } } } } } as const;

export const getUserOrders = (userId: string) =>
  db.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: orderInclude });

export const getUserOrder = (userId: string, number: string) =>
  db.order.findFirst({ where: { userId, number }, include: { ...orderInclude, events: { orderBy: { createdAt: "asc" } } } });

export const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });
export const taka = (paisa: number) => paisa / 100;
