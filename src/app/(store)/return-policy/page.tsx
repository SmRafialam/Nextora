import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Returns policy", description: "7-day easy returns and a 2-year craftsmanship guarantee on Nestora pieces.", alternates: { canonical: "/return-policy" } };

export default function ReturnPolicy() {
  return (
    <PolicyPage eyebrow="Returns" title="Easy" italic="returns." current="/return-policy" updated="17 November 2026"
      intro="If a piece isn't right for your home, you can return it within 7 days of delivery.">
      <h2>7-day returns</h2>
      <p>You can return most pieces within 7 days of delivery, unused and in their original condition and packaging. Contact us with your order number to start a return; we collect larger items from your home.</p>
      <h2>What can&apos;t be returned</h2>
      <ul>
        <li>Pieces that have been used, assembled and damaged, or altered.</li>
        <li>Made-to-order or custom pieces, unless they arrive faulty.</li>
      </ul>
      <h2>Refunds</h2>
      <p>Once we have collected and checked the piece, we refund the price of the returned items to your original payment method, or by bKash or bank transfer for Cash on Delivery orders. Delivery charges are refunded only when the return is due to our error or a faulty piece.</p>
      <h2>Faulty pieces and the 2-year guarantee</h2>
      <p>Our pieces carry a 2-year craftsmanship guarantee against manufacturing faults. If something goes wrong with normal use, contact us with photos and we will repair or replace it. The guarantee does not cover normal wear, misuse or accidental damage.</p>
    </PolicyPage>
  );
}
