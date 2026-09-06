import { createFileRoute } from "@tanstack/react-router";
import { fetchPublicVenues } from "@/lib/portal-venues";
import { renderSitemapXml, sitemapEntries } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let slugs: string[] = [];
        try {
          slugs = (await fetchPublicVenues("no")).map((venue) => venue.slug).filter(Boolean);
        } catch {
          slugs = [];
        }
        return new Response(renderSitemapXml(sitemapEntries(slugs)), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
