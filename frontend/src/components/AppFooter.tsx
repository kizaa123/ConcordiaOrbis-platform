import Link from "next/link";
import { companyUrl, PLATFORM_NAME } from "@/lib/site";
import { SupportWhatsAppLink } from "@/components/SupportWhatsAppLink";

const COMPANY_LINKS = [
  { href: "/", label: "Company" },
  { href: "/team", label: "Team" },
  { href: "/refunds", label: "Refunds" },
  { href: "/contact", label: "Contact" },
] as const;

const APP_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-brand-200 bg-brand-900 px-3 py-2 text-brand-100 sm:px-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 sm:flex-row sm:justify-between sm:gap-4">
        <p className="text-[10px] leading-tight text-brand-200 sm:text-[11px]">
          The Premier Commodity Exchange Platform
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[10px] font-semibold text-brand-200 sm:text-[11px]">
          {COMPANY_LINKS.map((link) => (
            <a
              key={link.href}
              href={companyUrl(link.href)}
              className="hover:text-yellow-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
          {APP_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-yellow-300">
              {link.label}
            </Link>
          ))}
          <SupportWhatsAppLink
            className="inline-flex items-center gap-1 hover:text-yellow-300"
            iconClassName="h-3.5 w-3.5"
          />
        </nav>
        <p className="text-[10px] leading-tight text-brand-300 sm:text-[11px]">
          © {new Date().getFullYear()} {PLATFORM_NAME}
        </p>
      </div>
    </footer>
  );
}
