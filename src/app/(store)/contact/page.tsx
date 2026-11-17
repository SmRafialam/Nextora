import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { TOPICS, type Topic } from "@/components/contact/topics";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about an order, a piece, or styling a room — talk to the Nestora team or book a showroom visit in Dhaka.",
  alternates: { canonical: "/contact" },
};

const FAQ = [
  ["How long does delivery take?", "Smaller pieces arrive in Dhaka within 2–3 days. Larger furniture is delivered and placed by our own team within 5–7 days. Outside Dhaka, allow 7–10 days."],
  ["Is delivery free?", "Delivery inside Dhaka is free on orders above ৳ 15,000. Below that, standard delivery is ৳ 600. Nationwide delivery is ৳ 1,500."],
  ["Can I return a piece?", "Yes — within 7 days of delivery, in its original condition. We collect larger items from your home."],
  ["Which payment methods do you accept?", "Cash on delivery. bKash, Nagad and card payments are being connected and will appear at checkout once they are live."],
  ["Do you offer styling help?", "Our stylists offer free advice by message or in the showroom. Send us a photo of your room and we will suggest pieces that fit."],
];

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const t = (await searchParams).topic;
  const topic: Topic = TOPICS.some(([id]) => id === t) ? (t as Topic) : "order";
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <section className="nx-wrap" style={{ paddingTop: 80, paddingBottom: 56 }}>
        <div className="nx-rise" style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <span className="nx-eyebrow">Contact</span>
          <h1 className="nx-f" style={{ margin: 0, fontWeight: 300, fontSize: "clamp(56px, 8vw, 124px)", lineHeight: 0.9, letterSpacing: "-.04em" }}>We&apos;d love <span style={{ fontStyle: "italic", color: "#9A5B40" }}>to hear from you.</span></h1>
          <p style={{ margin: 0, maxWidth: 520, fontSize: 17, lineHeight: 1.7, color: "#45463F" }}>Questions about an order, a piece, or how to style a room — our team usually replies within one working day.</p>
        </div>
      </section>

      <section className="nx-wrap nx-contact" style={{ paddingBottom: 120 }}>
        <div className="nx-reveal" style={{ background: "#FFFFFF", borderRadius: 6, padding: "clamp(24px, 4vw, 48px)" }}>
          <ContactForm initialTopic={topic} />
        </div>
        <aside className="nx-reveal" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="nx-eyebrow">Showroom</span>
            <span className="nx-f" style={{ fontSize: 26, lineHeight: 1.25 }}>{SITE.showroom}<br />{SITE.city}</span>
            <span style={{ fontSize: 14, lineHeight: 1.7, color: "#45463F" }}>{SITE.hours}<br />{SITE.closed}</span>
          </div>
          <div style={{ padding: "28px 0", borderTop: "1px solid rgba(34,35,33,.12)", display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="nx-eyebrow">Talk to us</span>
            <span style={{ fontSize: 15 }}>{SITE.phone}</span>
            <span style={{ fontSize: 15 }}>{SITE.email}</span>
            <span style={{ fontSize: 13, color: "#5C5D59" }}>{SITE.phoneHours}</span>
          </div>
          <div style={{ padding: "28px 0", borderTop: "1px solid rgba(34,35,33,.12)", display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="nx-eyebrow">Already ordered?</span>
            <span style={{ fontSize: 14, lineHeight: 1.6, color: "#45463F" }}>Track delivery and manage returns from your account.</span>
            <Link className="nx-btn nx-ghost" href="/account/orders" style={{ alignSelf: "flex-start" }}>Go to my orders</Link>
          </div>
        </aside>
      </section>

      <section style={{ background: "#EFE9DF", padding: "112px 0" }}>
        <div className="nx-wrap" style={{ maxWidth: 920 }}>
          <h2 className="nx-f nx-reveal" style={{ margin: "0 0 32px", fontWeight: 300, fontSize: "clamp(36px, 4.4vw, 60px)", letterSpacing: "-.025em" }}>Common <span style={{ fontStyle: "italic" }}>questions</span></h2>
          {FAQ.map(([q, a]) => (
            <details key={q} className="nx-acc" style={{ borderTop: "1px solid rgba(34,35,33,.15)" }}><summary>{q}</summary><p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.75, color: "#45463F", maxWidth: 720 }}>{a}</p></details>
          ))}
          <div style={{ borderTop: "1px solid rgba(34,35,33,.15)" }} />
        </div>
      </section>
    </>
  );
}
