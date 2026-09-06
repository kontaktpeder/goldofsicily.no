import { SITE } from "./site";

export const SITE_URL = SITE.domain;

export const DEFAULT_TITLE = "Gold of Sicily — italiensk enkelhet. norsk utførelse.";

export const DEFAULT_DESCRIPTION =
  "Sicilianske arancini. Klare for ditt serveringssted. Italiensk enkelhet, norsk utførelse.";

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const THEME_COLOR = "#F3EBDD";

export type PageLocale = "nb_NO" | "en_GB";

export type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
  ogType?: "website" | "article";
  image?: string;
  noindex?: boolean;
  locale?: PageLocale;
};

export function canonicalUrl(path = "/") {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageHead(seo: PageSeo = {}) {
  const title = seo.title ?? DEFAULT_TITLE;
  const description = seo.description ?? DEFAULT_DESCRIPTION;
  const url = canonicalUrl(seo.path ?? "/");
  const ogType = seo.ogType ?? "website";
  const locale = seo.locale ?? "nb_NO";
  const image = seo.image ?? OG_IMAGE;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: THEME_COLOR },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:locale", content: locale },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  if (seo.noindex) {
    meta.push({ name: "robots", content: "noindex, follow" });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: SITE.name,
  url: SITE_URL,
  image: OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  servesCuisine: ["Sicilian", "Italian street food"],
  areaServed: { "@type": "City", name: "Oslo" },
  sameAs: [SITE.instagram, SITE.tiktok],
};

export const PAGE_SEO = {
  "/": {
    title: "Gold of Sicily — italiensk enkelhet. norsk utførelse.",
    description:
      "Sicilianske arancini. Klare for ditt serveringssted. Italiensk enkelhet, norsk utførelse.",
    path: "/",
  } satisfies PageSeo,
  "/next-popup": {
    title: "Neste arancini-popup i Oslo kommer snart — Gold of Sicily",
    description:
      "Meld deg på listen for neste Gold of Sicily-popup i Oslo. Små batcher med sicilianske arancini, begrenset antall og først beskjed til listen.",
    path: "/next-popup",
  },
  "/arancini": {
    title: "Hva er arancini? Oppskrift på sicilianske risboller | Gold of Sicily",
    description:
      "Hva er arancini, og hvordan lager du dem hjemme? Se vår enkle arancini-oppskrift med ’nduja og mozzarella, og finn ut hvor Gold of Sicily serveres.",
    path: "/arancini",
    ogType: "article",
    image: `${SITE_URL}/arancini.jpg`,
  },
  "/about": {
    title: "Om Gold of Sicily — italiensk enkelhet. norsk utførelse.",
    description:
      "Vi tar en italiensk måte å tenke mat og servering på og gir den en norsk utførelse.",
    path: "/about",
  },
  "/finn-oss": {
    title: "Hvor serveres Gold of Sicily?",
    description:
      "Finn barer, restauranter, hoteller og andre steder som serverer Gold of Sicily. Kart og oversikt over alle offentlige serveringssteder.",
    path: "/finn-oss",
  },
  "/samarbeid": {
    title: "Arancini til ditt event — samarbeid med Gold of Sicily",
    description:
      "Bryllup, firmafest, festival eller popup-samarbeid i Oslo? Ta kontakt med Gold of Sicily for sicilianske arancini til ditt arrangement.",
    path: "/samarbeid",
  },
  "/for-barer": {
    title: "For serveringssteder — Gold of Sicily på menyen",
    description:
      "Et ferdig siciliansk streetfood-konsept for barer, hoteller og serveringssteder. Produkt, tilberedning, menyer og serveringsmateriell.",
    path: "/for-barer",
  },
  "/en/for-bars": {
    title: "For venues — Put Gold of Sicily on your menu.",
    description:
      "A complete Sicilian street food concept for bars, hotels and venues. Product, prep, menus and serve materials.",
    path: "/en/for-bars",
    locale: "en_GB",
  },
  "/en/collaborate": {
    title: "Arancini for your event — collaborate with Gold of Sicily",
    description:
      "Weddings, company events, festivals or popup partnerships in Oslo. Get in touch with Gold of Sicily about Sicilian arancini for your event.",
    path: "/en/collaborate",
    noindex: true,
    locale: "en_GB",
  },
  "/en": {
    title: "Gold of Sicily — italian simplicity. norwegian craft.",
    description: "Sicilian arancini. Ready for your venue. Italian simplicity, Norwegian craft.",
    path: "/en",
    noindex: true,
    locale: "en_GB",
  },
  "/en/next-popup": {
    title: "Next batch coming soon — Gold of Sicily",
    description:
      "Join the list for the next Gold of Sicily popup in Oslo. Small batches of Sicilian arancini, limited quantity and the list hears first.",
    path: "/en/next-popup",
    noindex: true,
    locale: "en_GB",
  },
  "/en/about": {
    title: "About Gold of Sicily — italian simplicity. norwegian craft.",
    description:
      "We take an Italian way of thinking about food and service and give it a Norwegian execution.",
    path: "/en/about",
    noindex: true,
    locale: "en_GB",
  },
  "/en/find-us": {
    title: "Where is Gold of Sicily served?",
    description:
      "Find bars, restaurants, hotels and other places that serve Gold of Sicily. Map and directory of public venues.",
    path: "/en/find-us",
    noindex: true,
    locale: "en_GB",
  },
} as const satisfies Record<string, PageSeo>;
