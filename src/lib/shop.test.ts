import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PRICE_FIFTY_ORE,
  PRICE_SIX_ORE,
  fiftyStockLine,
  formatShopPrice,
  parsePublicShop,
  parseWaitlist,
  shopUnavailable,
} from "./shop-catalog.ts";

test("phase 1 prices and the stock lines stay fixed", () => {
  assert.equal(formatShopPrice(PRICE_SIX_ORE), "169 kr");
  assert.equal(formatShopPrice(PRICE_FIFTY_ORE), "1 250 kr");
  assert.equal(fiftyStockLine("no", 7, true), "7 esker igjen");
  assert.equal(fiftyStockLine("no", 1, true), "1 eske igjen");
  assert.equal(fiftyStockLine("no", 0, true), "Det er tomt for gull. Få beskjed ved neste slipp.");
  assert.equal(fiftyStockLine("en", 7, true), "7 boxes left");
  assert.match(fiftyStockLine("no", 0, false), /Vi får ikke lest det nå/);
});

test("a portal payload cannot turn payment on or rename the price", () => {
  const shop = parsePublicShop({
    paymentOpen: true,
    stockKnown: true,
    flavors: [
      { slug: "nduja", boxes50: 7, pieces: 400 },
      { slug: "truffle", boxes50: 0 },
    ],
    packs: { fifty: { purchasable: true, priceOre: 1 } },
  });
  assert.equal(shop?.paymentOpen, false);
  assert.equal(shop?.flavors[0]?.boxes50, 7);
  assert.equal("pieces" in (shop?.flavors[0] ?? {}), false);
  assert.equal(parsePublicShop({ stockKnown: true, flavors: [] }), null);
  assert.equal(shopUnavailable().stockKnown, false);
});

test("newsletter consent is its own field", () => {
  assert.equal(
    parseWaitlist({
      email: "ada@example.com",
      flavor: "nduja",
      lang: "no",
      discovery: "friends",
      newsletterConsent: true,
    })?.newsletterConsent,
    true,
  );
  assert.equal(
    parseWaitlist({
      email: "ada@example.com",
      flavor: "nduja",
      lang: "no",
      discovery: "friends",
    }),
    null,
  );
});

test("the buy page keeps payment off and stays out of the top nav", () => {
  const page = readFileSync(new URL("../components/shop-page.tsx", import.meta.url), "utf8");
  const nav = readFileSync(new URL("../components/brand-nav.tsx", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("./sitemap.ts", import.meta.url), "utf8");
  assert.match(page, /disabled/);
  assert.equal(page.toLowerCase().includes("stripe"), false);
  assert.equal(nav.includes("/kjop"), false);
  assert.equal(nav.includes("/en/buy"), false);
  assert.match(sitemap, /path: "\/kjop"/);
  assert.match(sitemap, /path: "\/en\/buy"/);
});
