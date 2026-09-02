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
    keywords: ["access", "unlock", "fee", "preview", "farm access", "publication access", "pay to see"],
    answer: `Marketplace previews show name, category, and region. To see quantities, prices, harvest windows, contact details, and messaging, a client pays a one-time farm access fee through Paystack. Research publications work the same way: pay to unlock the full document. Access does not by itself complete a produce order.`,
  },
  {
    id: "payment",
    keywords: ["pay", "payment", "paystack", "momo", "mobile money", "card", "transaction", "charge", "checkout"],
    answer: `All platform charges go through Paystack (card, mobile money, or bank). You pay ${PLATFORM_NAME}, not the fellow directly. Confirm in the Paystack sheet until it succeeds. If Paystack says the payer reached their limit, that is the MoMo wallet or bank limit — try another number or card. Failed charges are not treated as paid until Paystack confirms.`,
  },
  {
    id: "order",
    keywords: ["order", "delivery", "track", "liaison", "procure", "shipping", "status"],
    answer: `After farm access, place an order from the listing. ${PLATFORM_NAME} takes payment through Paystack. A liaison officer then procures the items, checks quality, and arranges delivery to the agreed location. Track progress on My Orders. Quality issues after delivery are reviewed case by case — use WhatsApp Support with your order details.`,
  },
  {
    id: "listing",
    keywords: ["list", "listing", "commodity", "product", "price", "harvest", "quantity", "upload"],
    answer: `Fellows add commodities on My Production: crop or livestock type, quantity, unit, price, harvest or delivery window, and photos or short video. Keep listings accurate. Clients only see full figures after they pay farm access. You can update a listing later from the same farm pages.`,
  },
  {
    id: "account",
    keywords: ["login", "register", "password", "verify", "verification", "email", "phone", "profile", "google"],
    answer: `Register with email or Google, complete your profile (name, location, role), then verify email. Phone verification may be required depending on settings. Admin reviews some accounts. If you cannot sign in, use forgot-password on the login page or WhatsApp Support. Never share your password.`,
  },
  {
    id: "connection",
    keywords: ["connection", "chat", "message", "contact", "whatsapp"],
    answer: `After access, clients can request a connection and chat in-app with the fellow or their liaison. Do not move payment off ${PLATFORM_NAME}. For staff help, use WhatsApp Support & Assistant from the green button — that is a person, not this AI.`,
  },
  {
    id: "library",
    keywords: ["library", "publication", "research", "pdf", "paper"],
    answer: `The research library lists publications from verified researchers. You can read the preview freely. Pay the access fee through Paystack to open the full PDF and details. Comments may be available after access, depending on the publication.`,
  },
  {
    id: "refund",
    keywords: ["refund", "mistake", "charged twice", "cancel"],
    answer: `Refunds and mistaken Paystack charges are handled by ${PLATFORM_NAME} support, not inside checkout. Use WhatsApp Support or email concordiaorbisadmin@gmail.com with your name, account email, Paystack reference, and amount. Do not send card or MoMo PINs.`,
  },
];

export const DEFAULT_ASSISTANT_ANSWER = `I am the ${PLATFORM_NAME} assistant. I can explain farm access, Paystack payments, orders, listings, roles, verification, and the research library. Ask a short question about those. For a person, tap WhatsApp Support & Assistant.`;

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function matchPlatformKnowledge(question: string): { id: string; answer: string; score: number } | null {
  const q = normalize(question);
  if (!q) return null;

  let best: { id: string; answer: string; score: number } | null = null;
  for (const entry of PLATFORM_KNOWLEDGE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword)) score += keyword.split(" ").length;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { id: entry.id, answer: entry.answer, score };
    }
  }

  return best && best.score >= 1 ? best : null;
}

export function knowledgeContextBlock() {
  return PLATFORM_KNOWLEDGE.map((entry) => `- ${entry.answer}`).join("\n");
}
