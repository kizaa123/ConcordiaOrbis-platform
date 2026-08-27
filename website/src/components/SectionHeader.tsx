"use client";

import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function SectionHeader({
  badge,
  title,
  subtitle,
  theme = "light",
}: {
  badge: string;
  title: ReactNode;
  subtitle?: string;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  return (
    <ScrollReveal className="mb-12 text-center" duration={500} direction="fade-up">
      <span
        className={`mb-4 inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-widest ${
          isDark
            ? "border border-brand-600/50 bg-brand-800/60 text-yellow-400"
            : "border border-brand-200 bg-brand-100/80 text-brand-700"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-yellow-400" : "bg-brand-600"}`} />
        {badge}
      </span>
      <h2
        className={`text-2xl font-bold tracking-tight sm:text-4xl sm:font-black ${
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
      {subtitle ? (
        <p className={`mx-auto mt-5 max-w-xl text-base leading-relaxed ${isDark ? "text-brand-300" : "text-gray-500"}`}>
          {subtitle}
        </p>
      ) : null}
    </ScrollReveal>
  );
}
