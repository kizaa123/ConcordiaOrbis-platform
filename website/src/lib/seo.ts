import type { Metadata } from "next";
import { COMPANY, PLATFORM_NAME, SOCIAL } from "./company";

export const DEFAULT_TITLE =
  "ConcordiaOrbis: Business to Business Marketplace";

export const DEFAULT_DESCRIPTION =
  "Africa's Digital B2B Marketplace, Connecting Business with Clients. ConcordiaOrbis in Accra, Ghana connects verified businesses with clients. Pay with Paystack; a liaison officer procures and delivers.";

export function pageSeo({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? "/" : path;
  const ogTitle = title.includes(PLATFORM_NAME) ? title : `${title} · ${PLATFORM_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      locale: "en_GH",
      type: "website",
      siteName: PLATFORM_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

export function websiteJsonLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: PLATFORM_NAME,
    url: origin,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: PLATFORM_NAME,
    },
  };
}

export function organizationJsonLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: PLATFORM_NAME,
    legalName: COMPANY.legalName,
    url: origin,
    logo: `${origin}/logo.svg`,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY.city,
      addressCountry: "GH",
    },
    areaServed: ["GH", "Africa"],
    sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.linkedin, SOCIAL.x, SOCIAL.youtube],
  };
}
