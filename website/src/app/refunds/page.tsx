import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { scrollStagger } from "@/lib/scrollStagger";
import { CONTACT } from "@/lib/company";

export const metadata: Metadata = { title: "Refunds" };

const CASES = [
  {
    title: "Duplicate or mistaken charge",
    body: "Captured twice, or billed after you cancelled: full refund to the original method once we match the Paystack reference.",
  },
  {
    title: "Failed payment that still deducted money",
    body: "Paystack often auto-reverses within about 24 hours. If not, send the SMS or receipt and we raise the refund.",
  },
  {
    title: "Wrong amount",
    body: "Overcharge: we refund the difference. Entire transaction in error: we refund the full amount.",
  },
  {
    title: "Farm access paid by mistake",
    body: "Unused access: request within 48 hours. After you unlock listings and start ordering, the fee is generally kept.",
  },
  {
    title: "Order cancelled before dispatch",
    body: "Still at “order received”: we cancel, restock, and refund escrow in full.",
  },
  {
    title: "After you confirm delivery",
    body: "The release code frees escrow. After that we only review documented quality or shortage issues — not a change of mind.",
  },
];

export default function RefundsPage() {
  return (
    <>
      <PageHero
        eyebrow="Mistaken transactions"
        title="Refunds"
        subtitle="Approved refunds go back through Paystack to the same card, wallet, or bank — typically 5–10 business days."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <ScrollReveal>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
            Email{" "}
            <a className="font-bold underline" href={`mailto:${CONTACT.payments}`}>
              {CONTACT.payments}
            </a>{" "}
            with your name, account email, amount, date, and Paystack reference. We reply within two
            business days.
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-4">
          {CASES.map((item, i) => (
            <ScrollReveal key={item.title} delay={scrollStagger(i, 70)}>
              <article className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h2 className="font-bold text-brand-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
