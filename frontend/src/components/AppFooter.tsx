import { companyUrl, PLATFORM_NAME } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Company" },
  { href: "/team", label: "Team" },
  { href: "/refunds", label: "Refunds" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-brand-200 bg-brand-900 px-3 py-6 text-center text-brand-100 sm:px-4 sm:py-8">
      <p className="text-[11px] leading-snug sm:text-sm sm:leading-normal">
        The Premier Commodity Exchange Platform
        <span className="hidden sm:inline"> - </span>
        <span className="block sm:inline">Connecting verified Fellows with Markets.</span>
      </p>
      <nav className="mx-auto mt-3 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-brand-200 sm:text-xs">
        {LINKS.map((link) => (
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
      </nav>
      <p className="mt-3 text-[10px] leading-snug text-brand-300 sm:text-xs">
        © {new Date().getFullYear()} {PLATFORM_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
