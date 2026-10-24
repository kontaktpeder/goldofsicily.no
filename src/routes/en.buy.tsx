import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/shop-page";
import { loadShopPage } from "@/lib/shop";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/buy")({
  head: () => buildPageHead(PAGE_SEO["/en/buy"]),
  loader: () => loadShopPage(),
  component: BuyPage,
});

function BuyPage() {
  const shop = Route.useLoaderData();
  return <ShopPage lang="en" shop={shop} />;
}
