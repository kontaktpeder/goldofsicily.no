import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { VenueDetail } from "@/components/venue-detail";
import type { BrandLang } from "@/lib/brand-copy";
import type { PublicVenue } from "@/lib/portal-venues";
import { useHydratedVenue } from "@/lib/use-public-venues";

export function VenuePage({
  lang,
  slug,
  initial,
}: {
  lang: BrandLang;
  slug: string;
  initial: PublicVenue | null;
}) {
  const query = useHydratedVenue(lang, slug, initial);
  const venue = query.data ?? initial;

  if (venue) {
    return <VenueDetail lang={lang} venue={venue} />;
  }

  const findPath = lang === "en" ? "/en/find-us" : "/finn-oss";
  const loading = query.isPending || query.isFetching;
  const copy = lang === "en"
    ? {
        loading: "Loading venue…",
        heading: "Venue not found",
        body: "This place is not on the public list, or the page could not be loaded.",
        back: "Where Gold is served",
      }
    : {
        loading: "Laster sted…",
        heading: "Fant ikke stedet",
        body: "Dette stedet ligger ikke ute offentlig, eller siden kunne ikke lastes.",
        back: "Hvor serveres Gold?",
      };

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display">
      <BrandNav lang={lang} />
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        {loading ? (
          <p className="text-lg italic text-foreground/70">{copy.loading}</p>
        ) : (
          <>
            <h1 className="font-display text-4xl tracking-tight">{copy.heading}</h1>
            <p className="mt-4 text-foreground/65">{copy.body}</p>
            <Link to={findPath} className="mt-8 inline-block italic underline-offset-4 hover:underline">
              ← {copy.back}
            </Link>
          </>
        )}
      </main>
      <BrandFooter lang={lang} />
    </div>
  );
}
