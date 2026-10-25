import { createFileRoute } from "@tanstack/react-router";
import { ShopOffer } from "@/components/shop-offer";

export const Route = createFileRoute("/kjop/tilbud")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  head: () => ({
    meta: [{ title: "Tilbud | Gold of Sicily" }, { name: "robots", content: "noindex" }],
  }),
  component: OfferPage,
});

function OfferPage() {
  const { token } = Route.useSearch();
  return <ShopOffer token={token} />;
}
