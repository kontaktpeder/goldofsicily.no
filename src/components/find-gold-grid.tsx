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
  const venueLink =
    lang === "en" ? (
      <Link to="/en/venues/$slug" params={{ slug: venue.slug }} className="block">
        <VenueCardBody lang={lang} venue={venue} />
      </Link>
    ) : (
      <Link to="/steder/$slug" params={{ slug: venue.slug }} className="block">
        <VenueCardBody lang={lang} venue={venue} />
      </Link>
    );

  return (
    <article className="group h-full border border-foreground/15 bg-[color:var(--paper)] transition hover:border-foreground/40">
      {venueLink}
    </article>
  );
}

function VenueCardBody({ lang, venue }: { lang: BrandLang; venue: PublicVenue }) {
  const onPhoto = Boolean(venue.imageUrl);

  return (
    <div className="relative min-h-[21rem] overflow-hidden">
      {venue.imageUrl ? (
        <img src={venue.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[color:var(--cream)]" />
      )}
      {venue.logoUrl ? (
        <img
          src={venue.logoUrl}
          alt=""
          className="absolute top-3 left-3 z-10 h-12 w-auto max-w-[7.5rem] object-contain bg-[color:var(--paper)]/92 p-1.5"
        />
      ) : null}
      <div
        className={
          onPhoto
            ? "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[color:var(--espresso)]/85 via-[color:var(--espresso)]/40 to-transparent px-6 pb-5 pt-16 text-[#F3EBDD]"
            : "absolute inset-x-0 bottom-0 z-10 px-6 pb-5 pt-8"
        }
      >
        <p className="font-display text-2xl tracking-tight">{venue.name}</p>
        {isGoldPartner(venue) ? (
          <p
            className={`mt-2 text-[0.7rem] tracking-[0.18em] uppercase ${onPhoto ? "text-[#F3EBDD]/70" : "text-foreground/55"}`}
          >
            Gold Partner
          </p>
        ) : null}
        <p className={`mt-1 text-lg italic ${onPhoto ? "text-[#F3EBDD]/75" : "text-foreground/60"}`}>
          {venue.city ?? ""}
        </p>
        {venue.menu.length > 0 ? (
          <p className={`mt-3 text-sm ${onPhoto ? "text-[#F3EBDD]/70" : "text-foreground/70"}`}>
            {venue.menu
              .slice(0, 3)
              .map((item) => item.name)
              .join(" · ")}
          </p>
        ) : null}
        <p
          className={`mt-4 text-sm italic underline-offset-4 group-hover:underline ${onPhoto ? "text-[#F3EBDD]/85" : ""}`}
        >
          {lang === "en" ? "See venue" : "Se sted"} →
        </p>
      </div>
    </div>
  );
}
