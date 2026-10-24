import { portalApiBase } from "@/lib/portal-venues";
import {
  parsePublicShop,
  shopUnavailable,
  type PublicShop,
  type WaitlistInput,
} from "@/lib/shop-catalog";

export {
  DISCOVERY_SOURCES,
  PRICE_FIFTY_ORE,
  PRICE_SIX_ORE,
  fiftyStockLine,
  formatShopPrice,
  parsePublicShop,
  parseWaitlist,
  shopUnavailable,
} from "@/lib/shop-catalog";
export type {
  DiscoverySource,
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
      if (response.status === 400) return "invalid";
    } catch {
      continue;
    }
  }
  return "unavailable";
}
