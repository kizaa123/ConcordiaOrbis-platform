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

type PaystackPop = {
  resumeTransaction: (
    accessCode: string,
    callbacks?: {
      onSuccess?: (transaction: { reference?: string }) => void;
      onCancel?: () => void;
      onError?: (error: { message?: string }) => void;
      onLoad?: () => void;
      onBankTransferConfirmationPending?: () => void;
    }
  ) => void;
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

function isPaystackFrame(node: Element): node is HTMLIFrameElement {
  if (!(node instanceof HTMLIFrameElement)) return false;
  const haystack = `${node.src} ${node.id} ${node.name} ${node.title}`.toLowerCase();
  return haystack.includes("paystack");
}

function findPaystackOverlay(frame: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = frame.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const zIndex = Number.parseInt(style.zIndex || "0", 10);
    if (style.position === "fixed" || style.position === "absolute" || zIndex > 1000) {
      const height = node.getBoundingClientRect().height;
      if (height > window.innerHeight * 0.7) return node;
    }
    node = node.parentElement;
  }
  return null;
}

function applyPaystackMobileSheet(): void {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(max-width: 639.98px)").matches) return;

  const frames = Array.from(document.querySelectorAll("iframe")).filter(isPaystackFrame);
  for (const frame of frames) {
    frame.classList.add("paystack-mobile-frame");
    const overlay = findPaystackOverlay(frame);
    overlay?.classList.add("paystack-mobile-overlay");
  }
}

function startPaystackMobileLayout(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const root = document.documentElement;
  root.classList.add("paystack-sheet-open");
  applyPaystackMobileSheet();

  const observer = new MutationObserver(() => applyPaystackMobileSheet());
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "style", "class"] });

  const interval = window.setInterval(applyPaystackMobileSheet, 250);

  return () => {
    observer.disconnect();
    window.clearInterval(interval);
    root.classList.remove("paystack-sheet-open");
    document.querySelectorAll(".paystack-mobile-frame").forEach((el) => el.classList.remove("paystack-mobile-frame"));
    document.querySelectorAll(".paystack-mobile-overlay").forEach((el) => el.classList.remove("paystack-mobile-overlay"));
  };
}

function openPaystackPopup(accessCode: string): Promise<{ reference?: string }> {
  return new Promise((resolve, reject) => {
    if (!window.PaystackPop) {
      reject(new Error("Paystack is not available."));
      return;
    }
    const stopLayout = startPaystackMobileLayout();
    const settle = (next: () => void) => {
      stopLayout();
      next();
    };
    const popup = new window.PaystackPop();
    popup.resumeTransaction(accessCode, {
      onLoad: () => applyPaystackMobileSheet(),
      onSuccess: (transaction) => settle(() => resolve(transaction ?? {})),
      onCancel: () => settle(() => reject(new Error("Payment was cancelled."))),
      onError: (error) =>
        settle(() => reject(new Error(error?.message || "Paystack could not complete this payment."))),
      onBankTransferConfirmationPending: () => settle(() => resolve({})),
    });
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
    await openPaystackPopup(start.accessCode);
    hooks?.onConfirming?.();
    return verifyUntilCompleted(start.reference);
  }

  if (start.checkoutUrl) {
    window.location.assign(start.checkoutUrl);
    return new Promise(() => undefined);
  }

  return null;
}
