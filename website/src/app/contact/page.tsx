import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";
import { ScrollReveal } from "@/components/ScrollReveal";
import { COMPANY, CONTACT } from "@/lib/company";
import { pageSeo } from "@/lib/seo";
import { WhatsAppFavicon } from "@/components/WhatsAppSupport";

export const metadata: Metadata = pageSeo({
  title: "Contact us in Accra, Ghana",
  description:
    "Contact ConcordiaOrbis in Accra for partnerships, Paystack payment reviews, farm order questions, and refunds. We reply on Ghana business days.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Reach us"
        title="Contact"
        subtitle="Partnerships, Paystack reviews, and refund requests. We reply on business days."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <ScrollReveal direction="fade-right" className="space-y-5">
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Office</p>
            <p className="mt-2 font-bold text-brand-900">
              {COMPANY.city}, {COMPANY.country}
            </p>
            <p className="mt-1 text-sm text-gray-500">{COMPANY.supportHours}</p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Email</p>
            <a href={`mailto:${CONTACT.hello}`} className="mt-2 block font-semibold text-brand-800">
              {CONTACT.hello}
            </a>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">WhatsApp</p>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-3 font-semibold text-brand-800 transition hover:text-[#128C7E]"
            >
              <WhatsAppFavicon className="h-10 w-10 shrink-0" />
              Chat on WhatsApp
            </a>
          </div>
          <SocialLinks />
        </ScrollReveal>
        <ScrollReveal direction="fade-left">
          <ContactForm />
        </ScrollReveal>
      </section>
    </>
  );
}
