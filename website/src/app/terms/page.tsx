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
          ConcordiaOrbis provides a digital commodity marketplace, research library, and escrow
          workflow. You must register with accurate information and keep your release codes private.
        </p>
        <h2>Payments</h2>
        <p>
          Fees shown at checkout are due through Paystack. Product payments stay in escrow until the
          client confirms delivery. Refunds follow our{" "}
          <Link href="/refunds" className="font-semibold text-brand-700">
            refund policy
          </Link>
          .
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>No fake listings, stolen photos, or misrepresented quantities</li>
          <li>No attempts to bypass farm access or escrow</li>
          <li>No abuse of other users or staff</li>
        </ul>
        <h2>Liability</h2>
        <p>
          We facilitate trade and hold escrow. Quality disputes after release are reviewed case by
          case. We are not liable for delays caused by Paystack, banks, or mobile-money operators.
        </p>
        <h2>Contact</h2>
        <p>
          <a className="font-semibold text-brand-700" href={`mailto:${CONTACT.hello}`}>
            {CONTACT.hello}
          </a>
        </p>
        </section>
      </ScrollReveal>
    </>
  );
}
