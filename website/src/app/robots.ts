import type { MetadataRoute } from "next";
import { getWebsiteUrl } from "@/lib/company";

export default function robots(): MetadataRoute.Robots {
  const origin = getWebsiteUrl().origin;
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
  };
}
