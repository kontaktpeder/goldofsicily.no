import { createFileRoute } from "@tanstack/react-router";
import { AranciniGuide } from "@/components/arancini-guide";
import { ARANCINI_RECIPE_JSON_LD } from "@/lib/arancini-page";
import { fetchPublicVenues } from "@/lib/portal-venues";
import { useHydratedVenues } from "@/lib/use-public-venues";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/arancini")({
  head: () => {
    const base = buildPageHead(PAGE_SEO["/arancini"]);
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(ARANCINI_RECIPE_JSON_LD),
        },
      ],
    };
  },
  loader: async () => {
    try {
      return await fetchPublicVenues("no");
    } catch {
      return [];
    }
  },
  component: AranciniRoutePage,
});

function AranciniRoutePage() {
  const venues = useHydratedVenues("no", Route.useLoaderData());
  return <AranciniGuide venues={venues} />;
}
