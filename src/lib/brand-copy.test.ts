import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BRAND } from "./brand-copy.ts";

test("retired copy stays gone", () => {
  const blob = JSON.stringify(BRAND);
  for (const phrase of ["Kremet inni", "mindre styr", "Tutto passa"]) {
    assert.equal(blob.includes(phrase), false, phrase);
  }
  assert.match(BRAND.no.gold.body, /Sprø utenpå\. Myk inni\./);
  assert.match(BRAND.no.world.body, /enkel servering/);
});

test("hero CTAs are plain Gold text", () => {
  assert.equal(BRAND.no.hero.findCta, "Hvor serveres Gold?");
  assert.equal(BRAND.no.hero.venuesCta, "For ditt serveringssted");
  assert.equal(BRAND.en.hero.findCta, "Where is Gold served?");
});

test("homepage hero uses the character logo and hides the header wordmark until scroll", () => {
  const home = readFileSync(new URL("../components/brand-home.tsx", import.meta.url), "utf8");
  const mark = readFileSync(new URL("../components/brand-mark.tsx", import.meta.url), "utf8");
  assert.match(home, /revealLogoOnScroll/);
  assert.match(mark, /logo-characters\.png/);
  assert.match(mark, /alt="Gold of Sicily"/);
});

test("inline Gold is not used in nav or hero CTAs", () => {
  const nav = readFileSync(new URL("../components/brand-nav.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../components/brand-home.tsx", import.meta.url), "utf8");
  assert.equal(nav.includes("InlineGoldMark"), false);
  assert.equal(nav.includes("GoldMark"), false);
  assert.match(home, /\{t\.hero\.findCta\}/);
  assert.match(home, /\{t\.hero\.venuesCta\}/);
  assert.equal(home.includes("<InlineGoldMark"), true);
});
