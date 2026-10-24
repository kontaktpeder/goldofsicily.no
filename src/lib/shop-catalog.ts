export const PRICE_SIX_ORE = 16_900;
export const PRICE_FIFTY_ORE = 125_000;

export const SHOP_FLAVORS = ["nduja", "truffle"] as const;
export type ShopFlavorSlug = (typeof SHOP_FLAVORS)[number];

export const DISCOVERY_SOURCES = ["friends", "instagram", "venue", "search", "other"] as const;
export type DiscoverySource = (typeof DISCOVERY_SOURCES)[number];

export type PublicFlavor = {
  slug: ShopFlavorSlug;
  nameNo: string;
  nameEn: string;
  boxes50: number;
};

export type PublicShop = {
  paymentOpen: false;
  stockKnown: boolean;
  flavors: PublicFlavor[];
};

const FLAVOR_NAME: Record<ShopFlavorSlug, { nameNo: string; nameEn: string }> = {
  nduja: { nameNo: "’Nduja", nameEn: "’Nduja" },
  truffle: { nameNo: "Trøffel", nameEn: "Truffle" },
};

export function formatShopPrice(ore: number): string {
  const kroner = Math.round(ore / 100);
  const body = Math.abs(kroner)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${body} kr`;
}

export function fiftyStockLine(lang: "no" | "en", boxes: number, stockKnown: boolean): string {
  if (!stockKnown) {
    return lang === "en"
      ? "Stock is read from the portal. We can’t see it right now."
      : "Lageret leses fra portalen. Vi får ikke lest det nå.";
  }
  if (boxes <= 0) {
    return lang === "en"
      ? "The gold is gone. Get a note at the next drop."
      : "Det er tomt for gull. Få beskjed ved neste slipp.";
  }
  if (lang === "en") return boxes === 1 ? "1 box left" : `${boxes} boxes left`;
  return boxes === 1 ? "1 eske igjen" : `${boxes} esker igjen`;
}

export function shopUnavailable(): PublicShop {
  return {
    paymentOpen: false,
    stockKnown: false,
    flavors: SHOP_FLAVORS.map((slug) => ({ slug, ...FLAVOR_NAME[slug], boxes50: 0 })),
  };
}

export function parsePublicShop(value: unknown): PublicShop | null {
  if (!value || typeof value !== "object") return null;
  const row = value as { stockKnown?: unknown; flavors?: unknown };
  if (!Array.isArray(row.flavors)) return null;
  const flavors: PublicFlavor[] = [];
  for (const slug of SHOP_FLAVORS) {
    const found = row.flavors.find(
      (item) => item && typeof item === "object" && (item as { slug?: unknown }).slug === slug,
    ) as { boxes50?: unknown } | undefined;
    if (
      !found ||
      typeof found.boxes50 !== "number" ||
      !Number.isInteger(found.boxes50) ||
      found.boxes50 < 0
    ) {
      return null;
    }
    flavors.push({ slug, ...FLAVOR_NAME[slug], boxes50: found.boxes50 });
  }
  return { paymentOpen: false, stockKnown: row.stockKnown === true, flavors };
}

export type WaitlistInput = {
  email: string;
  flavor: ShopFlavorSlug;
  lang: "no" | "en";
  discovery: DiscoverySource;
  newsletterConsent: boolean;
};

export function parseWaitlist(body: unknown): WaitlistInput | null {
  if (!body || typeof body !== "object") return null;
  const row = body as Record<string, unknown>;
  if (typeof row.email !== "string" || typeof row.flavor !== "string") return null;
  if (typeof row.discovery !== "string" || typeof row.newsletterConsent !== "boolean") return null;
  const email = row.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return null;
  if (!(SHOP_FLAVORS as readonly string[]).includes(row.flavor)) return null;
  if (row.lang !== "no" && row.lang !== "en") return null;
  if (!(DISCOVERY_SOURCES as readonly string[]).includes(row.discovery)) return null;
  return {
    email,
    flavor: row.flavor as ShopFlavorSlug,
    lang: row.lang,
    discovery: row.discovery as DiscoverySource,
    newsletterConsent: row.newsletterConsent,
  };
}
