import { createFileRoute, notFound } from "@tanstack/react-router";
import { VenuePage } from "@/components/venue-page";
import { loadVenueForPage } from "@/lib/portal-venues";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/steder/$slug")({
  loader: async ({ params }) => {
    const result = await loadVenueForPage(params.slug, "no");
    if (result.status === "missing") throw notFound();
    return {
      slug: params.slug,
      venue: result.status === "found" ? result.venue : null,
    };
  },
  head: ({ loaderData }) =>
    buildPageHead({
      title: loaderData?.venue ? `${loaderData.venue.name} — Gold of Sicily` : "Gold of Sicily",
      description: loaderData?.venue
        ? `Gold of Sicily serveres hos ${loaderData.venue.name}${loaderData.venue.city ? ` i ${loaderData.venue.city}` : ""}.`
        : "Gold of Sicily serveres på utvalgte steder.",
      path: loaderData?.venue ? `/steder/${loaderData.venue.slug}` : "/finn-oss",
    }),
  component: VenuePageNo,
});

function VenuePageNo() {
  const { slug, venue } = Route.useLoaderData();
  return <VenuePage lang="no" slug={slug} initial={venue} />;
}
