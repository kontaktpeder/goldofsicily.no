import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BRAND } from "./brand-copy.ts";

test("arancini nav points at the evergreen /arancini page", () => {
  assert.equal(BRAND.no.paths.arancini, "/arancini");
  assert.equal(BRAND.en.paths.arancini, "/arancini");
});

test("venue nav points at the B2B page, not the old /for-barer URL", () => {
  assert.equal(BRAND.no.paths.venues, "/for-serveringssteder");
  assert.equal(BRAND.en.paths.venues, "/en/for-venues");
});

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

test("hero keeps the brand lockup words and names the product in Oslo", () => {
  assert.match(BRAND.no.hero.sub, /Oslo/);
  assert.match(BRAND.no.hero.sub, /arancini/i);
  assert.match(BRAND.no.hero.subLine, /serveringssted/);
  assert.match(BRAND.no.find.pageBody, /Oslo/);
  assert.match(BRAND.en.hero.sub, /Oslo/);
  assert.match(BRAND.en.hero.subLine, /venue/);
  assert.equal("kicker" in BRAND.no.hero, false);
});

test("homepage flavors use plain type and no decorative ampersand", () => {
  assert.equal(BRAND.no.gold.flavors[0], "'Nduja mozzarella");
  assert.equal(BRAND.no.gold.flavors[1], "Trøffel & sjampinjong");
  const home = readFileSync(new URL("../components/brand-home.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  assert.equal(home.includes("flavor-amp"), false);
  assert.equal(home.includes("FlavorName"), false);
  assert.equal(css.includes("flavor-amp"), false);
});

test("homepage hero uses the character logo and hides the header wordmark until scroll", () => {
  const home = readFileSync(new URL("../components/brand-home.tsx", import.meta.url), "utf8");
  const mark = readFileSync(new URL("../components/brand-mark.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(home, /revealLogoOnScroll/);
  assert.match(home, /BrandLogo priority/);
  assert.equal(home.includes("t.hero.kicker"), false);
  assert.equal(home.includes("Gold of Sicily · Sicilianske arancini"), false);
  assert.match(home, /as="h1"/);
  assert.match(home, /t\.hero\.subLine/);
  assert.match(mark, /logo-characters\.png/);
  assert.match(mark, /logo-drawing-mask/);
  assert.match(mark, /wordmark-script\.png/);
  assert.match(mark, /logo-drawing\.png/);
  assert.match(mark, /alt="Gold of Sicily"/);
  assert.match(mark, /fetchPriority/);
  assert.match(css, /max-width: min\(100%, 30rem\)/);
  assert.match(css, /max-height: min\(24rem, 44svh\)/);
});

test("footer is a real site map with lockup, links, contact and copyright", () => {
  const footer = readFileSync(new URL("../components/brand-footer.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(footer, /BrandWordmarkColor/);
  assert.match(footer, /BrandLockup/);
  assert.match(footer, /t\.nav\.arancini/);
  assert.match(footer, /t\.nav\.find/);
  assert.match(footer, /t\.nav\.venues/);
  assert.match(footer, /t\.nav\.about/);
  assert.match(footer, /SITE\.phoneLabel/);
  assert.match(footer, /SITE\.email/);
  assert.match(footer, /t\.footer\.copyright/);
  assert.match(footer, /sm:grid-cols-3/);
  assert.match(footer, /footer-wordmark/);
  assert.match(css, /\.brand-wordmark-color\.footer-wordmark/);
  assert.match(footer, /t\.footer\.navHeading/);
  assert.match(footer, /t\.footer\.contactHeading/);
  assert.match(footer, /t\.footer\.socialHeading/);
  assert.equal(footer.includes("BrandDrawingColor"), false);
  assert.equal(footer.includes("draw-lemon"), false);
  assert.equal(footer.includes("Oslo / Sicilia"), false);
  assert.equal(footer.includes("t.footer.places"), false);
  assert.equal(BRAND.no.footer.copyright, "© 2026 Gold of Sicily");
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

test("homepage venue cards fill with photo and show the venue logo", () => {
  const grid = readFileSync(new URL("../components/find-gold-grid.tsx", import.meta.url), "utf8");
  assert.match(grid, /min-h-\[21rem\]/);
  assert.match(grid, /absolute inset-0 h-full w-full object-cover/);
  assert.match(grid, /venue\.logoUrl/);
});

test("homepage rhythm keeps one product photo and a matching product line icon", () => {
  const home = readFileSync(new URL("../components/brand-home.tsx", import.meta.url), "utf8");
  assert.match(home, /icon-serve-product\.png/);
  assert.match(home, /icon-serve-airfryer\.png/);
  assert.match(home, /icon-serve-menu\.png/);
  assert.match(home, /icon-serve-follow\.png/);
  assert.equal(home.includes("draw-arancini-bite"), false);
  assert.equal(home.match(/photo-the-gold/g)?.length, 1);
  assert.equal(home.match(/photo-hands/g)?.length, 1);
  assert.match(home, /lg:order-2/);
  assert.match(home, /lg:order-1/);
  assert.match(home, /w-\[32%\]/);
  assert.match(home, /grid-cols-2/);
});

test("inline gold logo is gone; headings use plain Gold", () => {
  const nav = readFileSync(new URL("../components/brand-nav.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../components/brand-home.tsx", import.meta.url), "utf8");
  const mark = readFileSync(new URL("../components/brand-mark.tsx", import.meta.url), "utf8");
  const find = readFileSync(new URL("../routes/finn-oss.tsx", import.meta.url), "utf8");
  const map = readFileSync(new URL("../components/venues-map.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  assert.equal(nav.includes("InlineGoldMark"), false);
  assert.equal(home.includes("InlineGoldMark"), false);
  assert.equal(find.includes("InlineGoldMark"), false);
  assert.equal(mark.includes("InlineGoldMark"), false);
  assert.match(home, /\{t\.find\.titleMark\}/);
  assert.match(home, /\{t\.same\.line2Mark\}/);
  assert.match(find, /\{t\.find\.titleMark\}/);
  assert.equal(find.includes("decorate"), false);
  assert.equal(map.includes("gold-map-character"), false);
  assert.equal(css.includes("gold-map-character"), false);
  assert.match(home, /\{t\.hero\.findCta\}/);
  assert.match(home, /\{t\.hero\.venuesCta\}/);
});
