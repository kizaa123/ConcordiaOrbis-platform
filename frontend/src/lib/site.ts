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
export const SUPPORT_WHATSAPP_URL = "https://wa.me/message/GW3AIF7DAWTYN1";

export const SUPPORT_WHATSAPP_OPEN_EVENT = "co-open-whatsapp-support";

export const SUPPORT_TOPICS = [
  { id: "payment", label: "Transaction or payment error" },
  { id: "access", label: "Farm or publication access" },
  { id: "order", label: "Orders, delivery, or tracking" },
  { id: "account", label: "Account, login, or verification" },
  { id: "listing", label: "Marketplace or listings" },
  { id: "refund", label: "Refunds or mistaken charges" },
  { id: "other", label: "Other assistance" },
] as const;

export function supportWhatsAppUrl(topicLabel: string) {
  const text = [
    `Hello ${PLATFORM_NAME},`,
    "",
    `I need help with: ${topicLabel}`,
    "",
    "Please assist me.",
  ].join("\n");
  return `${SUPPORT_WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

export function openWhatsAppSupportPicker() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SUPPORT_WHATSAPP_OPEN_EVENT));
}

/** Live public company site (About, Team, Refunds, Contact). */
export const DEFAULT_COMPANY_SITE_URL = "https://concordiaorbis.com";

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
