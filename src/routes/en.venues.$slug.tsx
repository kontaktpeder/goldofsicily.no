import { createFileRoute, notFound } from "@tanstack/react-router";
import { VenuePage } from "@/components/venue-page";
import { loadVenueForPage } from "@/lib/portal-venues";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/venues/$slug")({
  loader: async ({ params }) => {
    const result = await loadVenueForPage(params.slug, "en");
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
        ? `Gold of Sicily is served at ${loaderData.venue.name}${loaderData.venue.city ? ` in ${loaderData.venue.city}` : ""}.`
        : "Gold of Sicily is served at selected venues.",
      path: loaderData?.venue ? `/en/venues/${loaderData.venue.slug}` : "/en/find-us",
      locale: "en_GB",
    }),
  component: VenuePageEn,
});

function VenuePageEn() {
  const { slug, venue } = Route.useLoaderData();
  return <VenuePage lang="en" slug={slug} initial={venue} />;
}
