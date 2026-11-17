import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { priceCart } from "@/lib/pricing";
import { OrderView, type OrderSummary } from "@/components/checkout/OrderView";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

type Props = { params: Promise<{ orderId: string }> };

// Phase 6 loads the order from the database (and checks it belongs to the visitor).
// Until then only the clearly labelled sample exists, so the page can be previewed.
function sampleOrder(): OrderSummary {
  const t = priceCart([{ id: "halden", c: 0, q: 1 }, { id: "sorrel", c: 0, q: 2 }], { ship: "std", inDhaka: true });
  return {
    no: "NS-SAMPLE", sample: true, placedAt: new Date(),
    name: "Nadia Karim", email: "nadia@example.com", phone: "01700000000", address: "House 12, Road 5, Dhanmondi, Dhaka",
    pay: "cod", shipId: t.shipping.id, shipName: t.shipping.label,
    lines: t.lines, subtotal: t.subtotal, discount: t.discount, shipping: t.shipping.price, total: t.total,
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  if (orderId !== "sample") notFound();
  return <OrderView o={sampleOrder()} />;
}
