import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Terms of service", description: "The terms that apply when you shop with Nestora.", alternates: { canonical: "/terms" } };

export default function Terms() {
  return (
    <PolicyPage eyebrow="Terms" title="Terms of" italic="service." current="/terms" updated="17 November 2026"
      intro="These terms apply when you browse Nestora or place an order with us.">
      <h2>Orders</h2>
      <p>When you place an order, we confirm it by email or SMS. An order is accepted once confirmed. We may cancel an order if a piece is out of stock, if a price was shown in error, or if we cannot verify the order; any payment made will be refunded in full.</p>
      <h2>Prices and payment</h2>
      <p>Prices are in Bangladeshi Taka (৳) and include VAT where applicable. Delivery charges are shown at checkout. Online payments are processed by the provider you select; Cash on Delivery orders are paid when the order arrives.</p>
      <h2>Product details</h2>
      <p>We describe and illustrate our pieces as accurately as we can. Natural materials such as wood, linen and stoneware vary, so colour and grain may differ slightly from piece to piece.</p>
      <h2>Delivery and returns</h2>
      <p>Delivery is covered by our <Link href="/shipping-policy">delivery policy</Link> and returns by our <Link href="/return-policy">returns policy</Link>.</p>
      <h2>Accounts</h2>
      <p>You are responsible for keeping your login details private. Tell us straight away if you think someone else has used your account.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. The version in force when you place an order applies to that order.</p>
    </PolicyPage>
  );
}
