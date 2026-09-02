import { getFrontendBaseUrl } from './google.config';

export function getPaystackConfig() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim() || '';
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY?.trim() || '';
  const currency = (process.env.PAYSTACK_CURRENCY?.trim() || 'GHS').toUpperCase();

  return {
    secretKey,
    publicKey,
    currency,
    enabled: Boolean(secretKey),
    callbackUrl: `${getFrontendBaseUrl()}/payments/callback`,
  };
}

export function toPaystackAmount(amountGhs: number): number {
  return Math.round(amountGhs * 100);
}

export function fromPaystackAmount(amountPesewas: number): number {
  return Math.round(amountPesewas) / 100;
}
