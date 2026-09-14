import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import {
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SHORT_NAME,
} from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "ConcordiaOrbis: Business to Business Marketplace",
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: ["/logo.svg"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_SHORT_NAME,
    title: "ConcordiaOrbis: Business to Business Marketplace",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ConcordiaOrbis: Business to Business Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ConcordiaOrbis: Business to Business Marketplace",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_SHORT_NAME,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f1c30" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1c30" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" style={{ colorScheme: "light" }}>
      <body className="flex h-full flex-col overflow-hidden font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
