import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  ORGANIZATION_JSON_LD,
  PAGE_SEO,
  buildPageHead,
  htmlLangFromPath,
  venuePageSeo,
  venueSeoCopy,
} from "./seo.ts";
import { indexNowKeyLocation, indexNowPayload, indexNowUrlsForSlug } from "./indexnow.ts";
import { parseSeoNotifyBody, urlsForSeoNotify } from "./seo-notify.ts";
import { renderSitemapXml, sitemapEntries } from "./sitemap.ts";

test("homepage metadata names the brand, the product and Oslo", () => {
  assert.equal(PAGE_SEO["/"].title, "Gold of Sicily | Sicilianske arancini i Oslo");
  assert.match(PAGE_SEO["/"].description, /arancini/i);
  assert.match(PAGE_SEO["/"].description, /Oslo/);
  assert.match(PAGE_SEO["/"].description, /Norge/);
});

test("each public page type has its own search intent", () => {
  assert.equal(
    PAGE_SEO["/for-barer"].title,
    "Arancini til barer og serveringssteder | Gold of Sicily",
  );
  assert.match(PAGE_SEO["/for-barer"].description, /barer/);
  assert.equal(PAGE_SEO["/finn-oss"].title, "Hvor får du arancini i Oslo? | Gold of Sicily");
  assert.match(PAGE_SEO["/what-is-arancini"].title, /Hva er arancini/);
  assert.equal(PAGE_SEO["/en"].noindex, true);
  assert.equal(PAGE_SEO["/en/find-us"].noindex, true);
  assert.equal("noindex" in PAGE_SEO["/en/for-bars"], false);
});

test("root head no longer ships homepage canonical on every page", () => {
  const root = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
  assert.equal(root.includes("buildPageHead"), false);
  assert.match(root, /ORGANIZATION_JSON_LD/);
  assert.match(root, /htmlLangFromPath/);
  assert.match(root, /googleSiteVerificationMeta/);
});

test("html lang follows the URL", () => {
  assert.equal(htmlLangFromPath("/"), "nb");
  assert.equal(htmlLangFromPath("/finn-oss"), "nb");
  assert.equal(htmlLangFromPath("/en"), "en");
  assert.equal(htmlLangFromPath("/en/for-bars"), "en");
});

test("organization schema is a brand, not a restaurant", () => {
  assert.deepEqual(ORGANIZATION_JSON_LD["@type"], ["Organization", "Brand"]);
  assert.equal(ORGANIZATION_JSON_LD.name, "Gold of Sicily");
  assert.equal(ORGANIZATION_JSON_LD.telephone, "+4745251280");
});

test("venue pages get local titles, canonicals and structured data", () => {
  const seo = venuePageSeo(
    {
      slug: "oslo-bar-bowling",
      name: "Oslo Bar & Bowling",
      city: "Oslo",
      address: "Aker Brygge",
      latitude: 59.91,
      longitude: 10.72,
      imageUrl: "https://example.com/obb.jpg",
      logoUrl: null,
      websiteUrl: "https://oslobar.no",
      instagram: null,
      servingMethod: null,
      menuIntro: null,
      hasMenu: true,
      menu: [{ productSlug: "nduja", name: "'Nduja", description: null, priceNok: null, priceLabel: null, available: true, imageUrl: null }],
      profile: "partner",
    },
    "no",
  );
  assert.equal(seo.title, "Arancini hos Oslo Bar & Bowling | Gold of Sicily");
  assert.equal(
    seo.description,
    "Finn Gold of Sicily-arancini hos Oslo Bar & Bowling i Oslo. Se smaker, meny og informasjon om serveringsstedet.",
  );
  assert.equal(seo.heading, "Gold of Sicily hos Oslo Bar & Bowling");
  assert.equal(seo.path, "/steder/oslo-bar-bowling");
  assert.equal(seo.ogImage, "https://example.com/obb.jpg");
  assert.equal(seo.ogImageAlt, "Gold of Sicily hos Oslo Bar & Bowling i Oslo");
  assert.equal(seo.noindex, undefined);
  const jsonLd = seo.jsonLd as {
    "@type": string;
    brand: { name: string };
    address: { addressLocality: string };
  };
  assert.equal(jsonLd["@type"], "FoodEstablishment");
  assert.equal(jsonLd.brand.name, "Gold of Sicily");
  assert.equal(jsonLd.address.addressLocality, "Oslo");

  const en = venuePageSeo(
    {
      slug: "oslo-bar-bowling",
      name: "Oslo Bar & Bowling",
      city: "Oslo",
      address: null,
      latitude: null,
      longitude: null,
      imageUrl: null,
      logoUrl: null,
      websiteUrl: null,
      instagram: null,
      servingMethod: null,
      menuIntro: null,
      hasMenu: false,
      menu: [],
    },
    "en",
  );
  assert.equal(en.noindex, true);
  assert.equal(en.path, "/en/venues/oslo-bar-bowling");
});

test("venue SEO copy is generated from portal name and city", () => {
  const copy = venueSeoCopy(
    {
      slug: "oslo-bar-bowling",
      name: "Oslo Bar & Bowling",
      city: "Oslo",
      address: "Aker Brygge",
      latitude: null,
      longitude: null,
      imageUrl: null,
      logoUrl: null,
      websiteUrl: null,
      instagram: null,
      servingMethod: null,
      menuIntro: null,
      hasMenu: false,
      menu: [],
    },
    "no",
  );
  assert.equal(copy.title, "Arancini hos Oslo Bar & Bowling | Gold of Sicily");
  assert.equal(copy.heading, "Gold of Sicily hos Oslo Bar & Bowling");
});

test("page head is scoped to the route path", () => {
  const head = buildPageHead(PAGE_SEO["/for-barer"]);
  const canonical = head.links.find((link) => link.rel === "canonical");
  const ogUrl = head.meta.find((item) => item.property === "og:url");
  assert.equal(canonical?.href, "https://goldofsicily.no/for-barer");
  assert.equal(ogUrl?.content, "https://goldofsicily.no/for-barer");
  assert.ok(head.links.some((link) => link.rel === "alternate" && link.hrefLang === "en"));
});

test("sitemap includes venue URLs and the indexed English B2B page", () => {
  const xml = renderSitemapXml(sitemapEntries(["oslo-bar-bowling", "villa-grossista", "oslo-bar-bowling"]));
  assert.match(xml, /https:\/\/goldofsicily\.no\/steder\/oslo-bar-bowling/);
  assert.match(xml, /https:\/\/goldofsicily\.no\/steder\/villa-grossista/);
  assert.match(xml, /https:\/\/goldofsicily\.no\/en\/for-bars/);
  assert.match(xml, /https:\/\/goldofsicily\.no\/finn-oss/);
  assert.equal((xml.match(/oslo-bar-bowling/g) ?? []).length, 1);
});

test("venue page head uses the venue photo as Open Graph image", () => {
  const seo = venuePageSeo(
    {
      slug: "oslo-bar-bowling",
      name: "Oslo Bar & Bowling",
      city: "Oslo",
      address: null,
      latitude: null,
      longitude: null,
      imageUrl: "https://example.com/obb.jpg",
      logoUrl: null,
      websiteUrl: null,
      instagram: null,
      servingMethod: null,
      menuIntro: null,
      hasMenu: false,
      menu: [],
    },
    "no",
  );
  const head = buildPageHead(seo);
  const ogImage = head.meta.find((item) => item.property === "og:image");
  const twitterImage = head.meta.find((item) => item.name === "twitter:image");
  const canonical = head.links.find((link) => link.rel === "canonical");
  assert.equal(ogImage?.content, "https://example.com/obb.jpg");
  assert.equal(twitterImage?.content, "https://example.com/obb.jpg");
  assert.equal(canonical?.href, "https://goldofsicily.no/steder/oslo-bar-bowling");
});

test("IndexNow notifies the Norwegian venue URL, find page and sitemap", () => {
  const urls = indexNowUrlsForSlug("oslo-bar-bowling");
  assert.deepEqual(urls, [
    "https://goldofsicily.no/steder/oslo-bar-bowling",
    "https://goldofsicily.no/finn-oss",
    "https://goldofsicily.no/sitemap.xml",
  ]);
  const payload = indexNowPayload(urls);
  assert.equal(payload.host, "goldofsicily.no");
  assert.equal(payload.keyLocation, indexNowKeyLocation());
  assert.equal(payload.urlList.length, 3);
});

test("SEO notify payload expands venue slugs without indexing English venue URLs", () => {
  const parsed = parseSeoNotifyBody({
    slugs: ["oslo-bar-bowling"],
    previousSlugs: ["gammel-slug"],
    published: false,
  });
  assert.equal(parsed.published, false);
  const urls = urlsForSeoNotify(parsed);
  assert.ok(urls.includes("https://goldofsicily.no/steder/oslo-bar-bowling"));
  assert.ok(urls.includes("https://goldofsicily.no/steder/gammel-slug"));
  assert.equal(urls.some((url) => url.includes("/en/venues/")), false);
});

test("venue pages render the generated H1, not only the venue name", () => {
  const detail = readFileSync(new URL("../components/venue-detail.tsx", import.meta.url), "utf8");
  assert.match(detail, /venueSeoCopy/);
  assert.match(detail, /seo\.heading/);
  assert.match(detail, /seo\.imageAlt/);
});

test("IndexNow key file and notify API are wired in the public site", () => {
  const keyFile = readFileSync(
    new URL("../routes/a3f8c91e7b4d2f60goldofsicily[.]txt.ts", import.meta.url),
    "utf8",
  );
  const notify = readFileSync(new URL("../routes/api/seo.notify.ts", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("../routes/sitemap[.]xml.ts", import.meta.url), "utf8");
  assert.match(indexNowKeyLocation(), /a3f8c91e7b4d2f60goldofsicily\.txt$/);
  assert.match(keyFile, /INDEXNOW_KEY/);
  assert.match(notify, /isSeoNotifyAuthorized/);
  assert.match(notify, /submitIndexNow/);
  assert.match(sitemap, /max-age=300/);
});
