import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop-page";
import { loadShopPage } from "@/lib/shop";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/kjop")({
  head: () => buildPageHead(PAGE_SEO["/kjop"]),
  loader: () => loadShopPage(),
  component: KjopPage,
});

function KjopPage() {
  const shop = Route.useLoaderData();
  return <ShopPage lang="no" shop={shop} />;
}
