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
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-xl border border-brand-100 bg-white px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
              {totalLabel}
            </p>
            <p className="text-base font-black text-brand-900 sm:mt-0.5 sm:text-lg">{totalAmount}</p>
            {subtitle ? (
              <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500 sm:mt-1 sm:text-xs">{subtitle}</p>
            ) : null}
          </div>
          <PaystackMark className="h-3.5 w-[3.75rem] shrink-0 sm:mt-1 sm:h-4 sm:w-[4.5rem]" />
        </div>
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
        className="btn-primary w-full py-3 text-sm sm:py-4 sm:text-base disabled:opacity-60"
      >
        {submitting ? "Processing..." : payLabel}
      </button>
    </div>
  );
}

export type { PaymentResultOverlayProps as TransactionSuccessProps } from "@/components/PaymentResultOverlay";
export { PaymentResultOverlay as TransactionSuccess } from "@/components/PaymentResultOverlay";
