import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/company";

export function LogoIcon({
  className = "h-9 w-auto",
  theme = "dark",
}: {
  className?: string;
  theme?: "dark" | "light";
}) {
  const strokeColor = theme === "light" ? "#FFFFFF" : "#2C3238";
  return (
    <svg
      viewBox="0 0 68 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="20 4, 34 12, 34 28, 20 36, 6 28, 6 12"
        fill="#1F9D68"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon
        points="48 4, 62 12, 62 28, 48 36, 34 28, 34 12"
        fill={theme === "light" ? "rgba(255,255,255,0.08)" : "none"}
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  theme = "dark",
  href = "/",
}: {
  theme?: "dark" | "light";
  href?: string;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-85">
      <LogoIcon className="h-9 w-auto sm:h-10" theme={theme} />
      <span
        className={`text-sm font-extrabold tracking-tight sm:text-base ${
          theme === "light" ? "text-white" : "text-gray-900"
        }`}
      >
        {PLATFORM_NAME}
      </span>
    </Link>
  );
}
