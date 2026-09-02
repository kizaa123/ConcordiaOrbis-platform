import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const PUBLIC_PATHS = ["/", "/marketplace", "/library", "/login", "/register", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl().origin.replace(/\/$/, "");

  return PUBLIC_PATHS.map((path) => ({
    url: path === "/" ? origin : `${origin}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/marketplace" ? "daily" : "monthly",
    priority: path === "/" ? 0.8 : path === "/marketplace" ? 0.7 : 0.4,
  }));
}
