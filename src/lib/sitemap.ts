import { canonicalUrl } from "./seo";

export type SitemapEntry = {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
};

export const SITEMAP_STATIC: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/arancini", changefreq: "monthly", priority: "0.9" },
  { path: "/finn-oss", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/for-serveringssteder", changefreq: "weekly", priority: "0.8" },
  { path: "/samarbeid", changefreq: "monthly", priority: "0.5" },
  { path: "/next-popup", changefreq: "weekly", priority: "0.4" },
  { path: "/en/for-venues", changefreq: "weekly", priority: "0.6" },
];

export function sitemapEntries(venueSlugs: string[]): SitemapEntry[] {
  const seen = new Set<string>();
  const venues: SitemapEntry[] = [];
  for (const slug of venueSlugs) {
    const clean = slug.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    venues.push({ path: `/steder/${clean}`, changefreq: "weekly", priority: "0.7" });
  }
  return [...SITEMAP_STATIC, ...venues];
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

export function renderSitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const fields = [`    <loc>${escapeXml(canonicalUrl(entry.path))}</loc>`];
      if (entry.changefreq) fields.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority) fields.push(`    <priority>${entry.priority}</priority>`);
      return `  <url>\n${fields.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
