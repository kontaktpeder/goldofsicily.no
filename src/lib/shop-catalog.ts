export const PRICE_SIX_ORE = 16_900;
export const PRICE_FIFTY_ORE = 125_000;

export const SHOP_FLAVORS = ["nduja", "truffle"] as const;
export type ShopFlavorSlug = (typeof SHOP_FLAVORS)[number];

export const DISCOVERY_SOURCES = ["friends", "instagram", "venue", "search", "other"] as const;
export type DiscoverySource = (typeof DISCOVERY_SOURCES)[number];

export const CONSUMER_FACT_KEYS = ["ingredients", "allergens", "storage", "prep"] as const;
export type ConsumerFactKey = (typeof CONSUMER_FACT_KEYS)[number];

/** `verified` is true only when the portal has marked the four consumer facts confirmed. */
export type FlavorFacts = {
  verified: boolean;
  ingredients: string | null;
  allergens: string | null;
  storage: string | null;
  prep: string | null;
  ingredientsEn: string | null;
  allergensEn: string | null;
  storageEn: string | null;
  prepEn: string | null;
};

export type PublicFlavor = {
  slug: ShopFlavorSlug;
  nameNo: string;
  nameEn: string;
  boxes50: number;
  facts: FlavorFacts;
};

export type PurchaseGate = {
  open: false;
  missing: string[];
};

export type PublicShop = {
  paymentOpen: false;
  stockKnown: boolean;
  flavors: PublicFlavor[];
  purchaseGate: PurchaseGate;
  /** True only when this portal build can store a sales-start notice separately. */
  launchList: boolean;
  /** Server setting. False keeps private checkout as a request, not a binding order. */
  bindingOpen: boolean;
};

const FLAVOR_NAME: Record<ShopFlavorSlug, { nameNo: string; nameEn: string }> = {
  nduja: { nameNo: "’Nduja & mozzarella", nameEn: "’Nduja & mozzarella" },
  truffle: { nameNo: "Trøffel & sjampinjong", nameEn: "Truffle & champignon" },
};

export function emptyFacts(): FlavorFacts {
  return {
    verified: false,
    ingredients: null,
    allergens: null,
    storage: null,
    prep: null,
    ingredientsEn: null,
    allergensEn: null,
    storageEn: null,
    prepEn: null,
  };
}

export function consumerFactGaps(
  slug: string,
  facts: {
    verified: boolean;
    ingredients: string | null;
    allergens: string | null;
    storage: string | null;
    prep: string | null;
  },
): string[] {
  const gaps: string[] = [];
  for (const key of CONSUMER_FACT_KEYS) {
    if (!facts.verified || !facts[key]?.trim()) gaps.push(`${slug}:${key}`);
  }
  return gaps;
}

/** Real checkout needs an explicit verification and every mandatory consumer fact. */
export function canOpenCheckout(
  paymentRequested: boolean,
  facts: {
    verified: boolean;
    ingredients: string | null;
    allergens: string | null;
    storage: string | null;
    prep: string | null;
  },
): boolean {
  if (!paymentRequested || !facts.verified) return false;
  return CONSUMER_FACT_KEYS.every((key) => Boolean(facts[key]?.trim()));
}

function closedGate(flavors: readonly PublicFlavor[]): PurchaseGate {
  return {
    open: false,
    missing: flavors.flatMap((flavor) => consumerFactGaps(flavor.slug, flavor.facts)),
  };
}

export function formatShopPrice(ore: number): string {
  const kroner = Math.round(ore / 100);
  const body = Math.abs(kroner)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${body} kr`;
}

export function clampBoxQty(qty: number, boxes: number, stockKnown: boolean): number {
  if (!stockKnown || boxes <= 0) return 1;
  const whole = Number.isFinite(qty) ? Math.floor(qty) : 1;
  return Math.min(boxes, Math.max(1, whole));
}

export function orderTotalOre(qty: number): number {
  const boxes = Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0;
  return boxes * PRICE_FIFTY_ORE;
}

export function piecePriceLine(lang: "no" | "en"): string {
  const price = formatShopPrice(PRICE_FIFTY_ORE / 50);
  return lang === "en" ? `${price} each` : `${price}/stk`;
}

/** Future checkout label. Payment stays off until that path is actually opened. */
export function orderCta(lang: "no" | "en", qty: number): string {
  const pieces = Math.max(1, Math.floor(qty)) * 50;
  const price = formatShopPrice(orderTotalOre(Math.max(1, Math.floor(qty))));
  return lang === "en" ? `Order ${pieces} pcs · ${price}` : `Bestill ${pieces} stk · ${price}`;
}

export function fiftyStockLine(
  lang: "no" | "en",
  boxes: number,
  stockKnown: boolean,
  orderingOpen: boolean,
): string {
  if (!stockKnown) {
    return lang === "en"
      ? "Stock is read from the portal. We can’t see it right now."
      : "Lageret leses fra portalen. Vi får ikke lest det nå.";
  }
  if (boxes <= 0) {
    return lang === "en"
      ? "The gold is gone.\nWe’ll let you know when the next batch is ready."
      : "Det er tomt for gull.\nVi gir deg beskjed når neste batch er klar.";
  }
  if (!orderingOpen) {
    if (lang === "en") return boxes === 1 ? "1 box in stock" : `${boxes} boxes in stock`;
    return boxes === 1 ? "1 eske på lager" : `${boxes} esker på lager`;
  }
  if (lang === "en") return boxes === 1 ? "1 box available" : `${boxes} boxes available`;
  return boxes === 1 ? "1 eske tilgjengelig" : `${boxes} esker tilgjengelig`;
}

export function shopUnavailable(): PublicShop {
  const flavors = SHOP_FLAVORS.map((slug) => ({
    slug,
    ...FLAVOR_NAME[slug],
    boxes50: 0,
    facts: emptyFacts(),
  }));
  return {
    paymentOpen: false,
    stockKnown: false,
    flavors,
    purchaseGate: closedGate(flavors),
    launchList: false,
    bindingOpen: false,
  };
}

function readFactText(row: Record<string, unknown>, key: ConsumerFactKey): string | null {
  const raw = row[key];
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  return text.length > 0 ? text : null;
}

function readOptionalText(row: Record<string, unknown>, key: string): string | null {
  const raw = row[key];
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  return text.length > 0 ? text : null;
}

function readFacts(value: unknown): FlavorFacts {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const ingredients = readFactText(row, "ingredients");
  const allergens = readFactText(row, "allergens");
  const storage = readFactText(row, "storage");
  const prep = readFactText(row, "prep");
  return {
    verified: row.verified === true && Boolean(ingredients && allergens && storage && prep),
    ingredients,
    allergens,
    storage,
    prep,
    ingredientsEn: readOptionalText(row, "ingredientsEn"),
    allergensEn: readOptionalText(row, "allergensEn"),
    storageEn: readOptionalText(row, "storageEn"),
    prepEn: readOptionalText(row, "prepEn"),
  };
}

export function parsePublicShop(value: unknown): PublicShop | null {
  if (!value || typeof value !== "object") return null;
  const row = value as {
    stockKnown?: unknown;
    flavors?: unknown;
    purchaseGate?: unknown;
    ordering?: { bindingOpen?: unknown };
  };
  if (!Array.isArray(row.flavors)) return null;
  const flavors: PublicFlavor[] = [];
  for (const slug of SHOP_FLAVORS) {
    const found = row.flavors.find(
      (item) => item && typeof item === "object" && (item as { slug?: unknown }).slug === slug,
    ) as { boxes50?: unknown; facts?: unknown } | undefined;
    if (
      !found ||
      typeof found.boxes50 !== "number" ||
      !Number.isInteger(found.boxes50) ||
      found.boxes50 < 0
    ) {
      return null;
    }
    flavors.push({
      slug,
      ...FLAVOR_NAME[slug],
      boxes50: found.boxes50,
      facts: readFacts(found.facts),
    });
  }
  return {
    paymentOpen: false,
    stockKnown: row.stockKnown === true,
    flavors,
    purchaseGate: closedGate(flavors),
    launchList: "purchaseGate" in row && !!row.purchaseGate && typeof row.purchaseGate === "object",
    bindingOpen: row.ordering?.bindingOpen === true,
  };
}

/**
 * A portal without the sales-start list must not receive a launch-only signup.
 * That older route would store it as a flavor waitlist and could mail immediately.
 */
export function launchPostAllowed(
  launchList: boolean,
  input: { launchNotice: boolean; restockNotice: boolean },
): "post" | "strip-launch" | "block" {
  if (!input.launchNotice || launchList) return "post";
  if (input.restockNotice) return "strip-launch";
  return "block";
}

export type WaitlistInput = {
  email: string;
  flavor: ShopFlavorSlug;
  lang: "no" | "en";
  discovery: DiscoverySource | null;
  newsletterConsent: boolean;
  launchNotice: boolean;
  restockNotice: boolean;
};

function readDiscovery(value: unknown): DiscoverySource | null | undefined {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return undefined;
  return (DISCOVERY_SOURCES as readonly string[]).includes(value)
    ? (value as DiscoverySource)
    : undefined;
}

/** Older clients omit the flags and stay on the flavor waitlist only. */
export function noticeFlags(
  launchRaw: unknown,
  restockRaw: unknown,
): { launchNotice: boolean; restockNotice: boolean } | null {
  const hasLaunch = typeof launchRaw === "boolean";
  const hasRestock = typeof restockRaw === "boolean";
  const launchNotice = hasLaunch ? launchRaw : false;
  const restockNotice = hasRestock ? restockRaw : !hasLaunch;
  if (!launchNotice && !restockNotice) return null;
  return { launchNotice, restockNotice };
}

export function parseWaitlist(body: unknown): WaitlistInput | null {
  if (!body || typeof body !== "object") return null;
  const row = body as Record<string, unknown>;
  if (typeof row.email !== "string" || typeof row.flavor !== "string") return null;
  if (typeof row.newsletterConsent !== "boolean") return null;
  const email = row.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return null;
  if (!(SHOP_FLAVORS as readonly string[]).includes(row.flavor)) return null;
  if (row.lang !== "no" && row.lang !== "en") return null;
  const discovery = readDiscovery(row.discovery);
  const notices = noticeFlags(row.launchNotice, row.restockNotice);
  if (discovery === undefined || !notices) return null;
  return {
    email,
    flavor: row.flavor as ShopFlavorSlug,
    lang: row.lang,
    discovery,
    newsletterConsent: row.newsletterConsent,
    launchNotice: notices.launchNotice,
    restockNotice: notices.restockNotice,
  };
}
