"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type ScrollDirection = "fade-up" | "fade-in" | "fade-down" | "fade-left" | "fade-right";

export type UseScrollAnimationOptions = {
  delay?: number;
  duration?: number;
  direction?: ScrollDirection;
  trigger?: "scroll" | "mount";
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export function useScrollAnimation({
  delay = 0,
  duration = 500,
  direction = "fade-up",
  trigger = "scroll",
  threshold = 0.12,
  rootMargin = "0px 0px -48px 0px",
  once = true,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger === "mount") {
      const timer = window.setTimeout(() => setIsVisible(true), Math.max(0, delay));
      return () => window.clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [trigger, delay, threshold, rootMargin, once]);

  const style: CSSProperties = {
    "--scroll-reveal-delay": `${delay}ms`,
    "--scroll-reveal-duration": `${duration}ms`,
  } as CSSProperties;

  const className = [
    "scroll-reveal",
    `scroll-reveal-${direction}`,
    isVisible ? "scroll-reveal-visible" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return { ref, isVisible, style, className };
}
