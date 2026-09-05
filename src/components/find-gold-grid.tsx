import { Link } from "@tanstack/react-router";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { groupVenuesByCity, isGoldPartner, type PublicVenue } from "@/lib/portal-venues";

export function FindGoldGrid({
  lang,
  compact = false,
  venues,
}: {
  lang: BrandLang;
  compact?: boolean;
  venues: PublicVenue[];
}) {
  const t = BRAND[lang];
  const fallbackCity = lang === "en" ? "Other places" : "Andre steder";
  const groups = groupVenuesByCity(venues, fallbackCity);
  const shownGroups = compact
    ? [{ city: "", venues: venues.slice(0, 5) }]
    : groups;

  if (venues.length === 0) {
    return (
      <p className="max-w-xl text-lg leading-relaxed text-foreground/70">
        {lang === "en"
          ? "Serving locations will appear here as they go live."
          : "Serveringssteder vises her når de er merket offentlige i portalen."}
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {!compact ? (
        <h2 className="font-display text-3xl tracking-tight">
          {lang === "en" ? "Find us here" : "Her finner du oss"}
        </h2>
      ) : null}
      {shownGroups.map((group) => (
        <section key={group.city || "compact"}>
          {group.city ? (
            <h3 className="mb-4 font-display text-2xl tracking-tight">{group.city}</h3>
          ) : null}
          <ul
            className={`grid gap-3 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}
          >
            {group.venues.map((venue) => (
              <li key={venue.slug}>
                <VenueCard lang={lang} venue={venue} />
              </li>
            ))}
            {compact ? (
              <li className="flex items-end border border-dashed border-foreground/20 px-6 py-7">
                <Link to={t.paths.find} className="text-lg italic underline-offset-4 hover:underline">
                  {t.find.more} →
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      ))}
    </div>
  );
}

function VenueCard({ lang, venue }: { lang: BrandLang; venue: PublicVenue }) {
  const body = (
    <>
      {venue.imageUrl ? (
        <img src={venue.imageUrl} alt="" className="h-40 w-full object-cover" />
      ) : null}
      <div className="px-6 py-7">
        <p className="font-display text-2xl tracking-tight">{venue.name}</p>
        {isGoldPartner(venue) ? (
          <p className="mt-2 text-[0.7rem] tracking-[0.18em] text-foreground/55 uppercase">
            Gold Partner
          </p>
        ) : null}
        <p className="mt-2 text-lg italic text-foreground/60">{venue.city ?? ""}</p>
        {venue.menu.length > 0 ? (
          <p className="mt-4 text-sm text-foreground/70">
            {venue.menu
              .slice(0, 3)
              .map((item) => item.name)
              .join(" · ")}
          </p>
        ) : null}
        <p className="mt-5 text-sm italic underline-offset-4 group-hover:underline">
          {lang === "en" ? "See venue" : "Se sted"} →
        </p>
      </div>
    </>
  );

  const className =
    "group block h-full border border-foreground/15 bg-[color:var(--paper)] transition hover:border-foreground/40";

  if (lang === "en") {
    return (
      <Link to="/en/venues/$slug" params={{ slug: venue.slug }} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <Link to="/steder/$slug" params={{ slug: venue.slug }} className={className}>
      {body}
    </Link>
  );
}
