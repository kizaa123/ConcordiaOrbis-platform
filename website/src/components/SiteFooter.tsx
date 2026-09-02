import Link from "next/link";
import { CONTACT, PLATFORM_NAME, PLATFORM_URL } from "@/lib/company";
import { Logo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/team", label: "Leadership team" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Trust & payments",
    links: [
      { href: "/payments", label: "How payments work" },
      { href: "/refunds", label: "Refunds & mistaken charges" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-800 bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo theme="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200">
            Public company site. Trading happens on the platform.
          </p>
          <SocialLinks theme="light" className="mt-5" />
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-100 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {PLATFORM_NAME}. All rights reserved. Accra, Ghana.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              WhatsApp Support
            </a>
            <a href={PLATFORM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Trading platform
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
