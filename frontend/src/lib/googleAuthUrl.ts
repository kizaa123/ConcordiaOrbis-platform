/**
 * API origin for OAuth. Prefer server BACKEND_URL, then the public API URL,
 * then production Render, then local.
 */
export function getBackendOrigin(): string {
  const raw =
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    (process.env.VERCEL ? "https://concordiaorbis-platform.onrender.com" : "") ||
    "http://localhost:3001";
  return raw.replace(/\/$/, "");
}

/** Same-origin start so Google returns to this app, not a missing /api page. */
export function googleOAuthStartUrl(): string {
  return "/auth/google";
}
