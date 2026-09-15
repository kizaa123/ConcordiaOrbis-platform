import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { scrollStagger } from "@/lib/scrollStagger";
import { PLATFORM_NAME } from "@/lib/company";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "About ConcordiaOrbis B2B Marketplace",
  description:
    "Africa's Digital B2B Marketplace, Connecting Business with Clients. ConcordiaOrbis is a Ghana-based B2B marketplace in Accra for verified businesses, clients, and liaison officers.",
  path: "/about",
});

const ROLES = [
  { title: "Businesses", desc: "Organizations and sellers who list products for clients on the ConcordiaOrbis B2B marketplace." },
  { title: "Clients", desc: "Companies and buyers who unlock listings, then place product orders." },
  { title: "Liaison officers", desc: "Fellow Liaison Officers who represent businesses and clients, procure orders, check quality, and arrange delivery." },
  { title: "Library users", desc: "Researchers who publish, and readers who buy field knowledge." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title={`About ${PLATFORM_NAME}`}
        subtitle="Africa's Digital B2B Marketplace, connecting verified businesses with clients from Accra across Ghana and beyond."
      />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <ScrollReveal direction="fade-right" duration={550}>
          <div className="relative min-h-[340px] overflow-hidden rounded-3xl shadow-xl">
            <Image src="/community.jpg" alt="ConcordiaOrbis community" fill className="object-cover" />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="fade-left" duration={550}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Mission</p>
          <h2 className="mt-2 text-3xl font-black text-brand-900">Fair, traceable trade.</h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            We built {PLATFORM_NAME} so businesses and clients can trade on a verified B2B
            marketplace without losing money or identity to unverified middlemen. Sellers list
            products; clients pay ConcordiaOrbis. This website is the public company record.
          </p>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Headquarters: Accra, Ghana. The marketplace is used across Africa and beyond.
          </p>
        </ScrollReveal>
      </section>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-black text-brand-900">Who we serve</h2>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {ROLES.map((role, i) => (
              <ScrollReveal key={role.title} delay={scrollStagger(i, 90)}>
                <article className="rounded-2xl border border-brand-100 bg-brand-50/50 p-6 transition hover:-translate-y-1 hover:shadow-md">
                  <h3 className="font-bold text-brand-900">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{role.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
