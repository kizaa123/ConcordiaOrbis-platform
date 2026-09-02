import { PLATFORM_NAME } from '../constants/platform';
import { knowledgeContextBlock } from './platformKnowledge';

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
].filter((m): m is string => Boolean(m));

function systemPrompt(roleName: string, firstName: string) {
  return [
    `You are the in-app assistant for ${PLATFORM_NAME}, a Ghana commodity marketplace.`,
    `The signed-in user is ${firstName || 'a member'} (${roleName}).`,
    'Answer in plain English, short paragraphs, no markdown headings.',
    'Only help with this platform: roles, farm/publication access, Paystack, orders, listings, chat, verification, library, refunds.',
    'Do not invent order statuses, balances, or that a payment succeeded. If you lack live account data, say so and point them to the matching portal page or WhatsApp Support.',
    'Never ask for passwords, PIN, OTP, or full card numbers.',
    'If the question is unrelated to ConcordiaOrbis, say you only support this platform.',
    '',
    'Platform facts:',
    knowledgeContextBlock(),
  ].join('\n');
}

async function fetchJson(url: string, init: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const err = typeof json.error === 'object' && json.error ? json.error : json;
      throw new Error(typeof err === 'string' ? err : JSON.stringify(err).slice(0, 240));
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

export function hasFreeLlmKey() {
  return Boolean(
    process.env.GEMINI_API_KEY?.trim() ||
      process.env.GROQ_API_KEY?.trim() ||
      process.env.OPENAI_API_KEY?.trim()
  );
}

export async function askFreeLlm(params: {
  question: string;
  roleName: string;
  firstName: string;
}): Promise<{ answer: string; provider: string } | null> {
  const prompt = systemPrompt(params.roleName, params.firstName);
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        const json = await fetchJson(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: prompt }] },
              contents: [{ role: 'user', parts: [{ text: params.question }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
            }),
          }
        );
        const candidates = json.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }> | undefined;
        const text = candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('\n').trim();
        if (text) return { answer: text, provider: 'gemini' };
      } catch {
        /* try next model or provider */
      }
    }
  }

  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey) {
    try {
      const json = await fetchJson('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant',
          temperature: 0.3,
          max_tokens: 512,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: params.question },
          ],
        }),
      });
      const choices = json.choices as Array<{ message?: { content?: string } }> | undefined;
      const text = choices?.[0]?.message?.content?.trim();
      if (text) return { answer: text, provider: 'groq' };
    } catch {
      /* fall through */
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    try {
      const json = await fetchJson('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
          temperature: 0.3,
          max_tokens: 512,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: params.question },
          ],
        }),
      });
      const choices = json.choices as Array<{ message?: { content?: string } }> | undefined;
      const text = choices?.[0]?.message?.content?.trim();
      if (text) return { answer: text, provider: 'openai' };
    } catch {
      /* fall through */
    }
  }

  return null;
}
