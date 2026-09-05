import { Link } from "@tanstack/react-router";
import { isGoldPartner, mapsUrl, osmEmbedUrl, type PublicVenue } from "@/lib/portal-venues";

export function VenuesMap({
  venues,
  title,
  lang = "no",
}: {
  venues: PublicVenue[];
  title: string;
  lang?: "no" | "en";
}) {
  const src = osmEmbedUrl(venues);
  if (!src) return null;
  const listed = venues.filter(
    (venue) => venue.latitude != null || venue.address || venue.city,
  );
  return (
    <div className="overflow-hidden border border-foreground/15">
      <iframe title={title} src={src} className="h-[420px] w-full" loading="lazy" />
      {venues.length > 1 ? (
        <p className="flex flex-wrap gap-x-5 gap-y-1 border-t border-foreground/10 px-4 py-3 text-xs tracking-[0.12em] text-foreground/55 uppercase">
          <span>● Gold Partner</span>
          <span>○ {lang === "en" ? "Serves Gold" : "Serverer Gold"}</span>
        </p>
      ) : null}
      <div className="flex flex-col gap-2 px-4 py-3 text-sm">
        {listed.map((venue) => (
          <div key={venue.slug} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="w-3 text-center" aria-hidden>
              {isGoldPartner(venue) ? "●" : "○"}
            </span>
            <Link
              to={lang === "en" ? "/en/venues/$slug" : "/steder/$slug"}
              params={{ slug: venue.slug }}
              className="italic underline-offset-4 hover:underline"
            >
              {venue.name}
            </Link>
            <span className="text-foreground/50">{venue.city}</span>
            {isGoldPartner(venue) ? (
              <span className="text-[0.65rem] tracking-[0.16em] text-foreground/45 uppercase">
                Gold Partner
              </span>
            ) : null}
            <a
              href={mapsUrl(venue)}
              target="_blank"
              rel="noreferrer"
              className="text-foreground/45 underline-offset-4 hover:underline"
            >
              {lang === "en" ? "Map" : "Kart"}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
