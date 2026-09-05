import { createFileRoute } from "@tanstack/react-router";
import { BrandHome } from "@/components/brand-home";
import { fetchPublicVenues } from "@/lib/portal-venues";
import { useHydratedVenues } from "@/lib/use-public-venues";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  loader: async () => {
    try {
      return await fetchPublicVenues("no");
    } catch {
      return [];
    }
  },
  component: Index,
});

function Index() {
  const venues = useHydratedVenues("no", Route.useLoaderData());
  return (
    <main>
      <BrandHome lang="no" venues={venues} />
    </main>
  );
}
