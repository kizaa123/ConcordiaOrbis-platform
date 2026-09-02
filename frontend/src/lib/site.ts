export const PLATFORM_NAME = "ConcordiaOrbis";
export const SITE_NAME = PLATFORM_NAME;
export const SITE_SHORT_NAME = PLATFORM_NAME;
export const PLATFORM_ACCOUNTANT_LABEL = `${PLATFORM_NAME} Accountant`;
export const PLATFORM_TEAM_LABEL = `${PLATFORM_NAME} Team`;
export const SITE_DESCRIPTION =
  "Connect fellows, clients, and liaison officers across Africa and beyond";

export const PLATFORM_EMAIL = "concordiaorbisadmin@gmail.com";
export const SUPPORT_EMAIL = PLATFORM_EMAIL;
export const PAYMENTS_EMAIL = PLATFORM_EMAIL;

/** Live public company site (About, Team, Refunds, Contact). */
export const DEFAULT_COMPANY_SITE_URL = "https://concordiaorbis-website.vercel.app";

/** Public company / Paystack information site (separate from the trading app). */
export const COMPANY_SITE_URL = (
  process.env.NEXT_PUBLIC_COMPANY_SITE_URL?.trim() ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:3002" : DEFAULT_COMPANY_SITE_URL)
).replace(/\/$/, "");

export function companyUrl(path = "/"): string {
  const origin = COMPANY_SITE_URL || DEFAULT_COMPANY_SITE_URL;
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Absolute site origin for metadata (og:image, canonical URLs). */
export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return new URL(configured.endsWith("/") ? configured : `${configured}/`);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel.replace(/\/$/, "")}/`);
  }

  return new URL("http://localhost:3000/");
}
