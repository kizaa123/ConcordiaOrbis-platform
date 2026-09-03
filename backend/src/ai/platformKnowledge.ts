import { PLATFORM_NAME } from '../constants/platform';

export type KnowledgeEntry = {
  id: string;
  keywords: string[];
  answer: string;
};

export const PLATFORM_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "what",
    keywords: ["what is", "about", "concordiaorbis", "platform", "who are you", "help"],
    answer: `${PLATFORM_NAME} is a Ghana commodity marketplace. Verified fellows list crops, livestock, fruit, and fish. Clients preview farms, pay a one-time access fee to unlock full details, then order. Payments go to ${PLATFORM_NAME} through Paystack. A liaison officer procures, checks quality, and arranges delivery.`,
  },
  {
    id: "roles",
    keywords: ["role", "fellow", "farmer", "client", "buyer", "handler", "agent", "liaison", "researcher", "student", "accountant"],
    answer: `Roles on ${PLATFORM_NAME}: Fellows (crop, livestock, fruit/fish, organisation) list produce. Clients browse and order after farm access. Fellow Liaison Officers and Client Liaison Officers represent their side. Researchers publish in the library. Accountants and staff handle verification, ads, and settlements. Your dashboard only shows tools for your role.`,
  },
  {
    id: "access",
    keywords: ["access", "unlock", "fee", "preview", "farm access", "publication access", "pay to see", "farm or publication access"],
    answer: `Marketplace previews show name, category, and region. To see quantities, prices, harvest windows, contact details, and messaging, a client pays a one-time farm access fee through Paystack. Research publications work the same way: pay to unlock the full document. Access does not by itself complete a produce order.`,
  },
  {
    id: "payment",
    keywords: ["pay", "payment", "paystack", "momo", "mobile money", "card", "transaction", "charge", "checkout", "transaction or payment error"],
    answer: `All platform charges go through Paystack (card, mobile money, or bank). You pay ${PLATFORM_NAME}, not the fellow directly. Confirm in the Paystack sheet until it succeeds. If Paystack says the payer reached their limit, that is the MoMo wallet or bank limit. Try another number or card. Failed charges are not treated as paid until Paystack confirms.`,
  },
  {
    id: "order",
    keywords: ["order", "delivery", "track", "liaison", "procure", "shipping", "status", "orders delivery or tracking"],
    answer: `After farm access, place an order from the listing. ${PLATFORM_NAME} takes payment through Paystack. A liaison officer then procures the items, checks quality, and arranges delivery to the agreed location. Track progress on My Orders. Quality issues after delivery are reviewed case by case. Use WhatsApp Support with your order details.`,
  },
  {
    id: "listing",
    keywords: ["list", "listing", "commodity", "product", "price", "harvest", "quantity", "upload", "marketplace or listings"],
    answer: `Fellows add commodities on My Production: crop or livestock type, quantity, unit, price, harvest or delivery window, and photos or short video. Keep listings accurate. Clients only see full figures after they pay farm access. You can update a listing later from the same farm pages.`,
  },
  {
    id: "account",
    keywords: ["login", "register", "password", "verify", "verification", "email", "phone", "profile", "google", "account login or verification"],
    answer: `Register with email or Google, complete your profile (name, location, role), then verify email. Phone verification may be required depending on settings. Admin reviews some accounts. If you cannot sign in, use forgot-password on the login page or WhatsApp Support. Never share your password.`,
  },
  {
    id: "connection",
    keywords: ["connection", "chat", "message", "contact", "whatsapp"],
    answer: `After access, clients can request a connection and chat in-app with the fellow or their liaison. Do not move payment off ${PLATFORM_NAME}. For a person, tap Help in the footer. That opens WhatsApp Support.`,
  },
  {
    id: "other",
    keywords: ["other", "other assistance", "someone", "human", "staff", "talk to"],
    answer: `For anything this assistant cannot finish, tap Help in the footer. That opens WhatsApp so a ${PLATFORM_NAME} person can assist you. Have your account email and any Paystack reference ready.`,
  },
  {
    id: "library",
    keywords: ["library", "publication", "research", "pdf", "paper"],
    answer: `The research library lists publications from verified researchers. You can read the preview freely. Pay the access fee through Paystack to open the full PDF and details. Comments may be available after access, depending on the publication.`,
  },
  {
    id: "refund",
    keywords: ["refund", "mistake", "charged twice", "cancel", "refunds or mistaken charges"],
    answer: `Refunds and mistaken Paystack charges are handled by ${PLATFORM_NAME} support, not inside checkout. Use WhatsApp Support or email concordiaorbisadmin@gmail.com with your name, account email, Paystack reference, and amount. Do not send card or MoMo PINs.`,
  },
  {
    id: "error",
    keywords: ["error", "failed", "declined", "not working", "stuck", "pending", "didn't go through", "did not go", "unsuccessful"],
    answer: `If a Paystack charge failed or is pending, ${PLATFORM_NAME} has not taken that money yet. Open the same checkout again only after Paystack confirms. A “payer has reached their limit” message is your MoMo or bank limit, not a ${PLATFORM_NAME} setting. Try another number, card, or bank. If you were billed twice, tap Help in the footer with the Paystack reference.`,
  },
];

export const DEFAULT_ASSISTANT_ANSWER = `I am the ${PLATFORM_NAME} assistant. Choose a number or ask about farm access, Paystack payments, orders, listings, verification, or refunds. For a person, tap Help in the footer.`;

/** Same order as the WhatsApp / in-app assistant menu. */
const NUMBERED_TOPIC_IDS = ["payment", "access", "order", "account", "listing", "refund", "other"] as const;

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function rankPlatformKnowledge(question: string, limit = 3): Array<{ id: string; answer: string; score: number }> {
  const q = normalize(question);
  if (!q) return [];

  const numbered = q.match(/^([1-7])\b/);
  if (numbered) {
    const index = Number(numbered[1]) - 1;
    const entry = PLATFORM_KNOWLEDGE.find((item) => item.id === NUMBERED_TOPIC_IDS[index]);
    if (entry) return [{ id: entry.id, answer: entry.answer, score: 99 }];
  }

  const words = new Set(q.split(" ").filter((w) => w.length > 2));
  const ranked = PLATFORM_KNOWLEDGE.map((entry) => {
    let score = 0;
    const haystack = normalize(`${entry.keywords.join(" ")} ${entry.answer}`);
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) score += keyword.split(" ").length * 3;
    }
    for (const word of words) {
      if (haystack.includes(word)) score += 1;
    }
    return { id: entry.id, answer: entry.answer, score };
  })
    .filter((item) => item.score >= 2)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit);
}

export function matchPlatformKnowledge(question: string): { id: string; answer: string; score: number } | null {
  return rankPlatformKnowledge(question, 1)[0] ?? null;
}

export function composeGuideAnswer(question: string, firstName: string): string {
  const hits = rankPlatformKnowledge(question, 3);
  const greeting = firstName ? `${firstName}, ` : "";
  if (hits.length === 0) {
    return `${greeting}${DEFAULT_ASSISTANT_ANSWER}`;
  }

  const parts = [greeting + hits[0].answer];
  for (const extra of hits.slice(1)) {
    parts.push(extra.answer);
  }
  parts.push(`If you still need a person, tap Help in the footer and share this question: “${question.slice(0, 160)}”.`);
  return parts.join("\n\n");
}

export function knowledgeContextBlock() {
  return PLATFORM_KNOWLEDGE.map((entry) => `- ${entry.answer}`).join("\n");
}
