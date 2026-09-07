import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const landing = readFileSync(new URL("../components/for-venues-landing.tsx", import.meta.url), "utf8");
const noRedirect = readFileSync(new URL("../routes/for-barer.tsx", import.meta.url), "utf8");
const enRedirect = readFileSync(new URL("../routes/en.for-bars.tsx", import.meta.url), "utf8");
const noRoute = readFileSync(new URL("../routes/for-serveringssteder.tsx", import.meta.url), "utf8");
const enRoute = readFileSync(new URL("../routes/en.for-venues.tsx", import.meta.url), "utf8");

test("old B2B URLs permanently redirect", () => {
  assert.match(noRedirect, /statusCode: 301/);
  assert.match(noRedirect, /href: "\/for-serveringssteder"/);
  assert.match(enRedirect, /statusCode: 301/);
  assert.match(enRedirect, /href: "\/en\/for-venues"/);
});

test("new B2B routes render the short venue landing", () => {
  assert.match(noRoute, /ForVenuesLanding/);
  assert.match(enRoute, /ForVenuesLanding/);
  assert.match(enRoute, /lang="en"/);
});

test("venue landing has a single Kontakt oss CTA and no old pitch", () => {
  assert.match(landing, /cta: "Kontakt oss"/);
  assert.match(landing, /cta: "Contact us"/);
  assert.equal(landing.includes("Bestill"), false);
  assert.equal(landing.includes("Bli pilot"), false);
  assert.equal(landing.includes("prøvesmaking"), false);
  assert.equal(landing.includes("ventilasjon"), false);
  assert.equal(landing.includes("ingen kokk"), false);
  assert.equal(landing.includes("streetfood-konsept"), false);
  assert.equal(landing.includes("vimeo"), false);
  assert.equal(landing.includes("Vimeo"), false);
  assert.match(landing, /Oslo Bar & Bowling/);
  assert.match(landing, /\/steder\/oslo-bar-bowling/);
});
