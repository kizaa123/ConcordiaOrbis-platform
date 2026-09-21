
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon, type IconName } from "@/components/icons";
import { PortalNavCard } from "@/components/PortalNavCard";
import { BrandHeroCopy } from "@/components/BrandHeroCopy";
import { AnimatedStat } from "@/components/AnimatedStat";
import { ScrollReveal } from "@/components/ScrollReveal";
import { scrollStagger } from "@/lib/scrollStagger";
import { HOW_IT_WORKS_IMAGES } from "@/lib/homepageImages";
import { PLATFORM_NAME } from "@/lib/site";

const STATS = [
  { value: "1,000+", label: "Verified Users" },
  { value: "50+", label: "Districts Covered" },
  { value: "100%", label: "Secure Transactions" },
];

const HOW_IT_WORKS: { step: number; title: string; desc: string; image: string }[] = [
  {
    step: 1,
    title: "Fellows Register",
    desc: "Create a verified profile, select your crops or livestock, and list your commodities with prices, quantities and delivery dates.",
    image: HOW_IT_WORKS_IMAGES.farmersRegister,
  },
  {
    step: 2,
    title: "Clients Pay for Access",
    desc: "Browse previews freely. Pay a one-time access fee to unlock full fellow data, quantities, contact details and direct messaging.",
    image: HOW_IT_WORKS_IMAGES.buyersPay,
  },
  {
    step: 3,
    title: "Agents Represent",
    desc: "Fellow Liaison Officers negotiate on behalf of clients, manage relationships and streamline deals.",
    image: HOW_IT_WORKS_IMAGES.agentsRepresent,
  },
  {
    step: 4,
    title: "Connect & Trade",
    desc: "Request connections, chat securely, finalise orders and track financials, all in one protected platform.",
    image: HOW_IT_WORKS_IMAGES.connectTrade,
  },
];

/**
 * Homepage role card photos live in frontend/public/.
 * Supplier / Trader / Manufacturer / Exporter files:
 *   frontend/public/supliers.jpeg
 *   frontend/public/business-deal-handshake-over-contract-documents-white-table-two-individuals-shaking-hands-over-table-contract-385032306.webp
 *   frontend/public/istockphoto-1056447582-612x612.jpg
 *   frontend/public/foreman-control-loading-containers-box-to-truck-for-logistic-import-export-.jpg
 */
const ROLE_CARD_IMAGES = {
  supplier: "/supliers.jpeg",
  trader: "/business-deal-handshake-over-contract-documents-white-table-two-individuals-shaking-hands-over-table-contract-385032306.webp",
  manufacturer: "/istockphoto-1056447582-612x612.jpg",
  exporter: "/foreman-control-loading-containers-box-to-truck-for-logistic-import-export-.jpg",
  client: "/farmer and buyer.jpg",
  student: "/agricultural-students-woman-evaluating-crop-growth-notes-focused-documenting-plant-health-check-vegetable-growth-problems-465673929.webp",
  organization: "/CropsBlaringhem-LowRes-265.jpg",
  handler: "/farmer and her agent.webp",
  researcher: "/Agric researchers.jpg",
} as const;

const ROLE_CARDS: { icon: IconName; label: string; desc: string; image: string }[] = [
  {
    icon: "store",
    label: "Supplier",
    desc: "List wholesale stock, set prices and delivery windows, and reach verified clients across the marketplace.",
    image: ROLE_CARD_IMAGES.supplier,
  },
  {
    icon: "handshake",
    label: "Trader",
    desc: "Source and resell products, manage orders, and close deals with clients and fellow liaison officers.",
    image: ROLE_CARD_IMAGES.trader,
  },
  {
    icon: "package",
    label: "Manufacturer",
    desc: "Showcase finished goods, production capacity, and fulfilment dates so clients can order at scale.",
    image: ROLE_CARD_IMAGES.manufacturer,
  },
  {
    icon: "truck",
    label: "Exporter",
    desc: "Offer cross-border supply, shipping windows, and export-ready lots to clients buying from Ghana and beyond.",
    image: ROLE_CARD_IMAGES.exporter,
  },
  {
    icon: "cart",
    label: "Client",
    desc: "Browse verified products, preview listings for free, unlock full fellow details, purchase research publications, and source commodities securely.",
    image: ROLE_CARD_IMAGES.client,
  },
  {
    icon: "book",
    label: "Student",
    desc: "Access the Research Library, purchase and read publications, and learn from verified field research published by ConcordiaOrbis researchers.",
    image: ROLE_CARD_IMAGES.student,
  },
  {
    icon: "handshake",
    label: "Fellow Liaison Officer",
    desc: "Represent fellows and clients, manage relationships, negotiate deals, and streamline transactions on the platform.",
    image: ROLE_CARD_IMAGES.handler,
  },
  {
    icon: "book",
    label: "Researcher",
    desc: "Discover knowledge, publish with confidence, and collaborate across disciplines to solve real-world challenges.",
    image: ROLE_CARD_IMAGES.researcher,
  },
  {
    icon: "users",
    label: "Organization",
    desc: "Register as an institution or cooperative to source commodities, manage procurement, and coordinate trade through ConcordiaOrbis liaison officers.",
    image: ROLE_CARD_IMAGES.organization,
  },
];

function SectionHeader({
  badge,
  title,
  subtitle,
  theme = "light",
}: {
  badge: string;
  title: ReactNode;
  subtitle: string;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  return (
    <ScrollReveal className="mb-14 text-center" duration={500} direction="fade-up">
      <span
        className={`mb-4 inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-widest ${
          isDark
            ? "border border-brand-600/50 bg-brand-800/60 text-yellow-400 backdrop-blur-sm"
            : "border border-brand-200 bg-brand-100/80 text-brand-700"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-yellow-400" : "bg-brand-600"}`} />
        {badge}
      </span>
      <h2
        className={`text-2xl font-bold tracking-tight sm:text-4xl sm:font-black lg:text-[2.75rem] ${
          isDark ? "text-white" : "text-brand-900"
        }`}
      >
        {title}
      </h2>
      <div
        className={`mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${
          isDark
            ? "from-yellow-400/0 via-yellow-400 to-yellow-400/0"
            : "from-brand-500/0 via-brand-500 to-brand-500/0"
        }`}
      />
      <p
        className={`mx-auto mt-5 max-w-xl text-base leading-relaxed ${
          isDark ? "text-brand-300" : "text-gray-500"
        }`}
      >
        {subtitle}
      </p>
    </ScrollReveal>
  );
}

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative flex min-h-[70dvh] items-center overflow-hidden bg-brand-900 sm:min-h-[85vh] sm:items-start lg:min-h-[92vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/edited flag for the ani bag.jpg"
            alt="Agricultural field background"
            fill
            className="object-cover object-[center_25%] sm:object-center"
            sizes="100vw"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_35%,rgba(116,198,157,0.28),transparent_68%),linear-gradient(135deg,rgba(82,183,136,0.18)_0%,transparent_50%,rgba(64,145,108,0.1)_100%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/90 via-brand-900/75 to-brand-900/60 sm:bg-gradient-to-r sm:from-brand-950/95 sm:via-brand-900/80 sm:to-brand-800/30" />
          {/* Smooth fade into the stats band */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-brand-950 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:pt-16 sm:pb-24 lg:pt-20">
          <div className="max-w-3xl">
            <BrandHeroCopy
              size="hero"
              actions={
                <div className="flex w-full max-w-xl flex-row gap-3 sm:gap-4">
                  <Link
                    href="/register"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-yellow-400 px-4 py-4 text-sm font-bold text-brand-900 shadow-[0_8px_30px_rgba(250,204,21,0.35)] transition-all hover:scale-[1.02] hover:bg-yellow-300 sm:px-8 sm:text-base sm:min-w-[12rem]"
                  >
                    Join {PLATFORM_NAME}
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-white/30 bg-white/5 px-4 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10 sm:px-8 sm:text-base sm:min-w-[12rem]"
                  >
                    Sign In
                  </Link>
                </div>
              }
            />
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
          <div className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/25 p-1.5">
            <span className="h-2 w-1 animate-bounce rounded-full bg-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative bg-brand-950 py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <ScrollReveal key={s.label} delay={scrollStagger(i, 90)} duration={450} direction="fade-up">
                <div className="px-3 text-center sm:px-6">
                  <p className="text-3xl font-black tabular-nums text-yellow-400 sm:text-4xl lg:text-[2.75rem]">
                    <AnimatedStat value={s.value} delay={scrollStagger(i, 90)} />
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-300 sm:text-xs">
                    {s.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="relative bg-brand-50 py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6">
          <SectionHeader
            badge="Built for Everyone"
            title={
              <>
                One Platform,{" "}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  Many Roles
                </span>
              </>
            }
            subtitle={`Whether you produce it, buy it, or broker it, ${PLATFORM_NAME} has a tailored experience designed for your role.`}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ROLE_CARDS.map((r, i) => (
              <ScrollReveal key={r.label} delay={scrollStagger(i, 100)} duration={500} direction="fade-up">
                <PortalNavCard
                  href="/register"
                  title={r.label}
                  desc={r.desc}
                  icon={r.icon}
                  image={r.image}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader
            badge="Simple Process"
            title={
              <>
                How It{" "}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  Works
                </span>
              </>
            }
            subtitle="Four simple steps from registration to closed deal, all protected by our secure escrow system."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, i) => (
              <ScrollReveal key={item.step} delay={scrollStagger(i, 100)} duration={500} direction="fade-up">
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-xl">
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/25 to-transparent" />
                    <span className="absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-brand-900 shadow-lg ring-2 ring-white/60">
                      {item.step}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">
                      Step {item.step} of 4
                    </p>
                    <h3 className="text-lg font-bold text-brand-900 transition-colors group-hover:text-brand-700">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 py-28 text-white">
        <div className="absolute inset-0 bg-[url('/login_cover.png')] bg-cover bg-center opacity-10" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

        <ScrollReveal className="relative z-10 mx-auto max-w-3xl px-6 text-center" duration={550} direction="fade-up">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-yellow-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            Get Started Today
          </span>
          <h2 className="mb-5 text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl sm:font-black md:text-5xl">
            Ready to Transform{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
              How You Trade?
            </span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-brand-100 md:text-xl">
            Join fellows, clients, and liaison officers using {PLATFORM_NAME} to trade commodities safely and efficiently across Africa and beyond.
          </p>
          <div className="mx-auto flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/register"
              className="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-8 py-4 text-base font-bold text-brand-900 shadow-[0_8px_30px_rgba(250,204,21,0.35)] transition-all hover:scale-[1.02] hover:bg-yellow-300 sm:min-w-[13rem]"
            >
              <Icon name="sprout" className="h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/10 sm:min-w-[13rem]"
            >
              Browse Marketplace
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-200">
            Free to join · Verified community · Secure escrow payments
          </p>
        </ScrollReveal>
      </section>

    </div>
  );
}
