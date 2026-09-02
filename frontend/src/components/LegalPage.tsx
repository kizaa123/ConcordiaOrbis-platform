import type { ReactNode } from "react";
import { companyUrl, PAYMENTS_EMAIL, PLATFORM_NAME, SUPPORT_EMAIL } from "@/lib/site";
import { SupportWhatsAppLink } from "@/components/SupportWhatsAppLink";

export function LegalPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-brand-50">
      <section className="border-b border-brand-100 bg-brand-900 px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">Legal</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-200 sm:text-base">{subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="prose-legal rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Company information also lives on our{" "}
          <a href={companyUrl("/")} target="_blank" rel="noopener noreferrer">
            public company site
          </a>
          . Refunds:{" "}
          <a href={companyUrl("/refunds")} target="_blank" rel="noopener noreferrer">
            {PLATFORM_NAME} refunds
          </a>
          . Payments:{" "}
          <a href={`mailto:${PAYMENTS_EMAIL}`}>{PAYMENTS_EMAIL}</a>
          . Support:{" "}
          <SupportWhatsAppLink
            showIcon={false}
            className="support-whatsapp-inline"
          />{" "}
          or <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>
    </div>
  );
}

export function LegalUpdated() {
  return <p className="mb-6 text-sm text-gray-400">Last updated: 29 August 2026</p>;
}
