import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";

export const metadata: Metadata = { title: "Privacy policy", description: "How Nestora collects, uses and protects your personal information.", alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPolicy() {
  return (
    <PolicyPage eyebrow="Privacy" title="Your information," italic="kept safe." current="/privacy-policy" updated="17 November 2026"
      intro="We collect only what we need to deliver your order and look after your account, and we never sell your information.">
      <h2>What we collect</h2>
      <ul>
        <li><strong>Order details:</strong> your name, mobile number, email, delivery address and the pieces you order.</li>
        <li><strong>Account details:</strong> if you create an account, your login email, a securely hashed password, saved addresses and preferences.</li>
        <li><strong>Payment:</strong> online payments are handled by the payment provider you choose (for example bKash, Nagad or SSLCommerz). We receive a payment confirmation, never your card number or PIN.</li>
        <li><strong>Your bag and wishlist:</strong> stored in your browser, and in your account once you sign in.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To process, deliver and support your orders, including delivery updates by SMS.</li>
        <li>To run your account and keep it secure.</li>
        <li>To send newsletters, only if you choose to receive them. You can unsubscribe at any time.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>Only the services needed to fulfil your order: our delivery partners, payment providers, and the hosting and messaging providers that run this site. Each receives only what it needs.</p>
      <h2>How long we keep it</h2>
      <p>We keep order records as long as required for accounting and warranty purposes, and account data until you ask us to delete your account.</p>
      <h2>Your choices</h2>
      <p>You can ask to see, correct or delete your personal information by contacting us.</p>
    </PolicyPage>
  );
}
