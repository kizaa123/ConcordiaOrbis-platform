export const PLATFORM_NAME = "ConcordiaOrbis";
export const SITE_NAME = PLATFORM_NAME;
export const SITE_SHORT_NAME = PLATFORM_NAME;
export const PLATFORM_ACCOUNTANT_LABEL = `${PLATFORM_NAME} Accountant`;
export const PLATFORM_TEAM_LABEL = `${PLATFORM_NAME} Team`;
export const SITE_DESCRIPTION =
  "Connect fellows, clients, and liaison officers across Africa and beyond";

export const SUPPORT_EMAIL = "hello@concordiaorbis.com";
export const PAYMENTS_EMAIL = "payments@concordiaorbis.com";

/** Public company / Paystack information site (separate from the trading app). */
export const COMPANY_SITE_URL = (
  process.env.NEXT_PUBLIC_COMPANY_SITE_URL?.trim() ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:3002" : "")
).replace(/\/$/, "");

export function companyUrl(path = "/"): string {
  if (!COMPANY_SITE_URL) return "#";
  if (!path || path === "/") return COMPANY_SITE_URL;
  return `${COMPANY_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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
