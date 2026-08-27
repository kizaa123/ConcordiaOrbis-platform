import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamFlipCard } from "@/components/TeamFlipCard";
import { scrollStagger } from "@/lib/scrollStagger";
import { CONTACT, TEAM } from "@/lib/company";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 px-4 py-20 text-white sm:px-6 sm:py-28">
        <Image
          src="/team/staffs.jpg"
          alt="ConcordiaOrbis team"
          fill
          priority
          className="object-cover object-top opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/75 to-brand-950" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <ScrollReveal trigger="mount" delay={scrollStagger(0, 70)} duration={480}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">People</p>
          </ScrollReveal>
          <ScrollReveal trigger="mount" delay={scrollStagger(1, 70)} duration={520}>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              The team behind{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                ConcordiaOrbis
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal trigger="mount" delay={scrollStagger(2, 70)} duration={500}>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-200 sm:text-lg">
              Leadership in Accra — the faces customers, partners, and Paystack can verify.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-brand-700/25 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            theme="dark"
            badge="Leadership"
            title="Executive team"
          />

          <div className="grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member, i) => (
              <ScrollReveal
                key={member.name}
                className="w-full max-w-[16.75rem]"
                direction="fade-in"
                delay={scrollStagger(i, 120)}
                duration={600}
              >
                <TeamFlipCard member={member} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <ScrollReveal direction="fade-right" duration={560}>
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] shadow-xl">
              <Image src="/team/staffs.jpg" alt="Operations and support staff" fill className="object-cover object-top" />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="fade-left" duration={560}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Around the table</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-900 sm:text-4xl">
              Operations that settle the trade
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Accountants and liaison officers review farm access, release escrow after delivery,
              and look at payments that don’t match. They are why a mistaken Paystack charge can be
              traced and refunded.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex text-sm font-bold text-brand-800 underline decoration-brand-300 underline-offset-4 hover:text-brand-600"
            >
              Reach the company
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 py-20 text-white">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
        <ScrollReveal className="relative mx-auto max-w-xl px-6 text-center" duration={550}>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Want to talk to us?</h2>
          <p className="mt-3 text-brand-100">
            Partnerships, Paystack reviews, and refund requests go through{" "}
            <a href={`mailto:${CONTACT.hello}`} className="font-semibold text-yellow-300">
              {CONTACT.hello}
            </a>
            .
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-2xl bg-yellow-400 px-8 py-4 text-base font-bold text-brand-900 transition hover:scale-[1.02] hover:bg-yellow-300"
          >
            Contact page
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
