import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PLATFORM_MARKETPLACE_URL,
  PLATFORM_NAME,
  PLATFORM_REGISTER_URL,
  TAGLINE,
  TEAM,
} from "@/lib/company";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageSeo } from "@/lib/seo";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionHeader } from "@/components/SectionHeader";
import { AnimatedStat } from "@/components/AnimatedStat";
import { scrollStagger } from "@/lib/scrollStagger";

export const metadata: Metadata = {
  ...pageSeo({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  title: { absolute: DEFAULT_TITLE },
};

const STATS = [
  { value: "1,000+", label: "Verified users" },
  { value: "50+", label: "Districts covered" },
  { value: "100%", label: "Secure deliveries" },
];

const STEPS = [
  {
    step: "01",
    title: "Verified fellows list produce",
    desc: "Crops, livestock, fruit, and fish, with harvest windows and prices.",
    image: "/verified-users.png",
  },
  {
    step: "02",
    title: "Clients unlock a farm",
    desc: "A one-time access fee opens production details so they can order with confidence.",
    image: "/unlock-access.png",
  },
  {
    step: "03",
    title: "Pay ConcordiaOrbis",
    desc: "Clients pay ConcordiaOrbis directly through Paystack. The charge is complete once Paystack confirms it.",
    image: "/paystack-payment.png",
  },
  {
    step: "04",
    title: "Liaison officer delivers",
    desc: "A ConcordiaOrbis liaison officer procures the items, checks quality, and arranges delivery to the agreed location.",
    image: "/order-completed.png",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-brand-950 text-white">
        <Image
          src="/hero.jpg"
          alt="Farm landscape in Ghana for ConcordiaOrbis produce trading"
          fill
          priority
          className="object-cover object-[center_28%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/90 via-brand-950/75 to-brand-950/55 sm:bg-gradient-to-r sm:from-brand-950 sm:via-brand-950/85 sm:to-brand-900/25" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-950 to-transparent" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:justify-center sm:px-6 sm:pb-24 sm:pt-20">
          <ScrollReveal trigger="mount" delay={scrollStagger(0, 70)} duration={480}>
            <p className="text-sm font-semibold tracking-[0.12em] text-yellow-400">
              Premier commodity exchange platform
            </p>
          </ScrollReveal>
          <ScrollReveal trigger="mount" delay={scrollStagger(1, 70)} duration={540}>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              {PLATFORM_NAME}
              <span className="mt-2 block bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                {TAGLINE}
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal trigger="mount" delay={scrollStagger(2, 70)} duration={500}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-brand-100 sm:text-lg">
              Trade produce in Ghana: crops, livestock, fruit, and fish, with verified fellows
              and clients. Pay ConcordiaOrbis on Paystack; a liaison officer procures and delivers
              the order.
            </p>
          </ScrollReveal>
          <ScrollReveal trigger="mount" delay={scrollStagger(3, 70)} duration={480} className="pt-8">
            <div className="flex flex-row items-center gap-2 sm:gap-3">
              <a
                href={PLATFORM_REGISTER_URL}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-yellow-400 px-3 py-2.5 text-xs font-bold text-brand-900 shadow-[0_10px_30px_rgba(250,204,21,0.28)] transition hover:scale-[1.02] hover:bg-yellow-300 sm:flex-none sm:px-5 sm:text-sm"
              >
                Join {PLATFORM_NAME}
              </a>
              <a
                href={PLATFORM_MARKETPLACE_URL}
                className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-white/30 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:border-white/60 hover:bg-white/10 sm:flex-none sm:px-5 sm:text-sm"
              >
                Browse marketplace
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative bg-brand-950 py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-white/10 px-4">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={scrollStagger(i, 90)} duration={450}>
              <div className="px-3 text-center">
                <p className="text-2xl font-black tabular-nums text-yellow-400 sm:text-4xl">
                  <AnimatedStat value={stat.value} delay={scrollStagger(i, 90)} />
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-brand-50 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <ScrollReveal direction="fade-right" duration={560}>
            <div className="relative aspect-[4/5] max-h-[520px] overflow-hidden rounded-[2rem] shadow-2xl sm:aspect-[4/3]">
              <Image src="/trade.jpg" alt="Fellows and clients trading" fill className="object-cover" />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="fade-left" duration={560}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">The company</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-900 sm:text-4xl">
              Built in Ghana for real farms and real buyers.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              ConcordiaOrbis is the team behind the marketplace. We verify who trades, procure and
              deliver orders through liaison officers, and publish how mistaken Paystack charges are
              refunded.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex text-sm font-bold text-brand-800 underline decoration-brand-300 underline-offset-4 hover:text-brand-600"
            >
              Our story
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            badge="How trade works"
            title={
              <>
                Four steps from listing to{" "}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  delivery
                </span>
              </>
            }
            subtitle="Clients pay ConcordiaOrbis. A liaison officer then procures, checks quality, and delivers."
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {STEPS.map((item, i) => (
              <ScrollReveal key={item.step} delay={scrollStagger(i, 90)} duration={500}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:rounded-3xl">
                  <div className="flex justify-center bg-white px-3 pt-3 sm:block sm:bg-brand-50 sm:px-0 sm:pt-0">
                    <div className="relative aspect-[3/4] w-[7.5rem] overflow-hidden sm:w-full sm:p-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain p-1 sm:p-5 transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 120px, (max-width: 1024px) 50vw, 25vw"
                      />
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-black text-brand-900 shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
                        {item.step}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4 sm:gap-2 sm:p-5">
                    <h3 className="text-[15px] font-bold leading-snug text-brand-900 sm:text-base">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="mt-8 text-center">
            <Link href="/payments" className="text-sm font-bold text-brand-700 hover:underline">
              Full payment detail
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-950 py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            theme="dark"
            badge="Leadership"
            title={
              <>
                The people behind{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                  ConcordiaOrbis
                </span>
              </>
            }
            subtitle="A small executive team. Full bios live on the Team page."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {TEAM.map((member, i) => (
              <ScrollReveal key={member.name} delay={scrollStagger(i, 110)} duration={560}>
                <Link href="/team" className="group block">
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-2xl bg-brand-900 ring-1 ring-white/10 transition duration-500 group-hover:-translate-y-1 group-hover:ring-yellow-400/40">
                    <Image src={member.img} alt={member.name} fill className="object-contain p-1" />
                  </div>
                  <h3 className="mt-4 text-center text-lg font-bold group-hover:text-yellow-300">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-center text-sm font-semibold text-yellow-400">{member.role}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 py-24 text-white">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
        <ScrollReveal className="relative mx-auto max-w-3xl px-6 text-center" duration={550}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Get started</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Ready to transform how you trade?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Create a free account on the platform. For mistaken charges, use Refunds, not this
            button.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={PLATFORM_REGISTER_URL}
              className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-8 py-4 text-base font-bold text-brand-900 shadow-[0_8px_30px_rgba(250,204,21,0.35)] transition hover:scale-[1.02] hover:bg-yellow-300"
            >
              Create free account
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-white/40 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Contact the company
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
