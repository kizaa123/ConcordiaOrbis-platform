"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { PLATFORM_NAME, openWhatsAppSupportPicker } from "@/lib/site";

const SUGGESTIONS = ["What is this platform?", "Farm access", "Paystack payments", "How do orders work?"];

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

export function AiAssistantFab() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi — I am the ${PLATFORM_NAME} assistant. Ask about farm access, payments, orders, listings, or your role. For a person, use WhatsApp Support.`,
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [open, messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    setInput("");
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: trimmed }]);
    setBusy(true);
    try {
      const res = await api.ai.assistant(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: res.answer },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: e instanceof Error ? e.message : "I could not answer just now. Try again or use WhatsApp Support.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="ConcordiaOrbis assistant"
        title={`${PLATFORM_NAME} assistant`}
        className="fixed z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-brand-800 text-white shadow-lg transition hover:scale-105 hover:bg-brand-900 bottom-[calc(8.75rem+env(safe-area-inset-bottom,0px))] right-4 lg:bottom-[5.25rem] lg:right-6"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M7 16h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3Zm0 0-3 4h.01" />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed z-[80] flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-xl bottom-[calc(12.25rem+env(safe-area-inset-bottom,0px))] right-4 lg:bottom-[9rem] lg:right-6"
          role="dialog"
          aria-labelledby="ai-assistant-title"
        >
          <div className="flex items-start gap-2 bg-brand-800 px-4 py-3 text-white">
            <div className="min-w-0 flex-1">
              <h2 id="ai-assistant-title" className="text-sm font-bold">
                {PLATFORM_NAME} assistant
              </h2>
              <p className="text-[11px] text-white/80">Free in-app guide</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-1.5 text-lg leading-none text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close assistant"
            >
              ×
            </button>
          </div>

          <div ref={listRef} className="max-h-72 min-h-[12rem] space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-brand-700 text-white"
                    : "bg-brand-50 text-brand-950"
                }`}
              >
                {m.text}
              </div>
            ))}
            {busy ? (
              <p className="text-xs text-brand-600">Thinking…</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-brand-100 px-3 py-2">
            {SUGGESTIONS.map((label) => (
              <button
                key={label}
                type="button"
                disabled={busy}
                onClick={() => send(label)}
                className="rounded-full border border-brand-200 px-2.5 py-1 text-[11px] font-medium text-brand-800 hover:bg-brand-50 disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 border-t border-brand-100 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the platform…"
              className="min-w-0 flex-1 rounded-xl border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              maxLength={1000}
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || input.trim().length < 2}
              className="rounded-xl bg-brand-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Send
            </button>
          </form>
          <button
            type="button"
            onClick={openWhatsAppSupportPicker}
            className="border-t border-brand-100 px-3 py-2 text-center text-[11px] font-medium text-brand-700 hover:bg-brand-50"
          >
            Talk to a person on WhatsApp
          </button>
        </div>
      ) : null}
    </>
  );
}
