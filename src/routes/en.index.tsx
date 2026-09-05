import { createFileRoute } from "@tanstack/react-router";
import { BrandHome } from "@/components/brand-home";
import { fetchPublicVenues } from "@/lib/portal-venues";
import { useHydratedVenues } from "@/lib/use-public-venues";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  head: () => buildPageHead(PAGE_SEO["/en"]),
  loader: async () => {
    try {
      return await fetchPublicVenues("en");
    } catch {
      return [];
    }
  },
  component: IndexEn,
});

function IndexEn() {
  const venues = useHydratedVenues("en", Route.useLoaderData());
  return (
    <main>
      <BrandHome lang="en" venues={venues} />
    </main>
  );
}
