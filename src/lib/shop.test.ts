import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  PRICE_FIFTY_ORE,
  PRICE_SIX_ORE,
  canOpenCheckout,
  clampBoxQty,
  launchPostAllowed,
  fiftyStockLine,
  formatShopPrice,
  orderTotalOre,
  parsePublicShop,
  parseWaitlist,
  shopUnavailable,
} from "./shop-catalog.ts";

const filledFacts = {
  verified: true,
  ingredients: "ris",
  allergens: "melk",
  storage: "fryst",
  prep: "ovn",
};

test("phase 1 prices, quantity and the stock lines stay fixed", () => {
  assert.equal(formatShopPrice(PRICE_SIX_ORE), "169 kr");
  assert.equal(formatShopPrice(PRICE_FIFTY_ORE), "1 250 kr");
  assert.equal(orderTotalOre(2), 250_000);
  assert.equal(formatShopPrice(orderTotalOre(2)), "2 500 kr");
  assert.equal(clampBoxQty(4, 7, true), 4);
  assert.equal(clampBoxQty(9, 7, true), 7);
  assert.equal(clampBoxQty(0, 7, true), 1);
  assert.equal(clampBoxQty(3, 0, true), 1);
  assert.equal(clampBoxQty(3, 7, false), 1);
  assert.equal(fiftyStockLine("no", 7, true), "7 esker tilgjengelig");
  assert.equal(fiftyStockLine("no", 1, true), "1 eske tilgjengelig");
  assert.equal(
    fiftyStockLine("no", 0, true),
    "Det er tomt for gull. Vi gir deg beskjed når neste batch er klar.",
  );
  assert.equal(fiftyStockLine("en", 7, true), "7 boxes available");
  assert.equal(fiftyStockLine("en", 1, true), "1 box available");
  assert.match(fiftyStockLine("en", 0, true), /next batch is ready/);
  assert.match(fiftyStockLine("no", 0, false), /Vi får ikke lest det nå/);
  assert.doesNotMatch(fiftyStockLine("no", 0, true), /på vei/);
});

test("a portal payload cannot turn payment on or mark facts confirmed", () => {
  const shop = parsePublicShop({
    paymentOpen: true,
    stockKnown: true,
    purchaseGate: { open: true, missing: [] },
    flavors: [
      { slug: "nduja", boxes50: 7, pieces: 400, facts: { ...filledFacts, verified: true } },
      { slug: "truffle", boxes50: 0, facts: filledFacts },
    ],
    packs: { fifty: { purchasable: true, priceOre: 1 } },
  });
  assert.equal(shop?.paymentOpen, false);
  assert.equal(shop?.purchaseGate.open, false);
  assert.equal(shop?.launchList, true);
  assert.equal(shop?.flavors[0]?.facts.verified, false);
  assert.equal(shop?.flavors[0]?.facts.allergens, "melk");
  assert.equal(shop?.flavors[0]?.boxes50, 7);
  assert.equal("pieces" in (shop?.flavors[0] ?? {}), false);
  assert.ok(shop?.purchaseGate.missing.includes("nduja:allergens"));
  assert.ok(shop?.purchaseGate.missing.includes("truffle:prep"));
  assert.equal(parsePublicShop({ stockKnown: true, flavors: [] }), null);
  assert.equal(shopUnavailable().stockKnown, false);
  assert.equal(shopUnavailable().purchaseGate.open, false);
  assert.equal(shopUnavailable().launchList, false);
  const legacy = parsePublicShop({
    stockKnown: true,
    flavors: [
      { slug: "nduja", boxes50: 1 },
      { slug: "truffle", boxes50: 0 },
    ],
  });
  assert.equal(legacy?.launchList, false);
  assert.equal(launchPostAllowed(false, { launchNotice: true, restockNotice: false }), "block");
  assert.equal(
    launchPostAllowed(false, { launchNotice: true, restockNotice: true }),
    "strip-launch",
  );
  assert.equal(launchPostAllowed(true, { launchNotice: true, restockNotice: false }), "post");
});

test("checkout stays closed until payment is requested and every fact is verified", () => {
  assert.equal(canOpenCheckout(true, { ...filledFacts, verified: false }), false);
  assert.equal(canOpenCheckout(false, filledFacts), false);
  assert.equal(canOpenCheckout(true, { ...filledFacts, allergens: "  " }), false);
  assert.equal(canOpenCheckout(true, filledFacts), true);
});

test("newsletter consent stays separate, and a notice needs at least one list", () => {
  const legacy = parseWaitlist({
    email: "ada@example.com",
    flavor: "nduja",
    lang: "no",
    discovery: "friends",
    newsletterConsent: true,
  });
  assert.equal(legacy?.newsletterConsent, true);
  assert.equal(legacy?.launchNotice, false);
  assert.equal(legacy?.restockNotice, true);
  assert.equal(
    parseWaitlist({
      email: "ada@example.com",
      flavor: "nduja",
      lang: "no",
      discovery: "friends",
    }),
    null,
  );
  const launch = parseWaitlist({
    email: "ada@example.com",
    flavor: "truffle",
    lang: "en",
    discovery: "search",
    newsletterConsent: false,
    launchNotice: true,
    restockNotice: false,
  });
  assert.equal(launch?.launchNotice, true);
  assert.equal(launch?.restockNotice, false);
  assert.equal(
    parseWaitlist({
      email: "ada@example.com",
      flavor: "nduja",
      lang: "no",
      discovery: "friends",
      newsletterConsent: false,
      launchNotice: false,
      restockNotice: false,
    }),
    null,
  );
});

test("the buy page keeps payment off, leads with the box slot, and stays out of the top nav", () => {
  const page = readFileSync(new URL("../components/shop-page.tsx", import.meta.url), "utf8");
  const gallery = readFileSync(new URL("./shop-gallery.ts", import.meta.url), "utf8");
  const nav = readFileSync(new URL("../components/brand-nav.tsx", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("./sitemap.ts", import.meta.url), "utf8");
  assert.match(page, /Bestilling åpner snart/);
  assert.match(page, /Ordering opens soon/);
  assert.match(page, /disabled/);
  assert.match(page, /Kommer snart/);
  assert.equal(page.toLowerCase().includes("stripe"), false);
  assert.doesNotMatch(page, /fixed bottom|inset-x-0 bottom|sticky/);
  assert.match(page, /facts\.verified \? copy\.confirmed : copy\.preliminary/);
  assert.match(gallery, /eske-50\.jpg/);
  assert.match(gallery, /photo-the-gold/);
  assert.match(gallery, /photo-hands/);
  assert.doesNotMatch(gallery, /menu-pistachio|menu-ragu/);
  assert.equal(nav.includes("/kjop"), false);
  assert.equal(nav.includes("/en/buy"), false);
  assert.match(sitemap, /path: "\/kjop"/);
  assert.match(sitemap, /path: "\/en\/buy"/);
});
