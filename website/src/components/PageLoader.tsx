"use client";

import { useEffect, useState } from "react";
import { LogoIcon } from "@/components/Logo";
import { PLATFORM_NAME } from "@/lib/company";

export function PageLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("co-site-loaded")) return;
    setVisible(true);
    const hide = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("co-site-loaded", "1");
    }, 1100);
    return () => window.clearTimeout(hide);
  }, []);

  if (!visible) return null;

  return (
    <div className="page-loader fixed inset-0 z-[80] flex flex-col items-center justify-center bg-brand-950 text-white">
      <LogoIcon className="h-14 w-auto animate-pulse" theme="light" />
      <p className="mt-4 text-sm font-extrabold tracking-tight">{PLATFORM_NAME}</p>
      <span className="mt-3 h-0.5 w-16 overflow-hidden rounded-full bg-white/15">
        <span className="page-loader-bar block h-full w-full bg-yellow-400" />
      </span>
    </div>
  );
}
