import type { Metadata } from "next";
import { MOTTO, PLATFORM_NAME, TAGLINE } from "@/lib/company";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageLoader } from "@/components/PageLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${PLATFORM_NAME} — ${MOTTO}`,
    template: `%s · ${PLATFORM_NAME}`,
  },
  description: `${TAGLINE}. Connecting verified fellows with clients. Secure commodity trading, Paystack payments to ConcordiaOrbis, and a trusted marketplace across Africa and beyond.`,
  icons: { icon: [{ url: "/logo.svg", type: "image/svg+xml" }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <PageLoader />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
