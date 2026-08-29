/** Hostnames that 404 with Render `no-server` — never send Google here. */
const DEAD_OAUTH_REDIRECT_HOSTS = new Set(['concordiaorbis-api.onrender.com']);

export function getFrontendBaseUrl() {
  const configured = process.env.FRONTEND_URL?.split(',').map((v) => v.trim()).filter(Boolean) ?? [];
  return (configured[0] || 'http://localhost:3000').replace(/\/$/, '');
}

function isUsableRedirectUri(uri: string) {
  try {
    return !DEAD_OAUTH_REDIRECT_HOSTS.has(new URL(uri).hostname);
  } catch {
    return false;
  }
}

export function getGoogleRedirectUri() {
  const configured = process.env.GOOGLE_REDIRECT_URI?.trim() || '';
  if (configured && isUsableRedirectUri(configured)) {
    return configured;
  }

  const renderBase = process.env.RENDER_EXTERNAL_URL?.trim().replace(/\/$/, '') || '';
  if (renderBase) {
    return `${renderBase}/api/auth/google/callback`;
  }

  return `${getFrontendBaseUrl()}/auth/google/callback`;
}

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || '';
  const redirectUri = getGoogleRedirectUri();

  return {
    clientId,
    clientSecret,
    redirectUri,
    enabled: Boolean(clientId && clientSecret),
    devMode: process.env.GOOGLE_DEV_MODE === 'true' || (!clientId && process.env.NODE_ENV !== 'production'),
  };
}
