import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { scrollStagger } from "@/lib/scrollStagger";

export const metadata: Metadata = { title: "Payments" };

const STEPS = [
  {
    title: "Pay on the platform",
    body: "Farm access, product orders, and research purchases start in the app. Paystack handles card, mobile money, and bank transfer.",
  },
  {
    title: "Pending until Paystack confirms",
    body: "Nothing is marked paid until the charge succeeds. A declined payment creates no order.",
  },
  {
    title: "The fellow prepares delivery",
    body: "You get a 4-digit confirmation code. The fellow ships the order. Nothing is marked received yet.",
  },
  {
    title: "You confirm on delivery",
    body: "Enter the code when goods arrive. That updates the fellow and the accountant that the order was received.",
  },
];

export default function PaymentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="How payments work"
        subtitle="Paystack takes the charge. You confirm delivery so the fellow and accountant know the order arrived."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <ol className="space-y-4">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.title} delay={scrollStagger(i, 90)}>
              <li className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-brand-900">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-bold text-brand-900">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.body}</p>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
        <ScrollReveal className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/80 p-5 text-sm text-gray-600">
          Charged in error, charged twice, or deducted on a failed payment? That process lives on{" "}
          <Link href="/refunds" className="font-bold text-brand-800 underline">
            Refunds
          </Link>
          — we don’t repeat it here.
        </ScrollReveal>
      </section>
    </>
  );
}
