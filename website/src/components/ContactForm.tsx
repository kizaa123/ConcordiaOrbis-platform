"use client";

import { FormEvent, useState } from "react";
import { CONTACT } from "@/lib/company";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("payments");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const to = topic === "payments" ? CONTACT.payments : CONTACT.hello;
    const subject = encodeURIComponent(`[ConcordiaOrbis] ${topic}: ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
      <div>
        <label className="text-sm font-semibold text-brand-900" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-900" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-900" htmlFor="topic">
          Topic
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        >
          <option value="payments">Mistaken payment / refund</option>
          <option value="partnership">Partnership</option>
          <option value="general">General enquiry</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-brand-900" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-xl border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="Include the Paystack reference if this is about a charge."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-brand-800 py-3 text-sm font-bold text-white hover:bg-brand-900"
      >
        Open email to send
      </button>
    </form>
  );
}
