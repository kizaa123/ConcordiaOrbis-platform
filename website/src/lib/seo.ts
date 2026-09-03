import type { Metadata } from "next";
import { COMPANY, PLATFORM_NAME, SOCIAL } from "./company";

export const DEFAULT_TITLE =
  "ConcordiaOrbis — Ghana farm produce marketplace and commodity trading";

export const DEFAULT_DESCRIPTION =
  "ConcordiaOrbis is a Ghana-based farm commodity exchange in Accra. Verified fellows list crops, livestock, fruit, and fish. Clients pay with Paystack; a liaison officer procures and delivers across Ghana and beyond.";

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
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
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
