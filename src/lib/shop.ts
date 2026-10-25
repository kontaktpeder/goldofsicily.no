import { portalApiBase } from "@/lib/portal-venues";
import {
  parsePublicShop,
  shopUnavailable,
  type PublicShop,
  type WaitlistInput,
} from "@/lib/shop-catalog";

export {
  CONSUMER_FACT_KEYS,
  DISCOVERY_SOURCES,
  PRICE_FIFTY_ORE,
  PRICE_SIX_ORE,
  canOpenCheckout,
  clampBoxQty,
  launchPostAllowed,
  fiftyStockLine,
  formatShopPrice,
  orderCta,
  orderTotalOre,
  piecePriceLine,
  parsePublicShop,
  parseWaitlist,
  shopUnavailable,
} from "@/lib/shop-catalog";
export type {
  DiscoverySource,
  FlavorFacts,
  PublicFlavor,
  PublicShop,
  ShopFlavorSlug,
  WaitlistInput,
} from "@/lib/shop-catalog";

const PORTAL_FALLBACKS = ["https://portal.goldofsicily.no", "https://aranicnireport.lovable.app"];

function portalBases() {
  return [...new Set([portalApiBase(), ...PORTAL_FALLBACKS])];
}

export async function loadShopPage(): Promise<PublicShop> {
  for (const base of portalBases()) {
    try {
      const response = await fetch(`${base}/api/public/v1/shop`, {
        headers: { Accept: "application/json" },
        redirect: "manual",
        signal: AbortSignal.timeout(4000),
      });
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) continue;
      const parsed = parsePublicShop(await response.json());
      if (parsed) return parsed;
    } catch {
      continue;
    }
  }
  return shopUnavailable();
}

export type ShopOrderPost =
  | { ok: true; number: string; kind: "binding" | "quote" }
  | { ok: false; reason: "short" | "invalid" | "unavailable" };

export async function postShopOrder(input: Record<string, unknown>): Promise<ShopOrderPost> {
  for (const base of portalBases()) {
    try {
      const response = await fetch(`${base}/api/public/v1/shop/orders`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(input),
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });
      if (response.status === 404) continue;
      if (response.ok) {
        const body = (await response.json()) as { number?: unknown; kind?: unknown };
        const number = typeof body.number === "string" ? body.number : "";
        const kind = body.kind === "binding" ? "binding" : "quote";
        return { ok: true, number, kind };
      }
      if (response.status === 409) return { ok: false, reason: "short" };
      if (response.status === 400) return { ok: false, reason: "invalid" };
    } catch {
      continue;
    }
  }
  return { ok: false, reason: "unavailable" };
}

export type PublicOffer = {
  number: string;
  flavorName: string;
  boxes: number;
  totalOre: number;
  fulfillment: "pickup" | "delivery_request";
  lang: "no" | "en";
  status: string;
};

export async function loadShopOffer(token: string): Promise<PublicOffer | null> {
  if (!token) return null;
  for (const base of portalBases()) {
    try {
      const response = await fetch(
        `${base}/api/public/v1/shop/offers?token=${encodeURIComponent(token)}`,
        {
          headers: { Accept: "application/json" },
          redirect: "manual",
          signal: AbortSignal.timeout(8000),
        },
      );
      if (response.status === 404) continue;
      if (!response.ok) return null;
      const body = (await response.json()) as Partial<PublicOffer>;
      if (!body || typeof body.number !== "string" || typeof body.boxes !== "number") return null;
      return {
        number: body.number,
        flavorName: typeof body.flavorName === "string" ? body.flavorName : "",
        boxes: body.boxes,
        totalOre: typeof body.totalOre === "number" ? body.totalOre : 0,
        fulfillment: body.fulfillment === "delivery_request" ? "delivery_request" : "pickup",
        lang: body.lang === "en" ? "en" : "no",
        status: typeof body.status === "string" ? body.status : "",
      };
    } catch {
      continue;
    }
  }
  return null;
}

export async function postShopOffer(
  token: string,
): Promise<"ok" | "stock" | "closed" | "unavailable"> {
  for (const base of portalBases()) {
    try {
      const response = await fetch(`${base}/api/public/v1/shop/offers`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });
      if (response.status === 404) continue;
      if (response.ok) return "ok";
      if (response.status === 409) return "stock";
      if (response.status === 400) return "closed";
    } catch {
      continue;
    }
  }
  return "unavailable";
}

export async function postWaitlist(
  input: WaitlistInput,
): Promise<"ok" | "invalid" | "unavailable"> {
  for (const base of portalBases()) {
    try {
      const response = await fetch(`${base}/api/public/v1/shop`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(input),
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });
      if (response.status === 404) continue;
      if (response.ok) return "ok";
      // The page already checked the email. A portal 400 means that list
      // still requires the optional question, or it is not open yet.
      if (response.status === 400) return "unavailable";
    } catch {
      continue;
    }
  }
  return "unavailable";
}
