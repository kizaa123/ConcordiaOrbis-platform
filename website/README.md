# ConcordiaOrbis company website

Public company site for Paystack, partners, and customers. It lives next to the trading app, not inside it.

## Run locally

```bash
cd website
npm install
npm run dev
```

Opens at [http://localhost:3002](http://localhost:3002).

## What to update before Paystack review

Edit `src/lib/company.ts`:

- Real support phone and WhatsApp
- Live social profile URLs (Instagram, Facebook, LinkedIn, X, YouTube)
- Platform email (`concordiaorbisadmin@gmail.com`)

Set `NEXT_PUBLIC_PLATFORM_URL` if the trading app URL changes.

## Deploy (Vercel)

1. Create a new Vercel project with **Root Directory** = `website`
2. After it has a URL, set on the **trading app** (frontend):

```
NEXT_PUBLIC_COMPANY_SITE_URL=https://your-company-site.vercel.app
```

The platform footer and public header then link here. This site’s **Open platform** buttons already point at the live marketplace.
