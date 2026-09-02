"use client";

import { useState } from "react";
import { FarmerBrowseCard, ROLES } from "@/lib/types";
import { useNotifications } from "@/context/NotificationProvider";
import { AvatarWithVerification } from "@/components/AvatarWithVerification";
import { CountryBadge } from "@/components/CountrySelect";
import { PaymentCheckout } from "@/components/PaymentCheckout";
import { PaymentResultOverlay } from "@/components/PaymentResultOverlay";
import { RolePrefixedName, splitDisplayName } from "@/components/RolePrefixedName";
import { Icon } from "@/components/icons";
import { api } from "@/lib/api";
import { FARM_ACCESS_PRICE_GHC } from "@/lib/pricing";
import { useMoneyFormat } from "@/hooks/useMoneyFormat";
import { completePaystackOnApp } from "@/lib/paystackCheckout";

interface FarmAccessPaymentModalProps {
  farmer: FarmerBrowseCard;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentResult =
  | { variant: "pending"; title?: string; message: string }
  | { variant: "success" }
  | { variant: "error"; message: string };

export function FarmAccessPaymentModal({
  farmer,
  onClose,
  onSuccess,
}: FarmAccessPaymentModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { showLiveNotifications } = useNotifications();
  const { formatFarmAccessFee } = useMoneyFormat();
  const { firstName, lastName } = splitDisplayName(farmer.farmerName);

  const fee = farmer.farmAccessFee ?? FARM_ACCESS_PRICE_GHC;
  const feeLabel = farmer.farmAccessPriceLabel ?? formatFarmAccessFee(fee);

  const handlePay = async (paymentMethod: string) => {
    setSubmitting(true);
    setResult(null);
    try {
      const paid = await api.payments.purchaseFarmAccess(farmer.farmerId, paymentMethod);
      const settled = await completePaystackOnApp(paid, {
        onConfirming: () =>
          setResult({
            variant: "pending",
            title: "Confirming payment",
            message: "Unlocking farm access…",
          }),
      });
      if (settled && settled.status !== "COMPLETED") {
        throw new Error(settled.message || "Payment is not confirmed yet.");
      }
      setResult({ variant: "success" });
      void showLiveNotifications();
      onSuccess();
    } catch (e) {
      setResult({
        variant: "error",
        message: e instanceof Error ? e.message : "Payment failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isSuccess = result?.variant === "success";
  const isPending = result?.variant === "pending";
  const checkoutBusy = submitting || isPending;

  return (
    <div
      data-payment-overlay
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={() => {
        if (checkoutBusy) return;
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-md max-h-[88dvh] overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-h-none sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="flex flex-col">
            <div className="flex justify-end border-b border-brand-100 bg-brand-50/40 px-3 py-2 sm:px-4 sm:py-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-brand-700"
                aria-label="Close"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center px-5 py-6 text-center sm:px-8 sm:py-10">
              <PaymentResultOverlay
                variant="success"
                embedded
                title="Access granted"
                message={`Your ${feeLabel} payment was successful. Instant access to ${farmer.farmName} is now active.`}
                hint="Browse farm and place orders from this farm."
                actionLabel="Browse farm"
                onDismiss={onClose}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-brand-100 bg-brand-50/60 p-3 sm:p-5">
              <div className="flex items-center gap-3">
                <AvatarWithVerification
                  src={farmer.profilePicture}
                  name={farmer.farmerName}
                  size="sm"
                  verificationStatus={farmer.verificationStatus}
                  verificationTags={farmer.verificationTags}
                  tagPlacement="none"
                />
                <div className="min-w-0 text-left">
                  <RolePrefixedName
                    user={{
                      roleId: ROLES.CROP_FARMER,
                      firstName,
                      lastName,
                      verificationStatus: farmer.verificationStatus,
                    }}
                    verificationTags={farmer.verificationTags}
                    nameClassName="text-base font-bold text-brand-900 sm:text-lg"
                    prefixClassName="text-base font-bold text-brand-900 sm:text-lg"
                  />
                  <p className="text-xs text-brand-700 sm:text-sm">{farmer.farmName}</p>
                  <div className="hidden sm:block">
                    <CountryBadge country={farmer.country} region={farmer.region} />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={checkoutBusy}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-brand-700 disabled:opacity-40"
                aria-label="Close"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-5">
              {farmer.farmAccessExpired ? (
                <p className="mb-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 sm:mb-3 sm:text-sm">
                  Previous access expired. Pay again to view products and place orders.
                </p>
              ) : (
                <p className="mb-2 text-xs text-gray-600 sm:mb-0 sm:text-sm">
                  One-time fee to view products and order from this farm.
                </p>
              )}

              <PaymentCheckout
                totalLabel="Farm access"
                totalAmount={feeLabel}
                payLabel={`Pay ${feeLabel}`}
                onPay={handlePay}
                submitting={submitting}
              />
            </div>

            {result?.variant === "pending" && (
              <PaymentResultOverlay
                variant="pending"
                title={result.title}
                message={result.message}
              />
            )}

            {result?.variant === "error" && (
              <PaymentResultOverlay
                variant="error"
                compact
                message={result.message}
                onAction={() => setResult(null)}
                onDismiss={onClose}
                dismissLabel="Close"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
