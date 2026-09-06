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

test("uploaded menu files render only on venue pages, beside dishes", () => {
  const grid = readFileSync(new URL("../components/find-gold-grid.tsx", import.meta.url), "utf8");
  const detail = readFileSync(new URL("../components/venue-detail.tsx", import.meta.url), "utf8");
  const menuFile = readFileSync(new URL("../components/venue-menu-file.tsx", import.meta.url), "utf8");
  assert.equal(grid.includes("VenueMenuFile"), false);
  assert.match(detail, /VenueMenuFile/);
  assert.match(detail, /md:grid-cols-\[minmax\(11rem,16rem\)_minmax\(0,1fr\)\]/);
  assert.match(menuFile, /isMenuImageUrl/);
  assert.match(menuFile, /max-w-\[16rem\]/);
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
