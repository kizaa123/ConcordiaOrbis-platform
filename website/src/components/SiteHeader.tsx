"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NAV, PLATFORM_LOGIN_URL, PLATFORM_URL } from "@/lib/company";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-100 text-brand-900"
                    : "text-gray-600 hover:bg-brand-50 hover:text-brand-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={PLATFORM_LOGIN_URL}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
          >
            Sign in
          </a>
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:scale-[1.02] hover:bg-brand-900"
          >
            Open platform
          </a>
        </div>

        <button
          type="button"
          className={`menu-toggle inline-flex h-11 w-11 items-center justify-center rounded-xl border lg:hidden ${
            open ? "border-brand-800 bg-brand-900 text-white" : "border-brand-200 text-brand-800"
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`menu-toggle-icon ${open ? "is-open" : ""}`} aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className={`mobile-menu lg:hidden ${open ? "is-open" : ""}`}>
        <div className="mobile-menu-inner border-t border-brand-100 bg-white px-4 pb-5 pt-2">
          <nav className="grid">
            {NAV.map((item, i) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ "--link-i": i } as CSSProperties}
                  className={`mobile-nav-link rounded-xl px-3 py-3.5 text-base font-semibold ${
                    active ? "bg-brand-50 text-brand-900" : "text-brand-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div
            className="mobile-nav-actions mt-3 grid grid-cols-2 gap-2"
            style={{ "--link-i": NAV.length } as CSSProperties}
          >
            <a
              href={PLATFORM_LOGIN_URL}
              className="rounded-xl border border-brand-200 py-3 text-center text-sm font-semibold text-brand-800"
            >
              Sign in
            </a>
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-brand-800 py-3 text-center text-sm font-bold text-white"
            >
              Open platform
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
