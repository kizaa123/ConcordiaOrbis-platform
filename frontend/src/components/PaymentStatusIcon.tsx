"use client";

export type PaymentStatusVariant = "pending" | "success" | "error";

interface PaymentStatusIconProps {
  variant: PaymentStatusVariant;
  className?: string;
  size?: "default" | "compact";
}

const ICON_SIZE_CLASS = {
  default: "h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32",
  compact: "h-14 w-14 sm:h-20 sm:w-20",
} as const;

export function PaymentStatusIcon({
  variant,
  className = "",
  size = "default",
}: PaymentStatusIconProps) {
  const iconSizeClass = ICON_SIZE_CLASS[size];

  if (variant === "pending") {
    const dots = Array.from({ length: 8 }, (_, i) => {
      const angle = ((i * 45 - 90) * Math.PI) / 180;
      return {
        cx: 60 + Math.cos(angle) * 34,
        cy: 60 + Math.sin(angle) * 34,
        delay: `${i * 0.12}s`,
      };
    });

    return (
      <div className={`payment-status-icon payment-status-icon--pending ${className}`} aria-hidden>
        <svg viewBox="0 0 120 120" className={iconSizeClass}>
          {dots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="7"
              fill="#059669"
              className="payment-pending-dot"
              style={{ animationDelay: dot.delay }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (variant === "success") {
    return (
      <div className={`payment-status-icon payment-status-icon--success ${className}`} aria-hidden>
        <svg viewBox="0 0 120 120" className={iconSizeClass}>
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#a7f3d0"
            strokeWidth="4"
            className="payment-success-ring"
          />
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="#059669"
            strokeWidth="8"
            strokeLinecap="round"
            pathLength={1}
            className="payment-success-circle-stroke"
          />
          <circle cx="60" cy="60" r="46" fill="#059669" className="payment-success-circle-fill" />
          <path
            d="M38 62 L54 78 L84 44"
            fill="none"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="payment-success-check"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`payment-status-icon payment-status-icon--error ${className}`} aria-hidden>
      <svg viewBox="0 0 120 120" className={iconSizeClass}>
        <circle cx="60" cy="60" r="46" fill="#ef4444" className="payment-error-circle" />
        <path
          d="M44 44 L76 76"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          pathLength={1}
          className="payment-error-x payment-error-x-1"
        />
        <path
          d="M76 44 L44 76"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          pathLength={1}
          className="payment-error-x payment-error-x-2"
        />
      </svg>
    </div>
  );
}
