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

test("venue landing keeps the short page and drops leftover pitch", () => {
  assert.equal(landing.includes("Kontakt oss"), false);
  assert.equal(landing.includes("Contact us"), false);
  assert.equal(landing.includes("Bestill"), false);
  assert.equal(landing.includes("Bli pilot"), false);
  assert.equal(landing.includes("prøvesmaking"), false);
  assert.equal(landing.includes("ventilasjon"), false);
  assert.equal(landing.includes("ingen kokk"), false);
  assert.equal(landing.includes("streetfood-konsept"), false);
  assert.equal(landing.includes("vimeo"), false);
  assert.equal(landing.includes("Vimeo"), false);
  assert.equal(landing.includes("Airfryer"), false);
  assert.equal(landing.includes("Villa Import"), false);
  assert.equal(landing.includes("Kontakt Peder"), false);
  assert.match(landing, /Oslo Bar & Bowling/);
  assert.match(landing, /\/steder\/oslo-bar-bowling/);
});

test("venue landing uses Partner vs Supply, concrete CTAs and a two-line H1", () => {
  assert.match(landing, /'Nduja mozzarella/);
  assert.match(landing, /Trøffel & sjampinjong/);
  assert.match(landing, /Gold Partner eller Gold Supply/);
  assert.match(landing, /Hjelp med oppstart/);
  assert.match(landing, /Gold Supply/);
  assert.match(landing, /Ring 45 25 12 80/);
  assert.match(landing, /Send e-post/);
  assert.match(landing, /tel:45251280/);
  assert.match(landing, /mailto:\$\{SITE\.email\}/);
  assert.match(landing, /Vil du teste Gold hos dere\?/);
  assert.match(landing, /heroTitleLine1: "Siciliansk arancini"/);
  assert.match(landing, /heroTitleLine2: "for serveringssteder\."/);
  assert.match(landing, /md:whitespace-nowrap/);
});
