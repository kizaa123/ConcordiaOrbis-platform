"use client";

import type { ReactNode } from "react";
import {
  useScrollAnimation,
  type UseScrollAnimationOptions,
} from "@/hooks/useScrollAnimation";

export function ScrollReveal({
  children,
  className = "",
  ...options
}: UseScrollAnimationOptions & { children: ReactNode; className?: string }) {
  const { ref, style, className: animClass } = useScrollAnimation(options);

  return (
    <div ref={ref} className={`${animClass}${className ? ` ${className}` : ""}`} style={style}>
      {children}
    </div>
  );
}
