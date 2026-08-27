"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { scrollStagger } from "@/lib/scrollStagger";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-950 px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(82,183,136,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
      <div className="relative mx-auto max-w-3xl text-center">
        <ScrollReveal trigger="mount" delay={scrollStagger(0, 70)} duration={480}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">{eyebrow}</p>
        </ScrollReveal>
        <ScrollReveal trigger="mount" delay={scrollStagger(1, 70)} duration={520}>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{title}</h1>
        </ScrollReveal>
        <ScrollReveal trigger="mount" delay={scrollStagger(2, 70)} duration={500}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-200 sm:text-lg">
            {subtitle}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
