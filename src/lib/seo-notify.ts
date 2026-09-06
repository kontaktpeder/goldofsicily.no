import { indexNowUrlsForSlug, uniqueUrls } from "./indexnow";

/** Shared with portal.goldofsicily.no. Override with SEO_NOTIFY_SECRET in production. */
export const SEO_NOTIFY_FALLBACK_SECRET = "gos-idx-7f3c2e91b4a06d58";

export function seoNotifySecret() {
  const fromEnv =
    (typeof process !== "undefined" && process.env.SEO_NOTIFY_SECRET) || "";
  return fromEnv.trim() || SEO_NOTIFY_FALLBACK_SECRET;
}

export function isSeoNotifyAuthorized(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const secret = seoNotifySecret();
  return Boolean(token) && token === secret;
}

export type SeoNotifyRequest = {
  slugs: string[];
  previousSlugs: string[];
  published: boolean;
};

function asSlugs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseSeoNotifyBody(body: unknown): SeoNotifyRequest {
  const data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return {
    slugs: asSlugs(data.slugs),
    previousSlugs: asSlugs(data.previousSlugs),
    published: data.published !== false,
  };
}

export function urlsForSeoNotify(request: SeoNotifyRequest) {
  const slugs = uniqueUrls([...request.slugs, ...request.previousSlugs]);
  const urls: string[] = [];
  for (const slug of slugs) {
    urls.push(...indexNowUrlsForSlug(slug));
  }
  return uniqueUrls(urls);
}
