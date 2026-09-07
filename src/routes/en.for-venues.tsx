import { createFileRoute } from "@tanstack/react-router";
import { ForVenuesLanding } from "@/components/for-venues-landing";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/for-venues")({
  head: () => buildPageHead(PAGE_SEO["/en/for-venues"]),
  component: ForVenuesEn,
});

function ForVenuesEn() {
  return <ForVenuesLanding lang="en" />;
}
