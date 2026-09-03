export const PLATFORM_NAME = "ConcordiaOrbis";
export const MOTTO = "The Premier Commodity Exchange Platform";
export const TAGLINE = "Where Fellows Meet Markets";

const DEFAULT_WEBSITE_URL = "https://concordiaorbis.com";

function toOriginUrl(value: string | undefined, fallback: string): URL {
  const raw = value?.trim() ?? "";
  const withProtocol = raw
    ? /^https?:\/\//i.test(raw)
      ? raw
      : `https://${raw}`
    : fallback;
  try {
    return new URL(withProtocol.endsWith("/") ? withProtocol : `${withProtocol}/`);
  } catch {
    return new URL(`${fallback}/`);
  }
}

/** Public company site origin (sitemap, robots, metadata). */
export function getWebsiteUrl(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
    return toOriginUrl(process.env.NEXT_PUBLIC_SITE_URL, DEFAULT_WEBSITE_URL);
  }
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    return new URL("http://localhost:3002/");
  }
  return toOriginUrl(
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL,
    DEFAULT_WEBSITE_URL,
  );
}

/** Live trading platform (app). */
export const PLATFORM_URL =
  process.env.NEXT_PUBLIC_PLATFORM_URL?.replace(/\/$/, "") ||
  "https://app.concordiaorbis.com";

export const PLATFORM_REGISTER_URL = `${PLATFORM_URL}/register`;
export const PLATFORM_LOGIN_URL = `${PLATFORM_URL}/login`;
export const PLATFORM_MARKETPLACE_URL = `${PLATFORM_URL}/marketplace`;

export const COMPANY = {
  legalName: "ConcordiaOrbis",
  country: "Ghana",
  city: "Accra",
  address: "Accra, Ghana",
  supportHours: "Monday – Friday, 9:00 – 17:00 GMT",
};

export const CONTACT = {
  hello: "concordiaorbisadmin@gmail.com",
  payments: "concordiaorbisadmin@gmail.com",
  support: "concordiaorbisadmin@gmail.com",
  whatsapp: "https://wa.me/message/GW3AIF7DAWTYN1",
};

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
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function openWhatsAppSupportPicker() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SUPPORT_WHATSAPP_OPEN_EVENT));
}

export const SOCIAL = {
  instagram: "https://www.instagram.com/concordiaorbis",
  facebook: "https://www.facebook.com/concordiaorbis",
  linkedin: "https://www.linkedin.com/company/concordiaorbis",
  x: "https://x.com/concordiaorbis",
  youtube: "https://www.youtube.com/@concordiaorbis",
};

export const TEAM = [
  {
    name: "Obeng Stephen Boakye",
    role: "Founder and Chief Executive Officer",
    bio: "Entrepreneur · Supply Chain Strategist · Business Consultant · Diplomatic & Global Partnerships Strategist · Global Food Systems Advocate.",
    img: "/team/founder.png",
  },
  {
    name: "Gloria Bless Dzogbenyuie",
    role: "Chief Communications Officer",
    bio: "Procurement & Supply Chain Professional · Strategic Communications · Sustainable Agriculture Advocate · Youth & Climate Development Enthusiast.",
    img: "/team/cco.png",
  },
  {
    name: "Lawrence Kennedy Kwarteng",
    role: "Director of Research and Quality Assurance",
    bio: "Head of Extension / Plant Doctor · Agricultural Extension Specialist · 15+ years farmer advisory experience · Crop health & sustainable agriculture.",
    img: "/team/director.png",
  },
] as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/payments", label: "Payments" },
  { href: "/refunds", label: "Refunds" },
  { href: "/contact", label: "Contact" },
] as const;
