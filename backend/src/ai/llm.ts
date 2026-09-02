import { PLATFORM_NAME } from '../constants/platform';
import { knowledgeContextBlock } from './platformKnowledge';

export type AssistantTurn = { role: 'user' | 'assistant'; text: string };

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
].filter((m): m is string => Boolean(m));

function systemPrompt(roleName: string, firstName: string) {
  return [
    `You are the in-app assistant for ${PLATFORM_NAME}, a Ghana commodity marketplace.`,
    `The signed-in user is ${firstName || 'a member'} (${roleName}).`,
    'Answer the user’s typed question directly, in clear English.',
    'Use 2–5 short paragraphs or short steps. Cover what to do next on the platform.',
    'Do not refuse ordinary platform questions. If two topics overlap (for example payment and access), explain both.',
    'Only help with this platform: roles, farm/publication access, Paystack, orders, listings, chat, verification, library, refunds.',
    'Do not invent order statuses, balances, or that a payment succeeded. If you lack live account data, say so and name the portal page to open.',
    'Never ask for passwords, PIN, OTP, or full card numbers.',
    'If the question is unrelated to ConcordiaOrbis, say you only support this platform, then still offer Help in the footer.',
    'For a human, tell them to tap Help in the footer (WhatsApp).',
    '',
    'Platform facts you must stay consistent with:',
    knowledgeContextBlock(),
  ].join('\n');
}

function sanitizeHistory(history: AssistantTurn[] | undefined): AssistantTurn[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter((turn) => turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.text === 'string')
    .map((turn) => ({ role: turn.role, text: turn.text.trim().slice(0, 1000) }))
    .filter((turn) => turn.text.length > 0)
    .slice(-10);
}

async function fetchJson(url: string, init: RequestInit, timeoutMs = 20000) {
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

function geminiText(json: Record<string, unknown>): string {
  const candidates = json.candidates as Array<{
    content?: { parts?: Array<{ text?: string }> };
    output?: string;
  }> | undefined;
  const parts = candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text || '').join('\n').trim();
  return text;
}

export async function askFreeLlm(params: {
  question: string;
  roleName: string;
  firstName: string;
  history?: AssistantTurn[];
}): Promise<{ answer: string; provider: string } | null> {
  const prompt = systemPrompt(params.roleName, params.firstName);
  const history = sanitizeHistory(params.history);
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const contents = [
      { role: 'user', parts: [{ text: `${prompt}\n\nReply with “Ready.” only.` }] },
      { role: 'model', parts: [{ text: 'Ready.' }] },
      ...history.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: turn.text }],
      })),
      { role: 'user', parts: [{ text: params.question }] },
    ];

    for (const model of GEMINI_MODELS) {
      try {
        const json = await fetchJson(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
            }),
          }
        );
        const text = geminiText(json);
        if (text && text.toLowerCase() !== 'ready.') return { answer: text, provider: 'gemini' };
      } catch {
        /* try next model or provider */
      }
    }
  }

  const chatMessages = [
    { role: 'system', content: prompt },
    ...history.map((turn) => ({
      role: turn.role === 'assistant' ? 'assistant' : 'user',
      content: turn.text,
    })),
    { role: 'user', content: params.question },
  ];

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
          temperature: 0.4,
          max_tokens: 1024,
          messages: chatMessages,
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
          temperature: 0.4,
          max_tokens: 1024,
          messages: chatMessages,
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
