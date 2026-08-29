export function getFrontendBaseUrl() {
  const configured = process.env.FRONTEND_URL?.split(',').map((v) => v.trim()).filter(Boolean) ?? [];
  return (configured[0] || 'http://localhost:3000').replace(/\/$/, '');
}

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || '';
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    `${getFrontendBaseUrl()}/api/auth/google/callback`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    enabled: Boolean(clientId && clientSecret),
    devMode: process.env.GOOGLE_DEV_MODE === 'true' || (!clientId && process.env.NODE_ENV !== 'production'),
  };
}
