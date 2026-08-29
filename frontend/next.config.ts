import type { NextConfig } from "next";

const backend = (
  process.env.BACKEND_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.VERCEL ? "https://concordiaorbis-platform.onrender.com" : "") ||
  "http://localhost:3001"
).replace(/\/$/, "");

function backendHostname(): string | null {
  try {
    return new URL(backend).hostname;
  } catch {
    return null;
  }
}

const apiHost = backendHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3001" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      ...(apiHost
        ? [{ protocol: "https" as const, hostname: apiHost }]
        : [{ protocol: "https" as const, hostname: "*.onrender.com" }]),
    ],
    unoptimized: true,
  },
  async redirects() {
    return [{ source: "/access", destination: "/marketplace", permanent: true }];
  },
  async rewrites() {
    return {
      // Run before Next would 404 /api/* in the App Router.
      // /auth/google and /auth/google/callback are handled by route.ts (302).
      beforeFiles: [
        {
          source: "/api/auth/google",
          destination: `${backend}/api/auth/google`,
        },
        {
          source: "/api/auth/google/callback",
          destination: `${backend}/api/auth/google/callback`,
        },
      ],
      afterFiles: [
        { source: "/api/:path*", destination: `${backend}/api/:path*` },
        { source: "/uploads/:path*", destination: `${backend}/uploads/:path*` },
      ],
    };
  },
};

export default nextConfig;
