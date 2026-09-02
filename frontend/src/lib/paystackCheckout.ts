"use client";

import { api } from "@/lib/api";

const PAYSTACK_SCRIPT = "https://js.paystack.co/v2/inline.js";
const VERIFY_ATTEMPTS = 8;
const VERIFY_GAP_MS = 1500;
const CHECKOUT_OPEN_CLASS = "paystack-checkout-open";

export type PaystackCheckoutStart = {
  checkoutUrl?: string | null;
  accessCode?: string | null;
  pending?: boolean;
  reference?: string;
};

export type SettledPaystackPayment = {
  status: "COMPLETED" | "PENDING" | "FAILED";
  kind?: string;
  returnTo: string;
  message: string;
  reference: string;
  orderId?: string;
  releaseOtp?: string | null;
  farmerId?: string;
  publicationId?: string;
};

export type PaystackCheckoutHooks = {
  onAwaitingPayment?: () => void;
  onConfirming?: () => void;
};

type PaystackCallbacks = {
  onSuccess?: (transaction: { reference?: string }) => void;
  onCancel?: () => void;
  onClose?: () => void;
  onError?: (error: { message?: string }) => void;
  onBankTransferConfirmationPending?: () => void;
};

type PaystackPop = {
  resumeTransaction: (accessCode: string, callbacks?: PaystackCallbacks) => unknown;
};

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPop;
  }
}

function isInlineCheckout(result: PaystackCheckoutStart): boolean {
  return Boolean(result.pending && (result.accessCode || result.checkoutUrl) && result.reference);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function setPaystackCheckoutOpen(open: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle(CHECKOUT_OPEN_CLASS, open);
  document.body.classList.toggle(CHECKOUT_OPEN_CLASS, open);
}

export function preloadPaystackScript(): void {
  void loadPaystackScript().catch(() => undefined);
}

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack is only available in the browser."));
  }
  if (window.PaystackPop) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SCRIPT}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Paystack.")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Paystack."));
    document.head.appendChild(script);
  });
}

type PopupOutcome = "paid" | "pending" | "dismissed";

function openPaystackPopup(accessCode: string): Promise<PopupOutcome> {
  return new Promise((resolve, reject) => {
    if (!window.PaystackPop) {
      reject(new Error("Paystack is not available."));
      return;
    }

    let settled = false;
    const finish = (outcome: PopupOutcome) => {
      if (settled) return;
      settled = true;
      resolve(outcome);
    };

    const callbacks: PaystackCallbacks = {
      onSuccess: () => finish("paid"),
      onBankTransferConfirmationPending: () => finish("pending"),
      onCancel: () => finish("dismissed"),
      onClose: () => finish("dismissed"),
      onError: (error) => {
        if (settled) return;
        settled = true;
        reject(new Error(error?.message || "Paystack could not complete this payment."));
      },
    };

    try {
      new window.PaystackPop().resumeTransaction(accessCode, callbacks);
    } catch (error) {
      reject(error instanceof Error ? error : new Error("Paystack could not open checkout."));
    }
  });
}

async function verifyUntilCompleted(reference: string): Promise<SettledPaystackPayment> {
  let last: SettledPaystackPayment | null = null;
  for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(VERIFY_GAP_MS);
    last = await api.payments.verifyPaystack(reference);
    if (last.status === "COMPLETED") return last;
    if (last.status === "FAILED") {
      throw new Error(last.message || "Payment did not go through.");
    }
  }
  throw new Error(last?.message || "Payment is still pending. Check My Orders in a moment.");
}

/**
 * Live Paystack charges stay in the app: open the Paystack sheet, then confirm
 * with the API. Returns null when checkout was already completed (local mock).
 */
export async function completePaystackOnApp(
  start: PaystackCheckoutStart,
  hooks?: PaystackCheckoutHooks
): Promise<SettledPaystackPayment | null> {
  if (start.pending && start.reference && !start.accessCode && !start.checkoutUrl) {
    throw new Error("Paystack checkout did not start. Please try again.");
  }
  if (!isInlineCheckout(start) || !start.reference) return null;

  if (start.accessCode) {
    hooks?.onAwaitingPayment?.();
    setPaystackCheckoutOpen(true);
    try {
      await loadPaystackScript();
      const outcome = await openPaystackPopup(start.accessCode);
      hooks?.onConfirming?.();

      if (outcome === "dismissed") {
        const snapshot = await api.payments.verifyPaystack(start.reference);
        if (snapshot.status === "COMPLETED") return snapshot;
        if (snapshot.status === "FAILED") {
          throw new Error(snapshot.message || "Payment did not go through.");
        }
      }

      return verifyUntilCompleted(start.reference);
    } finally {
      setPaystackCheckoutOpen(false);
    }
  }

  if (start.checkoutUrl) {
    window.location.assign(start.checkoutUrl);
    return new Promise(() => undefined);
  }

  return null;
}
