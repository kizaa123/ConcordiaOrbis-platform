import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl().origin.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/accountant",
        "/agents",
        "/dashboard",
        "/farm",
        "/researcher",
        "/student",
        "/chat",
        "/connections",
        "/orders",
        "/financials",
        "/settings",
        "/profile",
        "/payments",
        "/auth",
        "/complete-profile",
      ],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
