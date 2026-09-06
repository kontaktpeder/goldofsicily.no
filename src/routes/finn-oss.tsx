import { createFileRoute } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { FindGoldGrid } from "@/components/find-gold-grid";
import { VenuesMap } from "@/components/venues-map";
import { BRAND } from "@/lib/brand-copy";
import { fetchPublicVenues } from "@/lib/portal-venues";
import { useHydratedVenues } from "@/lib/use-public-venues";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/finn-oss")({
  head: () => buildPageHead(PAGE_SEO["/finn-oss"]),
  loader: async () => {
    try {
      return await fetchPublicVenues("no");
    } catch {
      return [];
    }
  },
  component: FinnOssPage,
});

function FinnOssPage() {
  const t = BRAND.no;
  const venues = useHydratedVenues("no", Route.useLoaderData());
  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display">
      <BrandNav lang="no" />
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] tracking-tight">
          {t.find.titleBefore}
          {t.find.titleMark}
          {t.find.titleAfter}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
          {t.find.pageBody}
        </p>
        <div className="mt-14 md:-mx-4 lg:-mx-8">
          <VenuesMap
            venues={venues}
            title="Kart over Gold of Sicily-steder"
            lang="no"
          />
        </div>
        <div className="mt-10">
          <FindGoldGrid lang="no" venues={venues} />
        </div>
      </main>
      <BrandFooter lang="no" />
    </div>
  );
}
