import type { MetadataRoute } from "next";
import { getWebsiteUrl, NAV } from "@/lib/company";

const EXTRA_PATHS = ["/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getWebsiteUrl().origin;
  const paths = [...NAV.map((item) => item.href), ...EXTRA_PATHS];
  const unique = [...new Set(paths)];

  return unique.map((path) => ({
    url: path === "/" ? origin : `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
