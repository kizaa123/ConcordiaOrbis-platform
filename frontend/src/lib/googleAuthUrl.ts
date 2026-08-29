/** Backend origin for OAuth browser redirects (not same-origin /api fetch). */
export function getBackendOrigin(): string {
  const raw =
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "http://localhost:3001";
  return raw.replace(/\/$/, "");
}

export function googleOAuthStartUrl(): string {
  const publicApi = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "");
  if (publicApi) return `${publicApi}/api/auth/google`;
  return "/api/auth/google";
}
