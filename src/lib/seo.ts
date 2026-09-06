import { SITE } from "./site";
import type { PublicVenue } from "./portal-venues";

export const SITE_URL = SITE.domain;

export const DEFAULT_TITLE = "Gold of Sicily | Sicilianske arancini i Oslo";

export const DEFAULT_DESCRIPTION =
  "Sicilianske arancini, utviklet og produsert i Norge. Finn Gold of Sicily hos utvalgte serveringssteder i Oslo, eller sett dem på menyen hos deg.";

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const OG_IMAGE_WIDTH = "1200";
export const OG_IMAGE_HEIGHT = "630";
export const OG_IMAGE_ALT = "Gold of Sicily — sicilianske arancini";
export const THEME_COLOR = "#F3EBDD";

export type PageLocale = "nb_NO" | "en_GB";

export type HrefLangAlternate = {
  hrefLang: string;
  path: string;
};

export type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  locale?: PageLocale;
  alternates?: HrefLangAlternate[];
  jsonLd?: unknown;
  ogImage?: string;
  ogImageAlt?: string;
  heading?: string;
};

export function canonicalUrl(path = "/") {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function htmlLangFromPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nb";
}

const FOR_BARS_ALTERNATES: HrefLangAlternate[] = [
  { hrefLang: "nb", path: "/for-barer" },
  { hrefLang: "en", path: "/en/for-bars" },
  { hrefLang: "x-default", path: "/for-barer" },
];

export function googleSiteVerificationMeta() {
  const content =
    (typeof process !== "undefined" && process.env.GOOGLE_SITE_VERIFICATION) || "";
  if (!content.trim()) return [];
  return [{ name: "google-site-verification", content: content.trim() }];
}

export function buildPageHead(seo: PageSeo = {}) {
  const title = seo.title ?? DEFAULT_TITLE;
  const description = seo.description ?? DEFAULT_DESCRIPTION;
  const url = canonicalUrl(seo.path ?? "/");
  const ogType = seo.ogType ?? "website";
  const locale = seo.locale ?? "nb_NO";
  const ogImage = seo.ogImage || OG_IMAGE;
  const ogImageAlt = seo.ogImageAlt || OG_IMAGE_ALT;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: THEME_COLOR },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: OG_IMAGE_WIDTH },
    { property: "og:image:height", content: OG_IMAGE_HEIGHT },
    { property: "og:image:alt", content: ogImageAlt },
    { property: "og:locale", content: locale },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];

  if (seo.noindex) {
    meta.push({ name: "robots", content: "noindex, follow" });
  }

  const links: Array<Record<string, string>> = [{ rel: "canonical", href: url }];
  for (const alternate of seo.alternates ?? []) {
    links.push({
      rel: "alternate",
      href: canonicalUrl(alternate.path),
      hrefLang: alternate.hrefLang,
    });
  }

  return {
    meta,
    links,
    scripts: seo.jsonLd
      ? [{ type: "application/ld+json", children: JSON.stringify(seo.jsonLd) }]
      : [],
  };
}

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["Organization", "Brand"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  url: SITE_URL,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  email: SITE.email,
  telephone: SITE.phoneTel,
  areaServed: [
    { "@type": "City", name: "Oslo" },
    { "@type": "Country", name: "Norway" },
  ],
  sameAs: [SITE.instagram, SITE.tiktok],
};

export function venueSeoCopy(venue: PublicVenue, lang: "no" | "en") {
  const city = venue.city?.trim() || "";
  if (lang === "en") {
    return {
      title: `Arancini at ${venue.name} | Gold of Sicily`,
      description: city
        ? `Find Gold of Sicily arancini at ${venue.name} in ${city}. See flavours, menu and venue information.`
        : `Find Gold of Sicily arancini at ${venue.name}. See flavours, menu and venue information.`,
      heading: `Gold of Sicily at ${venue.name}`,
      imageAlt: city
        ? `Gold of Sicily at ${venue.name} in ${city}`
        : `Gold of Sicily at ${venue.name}`,
    };
  }
  return {
    title: `Arancini hos ${venue.name} | Gold of Sicily`,
    description: city
      ? `Finn Gold of Sicily-arancini hos ${venue.name} i ${city}. Se smaker, meny og informasjon om serveringsstedet.`
      : `Finn Gold of Sicily-arancini hos ${venue.name}. Se smaker, meny og informasjon om serveringsstedet.`,
    heading: `Gold of Sicily hos ${venue.name}`,
    imageAlt: city
      ? `Gold of Sicily hos ${venue.name} i ${city}`
      : `Gold of Sicily hos ${venue.name}`,
  };
}

export function venueJsonLd(venue: PublicVenue, path: string) {
  const copy = venueSeoCopy(venue, path.startsWith("/en") ? "en" : "no");
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: venue.name,
    url: canonicalUrl(path),
    image: venue.imageUrl ?? OG_IMAGE,
    description: copy.description,
    servesCuisine: ["Sicilian", "Italian"],
    brand: { "@type": "Brand", "@id": `${SITE_URL}/#organization`, name: SITE.name },
  };

  if (venue.address || venue.city) {
    jsonLd.address = {
      "@type": "PostalAddress",
      ...(venue.address ? { streetAddress: venue.address } : {}),
      ...(venue.city ? { addressLocality: venue.city } : {}),
      addressCountry: "NO",
    };
  }

  if (venue.latitude != null && venue.longitude != null) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: venue.latitude,
      longitude: venue.longitude,
    };
  }

  if (venue.websiteUrl) {
    jsonLd.sameAs = [venue.websiteUrl];
  }

  if (venue.menu.length > 0) {
    jsonLd.hasMenu = {
      "@type": "Menu",
      hasMenuItem: venue.menu.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
      })),
    };
  }

  return jsonLd;
}

export function venuePageSeo(venue: PublicVenue | null | undefined, lang: "no" | "en"): PageSeo {
  if (lang === "en") {
    if (!venue) {
      return {
        title: "Gold of Sicily",
        description: "Gold of Sicily is served at selected venues.",
        path: "/en/find-us",
        locale: "en_GB",
        noindex: true,
      };
    }
    const copy = venueSeoCopy(venue, "en");
    const path = `/en/venues/${venue.slug}`;
    return {
      ...copy,
      path,
      locale: "en_GB",
      noindex: true,
      jsonLd: venueJsonLd(venue, path),
      ogImage: venue.imageUrl || undefined,
      ogImageAlt: copy.imageAlt,
    };
  }

  if (!venue) {
    return {
      title: "Gold of Sicily",
      description: "Gold of Sicily serveres på utvalgte steder.",
      path: "/finn-oss",
    };
  }

  const copy = venueSeoCopy(venue, "no");
  const path = `/steder/${venue.slug}`;
  return {
    ...copy,
    path,
    jsonLd: venueJsonLd(venue, path),
    ogImage: venue.imageUrl || undefined,
    ogImageAlt: copy.imageAlt,
  };
}

export const PAGE_SEO = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  },
  "/next-popup": {
    title: "Neste arancini-popup i Oslo kommer snart — Gold of Sicily",
    description:
      "Meld deg på listen for neste Gold of Sicily-popup i Oslo. Små batcher med sicilianske arancini, begrenset antall og først beskjed til listen.",
    path: "/next-popup",
  },
  "/what-is-arancini": {
    title: "Hva er arancini? Sicilianske risballer forklart | Gold of Sicily",
    description:
      "Hva er arancini? Lær om sicilianske risballer med sprø skorpe, varmt fyll og hvordan Gold of Sicily lager dem i Oslo.",
    path: "/what-is-arancini",
  },
  "/about": {
    title: "Om Gold of Sicily | italiensk enkelhet. norsk utførelse.",
    description:
      "Vi tar en italiensk måte å tenke mat og servering på og gir den en norsk utførelse. Sicilianske arancini, utviklet og produsert i Norge.",
    path: "/about",
  },
  "/finn-oss": {
    title: "Hvor får du arancini i Oslo? | Gold of Sicily",
    description:
      "Finn barer, restauranter og andre serveringssteder som serverer Gold of Sicily-arancini i Oslo og resten av Norge.",
    path: "/finn-oss",
  },
  "/samarbeid": {
    title: "Arancini til ditt event — samarbeid med Gold of Sicily",
    description:
      "Bryllup, firmafest, festival eller popup-samarbeid i Oslo? Ta kontakt med Gold of Sicily for sicilianske arancini til ditt arrangement.",
    path: "/samarbeid",
  },
  "/for-barer": {
    title: "Arancini til barer og serveringssteder | Gold of Sicily",
    description:
      "Håndlagde sicilianske arancini for barer, restauranter og hoteller. Enkel tilberedning, rask servering og materiell tilpasset ditt serveringssted.",
    path: "/for-barer",
    alternates: FOR_BARS_ALTERNATES,
  },
  "/en/for-bars": {
    title: "Arancini for bars and venues | Gold of Sicily",
    description:
      "Handmade Sicilian arancini for bars, restaurants and hotels. Simple prep, fast service and materials adapted to your venue.",
    path: "/en/for-bars",
    locale: "en_GB",
    alternates: FOR_BARS_ALTERNATES,
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
    title: "Gold of Sicily | Sicilian arancini in Oslo",
    description:
      "Sicilian arancini, developed and produced in Norway. Find Gold of Sicily at selected venues in Oslo, or put them on your menu.",
    path: "/en",
    noindex: true,
    locale: "en_GB",
  },
  "/en/what-is-arancini": {
    title: "What is arancini? | Gold of Sicily",
    description:
      "Sicilian rice balls with a crisp shell and filling from Palermo. How Gold of Sicily makes handmade arancini in Oslo.",
    path: "/en/what-is-arancini",
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
    title: "About Gold of Sicily | italian simplicity. norwegian craft.",
    description:
      "We take an Italian way of thinking about food and service and give it a Norwegian execution.",
    path: "/en/about",
    noindex: true,
    locale: "en_GB",
  },
  "/en/find-us": {
    title: "Where can you get arancini in Oslo? | Gold of Sicily",
    description:
      "Find bars, restaurants and other venues serving Gold of Sicily arancini in Oslo and across Norway.",
    path: "/en/find-us",
    noindex: true,
    locale: "en_GB",
  },
} as const satisfies Record<string, PageSeo>;
