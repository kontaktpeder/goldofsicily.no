import { createFileRoute, notFound } from "@tanstack/react-router";
import { VenuePage } from "@/components/venue-page";
import { loadVenueForPage } from "@/lib/portal-venues";
import { buildPageHead, venuePageSeo } from "@/lib/seo";

export const Route = createFileRoute("/en/venues/$slug")({
  loader: async ({ params }) => {
    const result = await loadVenueForPage(params.slug, "en");
    if (result.status === "missing") throw notFound();
    return {
      slug: params.slug,
      venue: result.status === "found" ? result.venue : null,
    };
  },
  head: ({ loaderData }) => buildPageHead(venuePageSeo(loaderData?.venue, "en")),
  component: VenuePageEn,
});

function VenuePageEn() {
  const { slug, venue } = Route.useLoaderData();
  return <VenuePage lang="en" slug={slug} initial={venue} />;
}
