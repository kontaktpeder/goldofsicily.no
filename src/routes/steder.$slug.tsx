import { createFileRoute, notFound } from "@tanstack/react-router";
import { VenuePage } from "@/components/venue-page";
import { loadVenueForPage } from "@/lib/portal-venues";
import { buildPageHead, venuePageSeo } from "@/lib/seo";

export const Route = createFileRoute("/steder/$slug")({
  loader: async ({ params }) => {
    const result = await loadVenueForPage(params.slug, "no");
    if (result.status === "missing") throw notFound();
    return {
      slug: params.slug,
      venue: result.status === "found" ? result.venue : null,
    };
  },
  head: ({ loaderData }) => buildPageHead(venuePageSeo(loaderData?.venue, "no")),
  component: VenuePageNo,
});

function VenuePageNo() {
  const { slug, venue } = Route.useLoaderData();
  return <VenuePage lang="no" slug={slug} initial={venue} />;
}
