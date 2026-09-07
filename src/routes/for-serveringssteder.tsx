import { createFileRoute } from "@tanstack/react-router";
import { ForVenuesLanding } from "@/components/for-venues-landing";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/for-serveringssteder")({
  head: () => buildPageHead(PAGE_SEO["/for-serveringssteder"]),
  component: () => <ForVenuesLanding lang="no" />,
});
