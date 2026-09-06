import { canonicalUrl, SITE_URL } from "./seo";

/**
 * Bing/Yandex-style IndexNow. Google does not treat this as a generic
 * replacement for Search Console or the limited Google Indexing API.
 */
export const INDEXNOW_KEY = "a3f8c91e7b4d2f60goldofsicily";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export function indexNowHost() {
  return new URL(SITE_URL).host;
}

export function indexNowKeyLocation() {
  return `${SITE_URL}/${INDEXNOW_KEY}.txt`;
}

export function uniqueUrls(urls: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    const clean = url.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
  }
  return out;
}

export function indexNowUrlsForSlug(slug: string) {
  const clean = slug.trim();
  if (!clean) return [];
  return [
    canonicalUrl(`/steder/${clean}`),
    canonicalUrl("/finn-oss"),
    canonicalUrl("/sitemap.xml"),
  ];
}

export function indexNowPayload(urls: string[]) {
  return {
    host: indexNowHost(),
    key: INDEXNOW_KEY,
    keyLocation: indexNowKeyLocation(),
    urlList: uniqueUrls(urls).slice(0, 10_000),
  };
}

export async function submitIndexNow(urls: string[]) {
  const payload = indexNowPayload(urls);
  if (payload.urlList.length === 0) {
    return { ok: true, skipped: true as const, status: 204 };
  }
  if (typeof process !== "undefined" && process.env.INDEXNOW_DISABLED === "1") {
    return { ok: true, skipped: true as const, status: 204 };
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return {
    ok: response.ok || response.status === 202,
    skipped: false as const,
    status: response.status,
  };
}
