import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CONTACT, PLATFORM_NAME } from "@/lib/company";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        subtitle={`How ${PLATFORM_NAME} collects, uses, and protects personal and payment information.`}
      />
      <ScrollReveal>
        <section className="prose-legal mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p>Last updated: 27 August 2026</p>
        <h2>Information we collect</h2>
        <p>
          Account details (name, email, phone, country, role), farm and listing data you publish,
          order and delivery records, verification status, and messages you send on the platform.
        </p>
        <h2>Payments</h2>
        <p>
          Card and mobile-money details are collected by Paystack, not stored on our servers. We
          keep transaction references, amounts, and status so we can fulfil orders and process
          refunds.
        </p>
        <h2>How we use data</h2>
        <ul>
          <li>To operate the marketplace, library, and order fulfilment</li>
          <li>To verify users and prevent fraud</li>
          <li>To notify you about orders and access</li>
          <li>To handle refunds and support</li>
        </ul>
        <h2>Sharing</h2>
        <p>
          We share what a trade requires so a liaison officer can procure and deliver an order.
          Paystack processes payments to ConcordiaOrbis. We do not sell personal data.
        </p>
        <h2>Contact</h2>
        <p>
          Privacy questions:{" "}
          <a className="font-semibold text-brand-700" href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp Support & Assistant
          </a>{" "}
          or{" "}
          <a className="font-semibold text-brand-700" href={`mailto:${CONTACT.hello}`}>
            {CONTACT.hello}
          </a>
        </p>
        </section>
      </ScrollReveal>
    </>
  );
}
