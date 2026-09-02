"use client";

interface PaymentCheckoutProps {
  totalLabel: string;
  totalAmount: string;
  subtitle?: string;
  payLabel: string;
  onPay: (paymentMethod: string) => void | Promise<void>;
  submitting?: boolean;
  error?: string;
  disabled?: boolean;
}

function PaystackMark({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 18" aria-hidden="true">
      <text x="0" y="14" fill="#011B33" fontSize="14" fontWeight="800" fontFamily="Arial, sans-serif">
        Paystack
      </text>
    </svg>
  );
}

export function PaymentCheckout({
  totalLabel,
  totalAmount,
  subtitle,
  payLabel,
  onPay,
  submitting = false,
  error,
  disabled = false,
}: PaymentCheckoutProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand-100 bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{totalLabel}</p>
            <p className="mt-0.5 text-lg font-black text-brand-900">{totalAmount}</p>
            {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
          </div>
          <PaystackMark className="mt-1 h-4 w-[4.5rem] shrink-0" />
        </div>
        <p className="mt-3 border-t border-brand-50 pt-3 text-sm text-gray-600">
          Pay ConcordiaOrbis in this window with{" "}
          <span className="font-semibold text-brand-900">card, mobile money, or bank transfer</span>.
          Nothing is marked paid until Paystack confirms the charge.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => onPay("paystack")}
        disabled={submitting || disabled}
        className="btn-primary w-full py-4 text-base disabled:opacity-60"
      >
        {submitting ? "Processing..." : payLabel}
      </button>
    </div>
  );
}

export type { PaymentResultOverlayProps as TransactionSuccessProps } from "@/components/PaymentResultOverlay";
export { PaymentResultOverlay as TransactionSuccess } from "@/components/PaymentResultOverlay";
