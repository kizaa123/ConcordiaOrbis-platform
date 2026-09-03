import type { Metadata } from "next";
import { getWebsiteUrl, PLATFORM_NAME } from "@/lib/company";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, organizationJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageLoader } from "@/components/PageLoader";
import { WhatsAppSupportHost } from "@/components/WhatsAppSupport";
import "./globals.css";

const siteUrl = getWebsiteUrl();
const origin = siteUrl.origin;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${PLATFORM_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: PLATFORM_NAME,
  keywords: [
    "ConcordiaOrbis",
    "Ghana farm marketplace",
    "farm produce Ghana",
    "commodity trading Ghana",
    "buy farm produce Accra",
    "Paystack farm payment",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "/",
    siteName: PLATFORM_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: DEFAULT_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/hero.jpg"],
  },
  icons: { icon: [{ url: "/logo.svg", type: "image/svg+xml" }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <JsonLd data={organizationJsonLd(origin)} />
        <PageLoader />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppSupportHost />
      </body>
    </html>
  );
}
