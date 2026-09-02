import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CONTACT, PLATFORM_NAME } from "@/lib/company";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        subtitle={`Rules for using the ${PLATFORM_NAME} company site and trading platform.`}
      />
      <ScrollReveal>
        <section className="prose-legal mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p>Last updated: 27 August 2026</p>
        <h2>The service</h2>
        <p>
          ConcordiaOrbis provides a digital commodity marketplace and research library. Clients pay
          ConcordiaOrbis directly. You must register with accurate information.
        </p>
        <h2>Payments</h2>
        <p>
          Fees shown at checkout are due through Paystack to ConcordiaOrbis. Upon confirmation of
          payment, a ConcordiaOrbis liaison officer procures the requested items from verified
          suppliers, oversees quality and order accuracy, and arranges secure delivery to the client
          at the agreed location. Refunds follow our{" "}
          <Link href="/refunds" className="font-semibold text-brand-700">
            refund policy
          </Link>
          .
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>No fake listings, stolen photos, or misrepresented quantities</li>
          <li>No attempts to bypass farm access or checkout</li>
          <li>No abuse of other users or staff</li>
        </ul>
        <h2>Liability</h2>
        <p>
          We facilitate trade. Quality disputes after delivery are reviewed case by
          case. We are not liable for delays caused by Paystack, banks, or mobile-money operators.
        </p>
        <h2>Contact</h2>
        <p>
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
