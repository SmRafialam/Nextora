import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Delivery policy", description: "Delivery times and charges for Nestora orders inside Dhaka and across Bangladesh.", alternates: { canonical: "/shipping-policy" } };

export default function ShippingPolicy() {
  return (
    <PolicyPage eyebrow="Delivery" title="Delivered" italic="with care." current="/shipping-policy" updated="17 November 2026"
      intro="We deliver across Bangladesh. Larger furniture inside Dhaka is brought in and placed by our own team.">
      <h2>Delivery times</h2>
      <ul>
        <li><strong>Inside Dhaka, smaller pieces:</strong> 2–3 days.</li>
        <li><strong>Inside Dhaka, furniture:</strong> delivered and placed in 5–7 days.</li>
        <li><strong>Express (Dhaka):</strong> next working day for in-stock pieces.</li>
        <li><strong>Outside Dhaka:</strong> smaller items 3–5 days, furniture 7–10 days by nationwide courier.</li>
      </ul>
      <p>Times are counted in working days from order confirmation. We will text you when your order is on its way.</p>
      <h2>Charges</h2>
      <ul>
        <li>Standard delivery inside Dhaka is free on orders of ৳ 15,000 or more after discounts; below that it is ৳ 600.</li>
        <li>Express delivery inside Dhaka is ৳ 1,200.</li>
        <li>Nationwide delivery outside Dhaka is ৳ 1,500.</li>
      </ul>
      <p>The exact charge is shown at checkout before you place your order.</p>
      <h2>On delivery day</h2>
      <p>Please make sure someone is home and that the piece can reach its room — check doorways, stairs and lift sizes against the dimensions on the product page. For Cash on Delivery orders, please have the exact amount ready.</p>
      <h2>Damaged or missing items</h2>
      <p>Please check your order when it arrives. If anything is damaged or missing, tell the delivery team and contact us within 48 hours with your order number and photos, and we will arrange a repair, replacement or refund.</p>
    </PolicyPage>
  );
}
