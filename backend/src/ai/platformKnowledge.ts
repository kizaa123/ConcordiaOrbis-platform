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
    answer: `Roles on ${PLATFORM_NAME}: Fellows (organisation) list products. Clients browse and order after access. Fellow Liaison Officers (FLO) are the agents who represent fellows and clients. Researchers publish in the library. Accountants and staff handle verification, ads, and settlements. Your dashboard only shows tools for your role.`,
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
    answer: `After access, clients can request a connection and chat in-app with the fellow or their liaison. Do not move payment off ${PLATFORM_NAME}. For a person, tap Help in the sidebar. That opens WhatsApp Support.`,
  },
  {
    id: "other",
    keywords: ["other", "other assistance", "someone", "human", "staff", "talk to"],
    answer: `For anything this assistant cannot finish, tap Help in the sidebar. That opens WhatsApp so a ${PLATFORM_NAME} person can assist you. Have your account email and any Paystack reference ready.`,
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
    answer: `If a Paystack charge failed or is pending, ${PLATFORM_NAME} has not taken that money yet. Open the same checkout again only after Paystack confirms. A “payer has reached their limit” message is your MoMo or bank limit, not a ${PLATFORM_NAME} setting. Try another number, card, or bank. If you were billed twice, tap Help in the sidebar with the Paystack reference.`,
  },
  {
    id: "quality",
    keywords: [
      "quality",
      "determine quality",
      "how to tell quality",
      "good produce",
      "fresh",
      "grade",
      "inspect",
      "spoiled",
      "rotten",
      "check quality",
      "farm product",
      "is it good",
    ],
    answer: `To judge farm product quality on ${PLATFORM_NAME}, use the listing first, then the liaison officer. Read the photos, harvest or delivery window, quantity, and description. After you pay farm access, compare what the fellow wrote with what you see. A ${PLATFORM_NAME} liaison officer procures the goods, checks them before delivery, and should refuse lots that are mouldy, rotten, underweight, or not what was listed. You are not expected to run a lab test. Look for: even size and colour, no unusual smell, no live pests, dry grain (not damp), firm fruit, and livestock that looks healthy and matches the age or weight in the listing. If quality after delivery does not match the order, open My Orders and tap Help in the sidebar with photos and the order number.`,
  },
  {
    id: "quality-crops",
    keywords: [
      "maize",
      "cassava",
      "yam",
      "rice",
      "cocoa",
      "grain",
      "vegetable",
      "crop quality",
      "mould",
      "mold",
      "moisture",
      "weevil",
      "aflatoxin",
    ],
    answer: `For crops, quality starts with dryness, cleanliness, and honesty of weight. Maize, rice, and other grain should be dry to the touch, free of mould, live weevils, and foreign matter (stones, husks, dust). Damp grain heats, smells sour, and is unsafe. Cassava, yam, and other roots should be firm, not slimy or black inside, and not sprouting if you want storage life. Leafy vegetables should look fresh, not wilted or yellow. Cocoa and other cash crops should match the grade the fellow described. On ${PLATFORM_NAME}, fellows should state quantity, unit, and harvest window clearly. The liaison officer checks the lot before it is delivered. If a listing looks too cheap for the season, treat it with care and use farm access plus liaison inspection before you commit to a large order.`,
  },
  {
    id: "quality-livestock",
    keywords: [
      "livestock",
      "cattle",
      "goat",
      "sheep",
      "poultry",
      "chicken",
      "animal health",
      "livestock quality",
      "weight",
      "healthy animal",
    ],
    answer: `Livestock quality is about health, age, and a fair match to the listing. Look for a bright eye, clean nose, normal breathing, and an animal that can stand and walk. Avoid animals that are extremely thin, have open wounds, diarrhoea, or heavy discharge. Poultry should be alert, with no crusted eyes or gasping. Weight and breed in the listing should match what the liaison officer sees. Ask for recent photos or a short video on the listing. ${PLATFORM_NAME} does not replace a veterinary inspection. The liaison officer confirms the animal matches the order before movement. Never pay a fellow in cash off the platform. If the delivered animal is not what you ordered, use My Orders and Help in the sidebar.`,
  },
  {
    id: "quality-fruit",
    keywords: [
      "fruit",
      "mango",
      "orange",
      "pineapple",
      "banana",
      "plantain",
      "ripe",
      "overripe",
      "fruit quality",
    ],
    answer: `Fruit quality depends on ripeness for your use, not only on looking pretty. For eating soon, fruit can be ripe and fragrant. For travel or storage, it should be firm, with little bruising. Reject fruit with leaks, deep cuts, mould, or a fermented smell. Plantain and banana should match the ripeness stage in the listing. Pineapple should feel heavy for its size and smell sweet at the base, not sour. On ${PLATFORM_NAME}, fellows should say the harvest or delivery window so clients know if the fruit will still be good on arrival. The liaison officer checks crates for mixed grades and hidden spoilage before delivery.`,
  },
  {
    id: "quality-fish",
    keywords: [
      "fish",
      "tilapia",
      "catfish",
      "aquaculture",
      "pond",
      "fresh fish",
      "fish quality",
      "smell fish",
    ],
    answer: `Fresh fish should smell like clean water or the pond, not ammonia or rot. Eyes should be clear, gills red or pink (not brown), and flesh firm when pressed. Ice or a cold chain matters in Ghana heat. Frozen fish should be solid, with no freezer burn or thaw-refreeze slime. On ${PLATFORM_NAME}, fish fellows should state whether the lot is live, fresh, or frozen, plus quantity and delivery timing. A liaison officer should not accept a warm, dull-eyed lot as “fresh.” Order quantities you can use or store the same day unless cold storage is agreed.`,
  },
  {
    id: "harvest",
    keywords: [
      "harvest",
      "when to harvest",
      "harvest window",
      "season",
      "maturity",
      "ready to harvest",
      "delivery date",
    ],
    answer: `Harvest quality is mostly about timing. Grain is ready when it is dry enough to store. Roots and tubers should be mature, not watery. Fruit should match the ripeness you need. Livestock should match the age or weight in the listing. On ${PLATFORM_NAME}, fellows set a harvest or delivery window on each listing. Clients should order inside that window. If you need a later date, chat after farm access or wait for an updated listing. The liaison officer procures close to the agreed window so produce is not sitting for days after harvest.`,
  },
  {
    id: "photos",
    keywords: [
      "photo",
      "picture",
      "video",
      "listing photo",
      "how to take photo",
      "image",
      "camera",
    ],
    answer: `Good listing photos help clients and liaison officers judge quality. Take pictures in daylight, not a dark store. Show the whole lot and a close-up of the grain, fruit, animal, or fish. Include a bag, crate, or person for scale. Do not use old photos from another season. A short video of livestock walking, or of fish on ice, is better than one still picture. Fellows add photos on My Production when they create or edit a listing. Misleading photos can delay verification and orders.`,
  },
  {
    id: "storage",
    keywords: [
      "store",
      "storage",
      "spoil",
      "spoilage",
      "keep fresh",
      "shelf life",
      "warehouse",
      "silo",
    ],
    answer: `Store produce for the type it is. Dry grain in a clean, ventilated place off the ground, in bags that can breathe, away from rain and rodents. Do not mix wet and dry lots. Roots and tubers need shade and airflow, not sealed plastic when they are still moist. Fruit and vegetables need cool shade and fast movement. Fish and meat need ice or a freezer. ${PLATFORM_NAME} listings should say when the goods will be ready, not promise long storage the fellow cannot provide. After delivery, the client is responsible for storage unless the order says otherwise.`,
  },
  {
    id: "pricing",
    keywords: [
      "how to price",
      "set price",
      "too cheap",
      "market price",
      "negotiate",
      "bargain",
      "fair price",
    ],
    answer: `Price from real cost and the local market, not from a guess. Fellows should check nearby market rates, harvest cost, bagging, and transport, then set a clear unit price on the listing (for example per bag, crate, kg, or bird). Clients see full prices after farm access. Do not move the deal to cash outside ${PLATFORM_NAME}. Liaison officers can help both sides agree, but payment still goes through Paystack to ${PLATFORM_NAME}. A price far below the season is often a quality or quantity risk. Ask for updated photos and let the liaison officer weigh or count the lot.`,
  },
  {
    id: "units",
    keywords: [
      "unit",
      "bag",
      "crate",
      "kilogram",
      "kg",
      "tonne",
      "weight",
      "how many",
      "quantity",
      "maxibag",
    ],
    answer: `Always match quantity to a unit. Write 50 kg, 100 kg bag, crate, bird, or gallon, not only “plenty.” Ghana trade often uses bags and crates, but bag weight can differ. Fellows should state the unit on My Production. Clients should confirm the same unit in the order. The liaison officer should count or weigh against that unit at procurement. If the delivered count or weight is short, record it on My Orders and use Help in the sidebar.`,
  },
  {
    id: "choose-farm",
    keywords: [
      "which farm",
      "choose farm",
      "best fellow",
      "trust",
      "verified",
      "how to choose",
      "compare listing",
    ],
    answer: `Choose a farm from the marketplace preview (name, category, region), then pay farm access to see prices, quantities, harvest windows, and contact. Prefer verified fellows with clear photos, a realistic harvest window, and a complete location. Read the listing instead of rushing the cheapest offer. After access you can chat and order. A ${PLATFORM_NAME} liaison officer still procures and checks quality. Farm access is not an order. You only pay for the produce when you place the order through Paystack.`,
  },
  {
    id: "quality-issue",
    keywords: [
      "bad quality",
      "wrong item",
      "short weight",
      "not what i ordered",
      "complaint",
      "reject",
      "damaged",
    ],
    answer: `If goods do not match the listing or order, keep photos of the lot, bags, and any scale reading. Note the order number and date. Open My Orders and describe what is wrong. Tap Help in the sidebar so ${PLATFORM_NAME} can review with the liaison officer. Do not pay the fellow extra cash to “fix” it. Quality after delivery is reviewed case by case. Honest photos from the fellow and a liaison check at pickup prevent most disputes.`,
  },
  {
    id: "pests",
    keywords: [
      "pest",
      "disease",
      "insect",
      "weevil",
      "rot",
      "blight",
      "sick plant",
      "crop disease",
    ],
    answer: `Pests and disease show up as holes in grain, live insects, leaf spots, wilting, rot, or sick animals. Fellows should not list a lot they know is infested. Dry and clean grain before bagging. Keep stores clean. This assistant cannot diagnose a photo as a named disease. For field advice, use the research library or a verified researcher publication after you pay publication access. For an order already in progress, tell the liaison officer and use Help in the sidebar. Do not apply unknown chemicals and then sell the lot as safe.`,
  },
  {
    id: "organic",
    keywords: ["organic", "chemical", "pesticide", "fertilizer", "natural", "certified"],
    answer: `${PLATFORM_NAME} does not issue organic certificates. If a fellow writes “organic” or “no chemical,” treat it as their claim unless they show a real certificate in chat after farm access. Clients who need certified produce should say so in the order notes and ask the liaison officer to confirm. Never assume a green photo means certified organic.`,
  },
  {
    id: "delivery-care",
    keywords: [
      "transport",
      "handling",
      "load",
      "truck",
      "breakage",
      "heat",
      "cold chain",
    ],
    answer: `Delivery quality depends on handling. Grain bags should stay dry. Fruit and vegetables should not be stacked so high they crush. Live animals need space, shade, and water for the trip. Fish need ice. The liaison officer arranges delivery to the location agreed on the order. Give a clear delivery address and a reachable phone. If goods arrive damaged from transport, photograph the load before you unpack everything and use Help in the sidebar with the order number.`,
  },
  {
    id: "access-vs-order",
    keywords: [
      "difference",
      "access fee",
      "order payment",
      "two payments",
      "pay twice",
      "what am i paying",
    ],
    answer: `There are two different Paystack charges. Farm access (or publication access) is a one-time fee to unlock full details for that farm or PDF. The produce order is a second payment for the goods themselves. Access does not buy the maize, goats, or fish. After access, place the order from the listing, pay ${PLATFORM_NAME} through Paystack, then the liaison officer procures and delivers. Both charges show in your financials when Paystack confirms them.`,
  },
  {
    id: "off-platform",
    keywords: [
      "cash",
      "outside",
      "direct pay",
      "momo to farmer",
      "off platform",
      "side deal",
    ],
    answer: `Do not pay fellows, clients, or liaison officers in cash or personal MoMo for platform orders. All ${PLATFORM_NAME} charges go through Paystack. Off-platform payment has no escrow, no order record, and no refund path through the company. If someone asks you to pay outside the app, refuse and tap Help in the sidebar.`,
  },
  {
    id: "fellow-tips",
    keywords: [
      "how to list",
      "sell produce",
      "my production",
      "fellow advice",
      "farmer tip",
    ],
    answer: `Fellows list on My Production. Pick the right commodity, honest quantity and unit, a real price, a harvest or delivery window, and clear photos. Keep the listing updated when stock changes. Complete your profile (region, city, phone) so clients and liaison officers can find you. After a client pays farm access they see full details. When an order is paid, work with your fellow liaison officer. Do not sell the same bag twice or change the grade after the order is confirmed.`,
  },
  {
    id: "client-tips",
    keywords: [
      "how to buy",
      "client advice",
      "first order",
      "source produce",
      "procurement",
    ],
    answer: `Clients browse the marketplace, pay farm access on farms they trust, then order. Start with a quantity you can receive and store. Confirm unit, harvest window, and delivery location before you pay for the order. Use in-app chat after access. Pay through Paystack only. Track the job on My Orders. The liaison officer checks quality at procurement. If you buy for a shop or institution, say so in the order so packing and delivery can match.`,
  },
  {
    id: "liaison-role",
    keywords: [
      "what does liaison",
      "officer does",
      "agent role",
      "handler duty",
      "who checks",
    ],
    answer: `Fellow Liaison Officers (FLO) are the agents on ${PLATFORM_NAME}. They represent fellows and clients: relationships, negotiation, procurement, quality check, and delivery arranged by the company. They do not replace Paystack. Fellows and clients still pay through the app. Clients and fellows choose a Fellow Liaison Officer at registration.`,
  },
  {
    id: "verification",
    keywords: [
      "verified",
      "pending",
      "admin review",
      "badge",
      "trust badge",
      "international verified",
    ],
    answer: `Verification is done by ${PLATFORM_NAME} staff. Complete your profile, use a real name, phone, and location, and keep listings accurate. Pending accounts can use the app in a limited way until staff finish review. Verified fellows are easier for clients to trust. International verification is a separate staff decision for people who may serve clients outside their country. Verification is not a quality certificate for every bag. The liaison officer still checks the lot when you order.`,
  },
  {
    id: "library-use",
    keywords: ["how to use library", "student", "read paper", "research access"],
    answer: `Open the library from your dashboard. Read the preview for free. Pay the publication access fee through Paystack to open the full document. Students and other readers use this for field knowledge. Researchers upload from their publications pages. Access to a paper is not farm access and does not unlock fellow contact details.`,
  },
];

export const DEFAULT_ASSISTANT_ANSWER = `I am the ${PLATFORM_NAME} assistant. Choose a number or ask about farm access, Paystack, orders, listings, produce quality, harvest, verification, or refunds. For a person, tap Help in the sidebar.`;

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
  parts.push(`If you still need a person, tap Help in the sidebar and share this question: “${question.slice(0, 160)}”.`);
  return parts.join("\n\n");
}

export function knowledgeContextBlock() {
  return PLATFORM_KNOWLEDGE.map((entry) => `- ${entry.answer}`).join("\n");
}
