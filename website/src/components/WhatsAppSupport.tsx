"use client";

import { useEffect, useState } from "react";
import {
  PLATFORM_NAME,
  SUPPORT_TOPICS,
  SUPPORT_WHATSAPP_OPEN_EVENT,
  openWhatsAppSupportPicker,
  supportWhatsAppUrl,
} from "@/lib/company";

export function WhatsAppFillIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.001 2c5.523 0 10 4.477 10 10s-4.477 10-10 10c-1.834 0-3.556-.498-5.03-1.375L2.005 22l1.392-4.925A9.958 9.958 0 0 1 2.001 12c0-5.523 4.477-10 10-10Zm3.614 13.413c.287.144 1.722.854 2.009.998.287.144.478.217.55.341.071.123.071.722-.209 1.42-.28.698-1.493 1.334-2.064 1.419-.51.077-1.158.109-1.871-.118-.432-.136-.985-.319-1.694-.625-2.981-1.287-4.928-4.289-5.077-4.487-.148-.199-1.213-1.612-1.213-3.074 0-1.463.768-2.182 1.04-2.479.272-.298.594-.372.792-.372.198 0 .396.002.57.01.182.01.427-.069.669.51.247.595.841 2.058.916 2.207.075.149.124.322.025.52-.1.199-.149.323-.298.497-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.012 2.093 1.325 2.39 1.475.297.148.471.124.644-.075.173-.198.743-.867.94-1.164.198-.298.396-.249.669-.15.272.1 1.733.818 2.03.967Z" />
    </svg>
  );
}

/** WhatsApp favicon-style mark (green tile + white glyph). */
export function WhatsAppFavicon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#25D366" />
      <path
        fill="#fff"
        d="M12.04 4.8c-3.97 0-7.2 3.2-7.2 7.14 0 1.26.33 2.48.97 3.56L4.8 19.2l3.82-.99c1.04.56 2.21.87 3.42.87 3.97 0 7.2-3.2 7.2-7.14S16.01 4.8 12.04 4.8Zm4.19 10.12c-.17.49-1.02.9-1.43.96-.38.05-.86.08-1.39-.09-.32-.1-.73-.23-1.25-.46-2.16-.93-3.57-3.12-3.68-3.27-.1-.15-.88-1.17-.88-2.23 0-1.06.56-1.58.76-1.8.2-.22.43-.27.57-.27.14 0 .29 0 .41.01.13.01.31-.05.49.37.18.43.61 1.49.66 1.6.05.11.09.23.02.38-.07.14-.11.23-.22.36-.1.13-.23.28-.32.38-.11.11-.22.22-.09.44.13.22.56.92 1.2 1.49.82.73 1.52.96 1.73 1.07.22.11.34.09.47-.05.13-.14.54-.63.68-.84.14-.22.29-.18.49-.11.2.07 1.25.59 1.47.7.21.1.35.16.4.25.05.09.05.52-.15 1.03Z"
      />
    </svg>
  );
}

export function SupportWhatsAppLink({
  className = "",
  label = "WhatsApp Support & Assistant",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button type="button" onClick={openWhatsAppSupportPicker} className={`cursor-pointer ${className}`}>
      {label}
    </button>
  );
}

export function WhatsAppSupportHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(SUPPORT_WHATSAPP_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(SUPPORT_WHATSAPP_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const chooseTopic = (label: string) => {
    setOpen(false);
    window.open(supportWhatsAppUrl(label), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-support-title"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 bg-[#128C7E] px-5 py-4 text-white">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
            <WhatsAppFillIcon className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="whatsapp-support-title" className="text-base font-bold">
              Welcome to {PLATFORM_NAME}
            </h2>
            <p className="mt-0.5 text-sm text-white/90">How can we assist you?</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <ol className="space-y-2 p-4">
          {SUPPORT_TOPICS.map((topic, index) => (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => chooseTopic(topic.label)}
                className="flex w-full items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/40 px-3 py-2.5 text-left text-sm font-medium text-brand-900 transition hover:border-brand-300 hover:bg-brand-50"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                  {index + 1}
                </span>
                {topic.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
