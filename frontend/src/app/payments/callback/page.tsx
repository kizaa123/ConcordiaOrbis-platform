"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { PlatformBrandTitle } from "@/components/PlatformBrandTitle";
import { Icon } from "@/components/icons";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Confirming your Paystack payment...");

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref") || "";
    if (!reference) {
      setError("Paystack did not return a payment reference.");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const result = await api.payments.verifyPaystack(reference);
        if (cancelled) return;
        if (result.status === "COMPLETED") {
          setMessage(result.message || "Payment confirmed.");
          window.location.replace(result.returnTo || "/dashboard");
          return;
        }
        if (result.status === "FAILED") {
          setError(result.message || "Payment did not go through.");
          return;
        }
        setError(result.message || "Payment is still pending. Check My Orders in a moment.");
      } catch (e) {
        if (cancelled) return;
        const text = e instanceof Error ? e.message : "Could not confirm this payment.";
        if (text.toLowerCase().includes("session expired") || text.toLowerCase().includes("unauthorized")) {
          window.location.replace(`/login?error=${encodeURIComponent("Log in to finish confirming your payment.")}`);
          return;
        }
        setError(text);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (error) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="auth-error w-full">
          <Icon name="x" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
        <a href="/marketplace" className="auth-switch-link font-semibold">
          Back to marketplace
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <PlatformBrandTitle theme="dark" size="compact" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[50vh] max-w-md items-center justify-center px-6 text-sm text-gray-600">
          Confirming your Paystack payment...
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
