"use client";

import { api } from "@/lib/api";

const PAYSTACK_SCRIPT = "https://js.paystack.co/v2/inline.js";
const VERIFY_ATTEMPTS = 8;
const VERIFY_GAP_MS = 1500;

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
  checkout?: (options: { accessCode: string } & PaystackCallbacks) => unknown;
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

const CHECKOUT_OPEN_CLASS = "paystack-checkout-open";
const PAYSTACK_LAYER_Z = "2147483646";

function overlayRootFor(el: HTMLElement): HTMLElement {
  let node: HTMLElement | null = el;
  let overlay = el;
  while (node && node !== document.body && node !== document.documentElement) {
    const position = window.getComputedStyle(node).position;
    if (position === "fixed" || position === "absolute") overlay = node;
    node = node.parentElement;
  }
  return overlay;
}

function liftPaystackLayers() {
  document
    .querySelectorAll<HTMLElement>(
      [
        'iframe[src*="paystack"]',
        'iframe[src*="checkout.paystack"]',
        'iframe[name*="paystack" i]',
        '[id*="paystack" i]',
        '[class*="paystack" i]',
      ].join(",")
    )
    .forEach((el) => {
      const root = overlayRootFor(el);
      root.style.setProperty("z-index", PAYSTACK_LAYER_Z, "important");
      root.style.setProperty("pointer-events", "auto", "important");
      if (el !== root) el.style.setProperty("pointer-events", "auto", "important");
    });
}

function setPaystackCheckoutOpen(open: boolean) {
  document.documentElement.classList.toggle(CHECKOUT_OPEN_CLASS, open);
  document.body.classList.toggle(CHECKOUT_OPEN_CLASS, open);
  if (open) liftPaystackLayers();
}

function watchPaystackLayers(): () => void {
  liftPaystackLayers();
  const observer = new MutationObserver(() => liftPaystackLayers());
  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

function openPaystackPopup(accessCode: string): Promise<PopupOutcome> {
  return new Promise((resolve, reject) => {
    if (!window.PaystackPop) {
      reject(new Error("Paystack is not available."));
      return;
    }

    let settled = false;
    const stopWatch = watchPaystackLayers();
    setPaystackCheckoutOpen(true);

    const finish = (outcome: PopupOutcome) => {
      if (settled) return;
      settled = true;
      stopWatch();
      setPaystackCheckoutOpen(false);
      resolve(outcome);
    };

    const callbacks: PaystackCallbacks = {
      onSuccess: () => finish("paid"),
      onBankTransferConfirmationPending: () => finish("pending"),
      // USSD / 3DS / MoMo auth opens a second window and can fire onCancel.
      // Do not treat that as a failed payment — verify the charge next.
      onCancel: () => finish("dismissed"),
      onClose: () => finish("dismissed"),
      onError: (error) => {
        if (settled) return;
        settled = true;
        stopWatch();
        setPaystackCheckoutOpen(false);
        reject(new Error(error?.message || "Paystack could not complete this payment."));
      },
    };

    try {
      const popup = new window.PaystackPop();
      try {
        if (typeof popup.checkout === "function") {
          popup.checkout({ accessCode, ...callbacks });
          return;
        }
      } catch {
        /* resumeTransaction below */
      }
      popup.resumeTransaction(accessCode, callbacks);
    } catch (error) {
      stopWatch();
      setPaystackCheckoutOpen(false);
      reject(
        error instanceof Error ? error : new Error("Paystack could not open checkout.")
      );
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
    await loadPaystackScript();
    let outcome: PopupOutcome;
    try {
      outcome = await openPaystackPopup(start.accessCode);
    } finally {
      setPaystackCheckoutOpen(false);
    }
    hooks?.onConfirming?.();

    if (outcome === "dismissed") {
      const snapshot = await api.payments.verifyPaystack(start.reference);
      if (snapshot.status === "COMPLETED") return snapshot;
      if (snapshot.status === "FAILED") {
        throw new Error(snapshot.message || "Payment did not go through.");
      }
      // PENDING: USSD or phone authorization may still be in progress.
    }

    return verifyUntilCompleted(start.reference);
  }

  if (start.checkoutUrl) {
    window.location.assign(start.checkoutUrl);
    return new Promise(() => undefined);
  }

  return null;
}
