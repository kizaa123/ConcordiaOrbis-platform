"use client";

export type PaystackCheckoutResult = {
  checkoutUrl?: string | null;
  pending?: boolean;
  reference?: string;
};

/** Redirects to Paystack hosted checkout when the API returned an authorization URL. */
export function redirectToPaystack(result: PaystackCheckoutResult): boolean {
  if (!result.checkoutUrl) return false;
  window.location.assign(result.checkoutUrl);
  return true;
}
