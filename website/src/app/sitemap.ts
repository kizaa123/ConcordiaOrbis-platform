import type { MetadataRoute } from "next";
import { NAV } from "@/lib/company";

const ORIGIN = "https://concordiaorbis.com";
const EXTRA_PATHS = ["/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...NAV.map((item) => item.href), ...EXTRA_PATHS];
  const unique = [...new Set(paths)];

  return unique.map((path) => ({
    url: path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
