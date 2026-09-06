import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { VenuesMap } from "@/components/venues-map";
import { VenueMenuFile } from "@/components/venue-menu-file";
import { isGoldPartner, isPublicMenuUrl, mapsUrl, type PublicVenue } from "@/lib/portal-venues";

function visitUrl(venue: PublicVenue) {
  if (venue.websiteUrl) return venue.websiteUrl;
  return mapsUrl(venue);
}

function videoEmbedSrc(url: string) {
  const youtube = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  );
  if (youtube?.[1]) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function VenueDetail({ lang, venue }: { lang: "no" | "en"; venue: PublicVenue }) {
  const findPath = lang === "en" ? "/en/find-us" : "/finn-oss";
  const partner = isGoldPartner(venue);
  const serveLabel = lang === "en" ? "Serves" : "Serverer";
  const backLabel = lang === "en" ? "Where is Gold served?" : "Hvor serveres Gold?";
  const websiteLabel = lang === "en" ? "Website" : "Nettside";
  const mapLabel = lang === "en" ? "Map" : "Kart";
  const visitLabel = lang === "en" ? `Visit ${venue.name}` : `Besøk ${venue.name}`;
  const listingLabel = lang === "en" ? "Gold of Sicily is served here" : "Her serveres Gold of Sicily";
  const storyLabel = lang === "en" ? `Gold at ${venue.name}` : `Gold på ${venue.name}`;
  const embed = venue.videoUrl ? videoEmbedSrc(venue.videoUrl) : null;
  const hasMenuFile = isPublicMenuUrl(venue.menuMaterialUrl);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display">
      <BrandNav lang={lang} />
      <main className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <Link to={findPath} className="text-sm italic underline-offset-4 hover:underline">
          ← {backLabel}
        </Link>
        <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,4.6rem)] leading-[0.95] tracking-tight">
          {venue.name}
        </h1>
        {partner ? (
          <p className="mt-3 text-[0.7rem] tracking-[0.2em] text-foreground/55 uppercase">
            Gold Partner
          </p>
        ) : (
          <p className="mt-3 text-sm italic text-foreground/55">{listingLabel}</p>
        )}
        <p className="mt-4 text-lg italic text-foreground/60">
          {[venue.address, venue.city].filter(Boolean).join(", ")}
        </p>
        {venue.logoUrl ? (
          <img src={venue.logoUrl} alt="" className="mt-8 h-16 w-auto object-contain" />
        ) : null}
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt=""
            className="mt-10 w-full border border-foreground/15 object-cover"
          />
        ) : null}

        {partner && venue.collaborationText ? (
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-foreground/75">
            {venue.collaborationText}
          </p>
        ) : null}

        <div className="mt-10">
          <VenuesMap venues={[venue]} title={mapLabel} lang={lang} />
        </div>

        {venue.menuIntro && !partner ? (
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-foreground/75">
            {venue.menuIntro}
          </p>
        ) : null}

        <h2 className="mt-12 font-display text-3xl tracking-tight">{serveLabel}</h2>
        {venue.menu.length > 0 ? (
          <ul className="mt-6 divide-y divide-foreground/15 border-y border-foreground/15">
            {venue.menu.map((item) => (
              <li key={item.productSlug} className="flex items-baseline justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-xl">{item.name}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm text-foreground/60">{item.description}</p>
                  ) : null}
                </div>
                {item.priceLabel ? <p className="tabular-nums">{item.priceLabel}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
        {hasMenuFile ? (
          <div className="mt-6">
            <VenueMenuFile lang={lang} url={venue.menuMaterialUrl} venueName={venue.name} />
          </div>
        ) : null}
        {venue.menu.length === 0 && !hasMenuFile ? (
          <p className="mt-4 text-foreground/70">
            {lang === "en" ? "Menu coming soon." : "Meny kommer."}
          </p>
        ) : null}

        {venue.servingMethod ? (
          <p className="mt-6 text-sm text-foreground/65">
            {lang === "en" ? "Served as" : "Serveres som"} {venue.servingMethod}.
          </p>
        ) : null}

        {partner && venue.servingStory ? (
          <section className="mt-14">
            <p className="text-[0.7rem] tracking-[0.18em] text-foreground/50 uppercase">
              {lang === "en" ? "How they serve Gold" : "Slik serverer de Gold"}
            </p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">{storyLabel}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground/75">
              {venue.servingStory}
            </p>
          </section>
        ) : null}

        {partner && embed ? (
          <div className="mt-10 overflow-hidden border border-foreground/15">
            <iframe
              title={venue.name}
              src={embed}
              className="aspect-video w-full"
              allow="autoplay; fullscreen"
            />
          </div>
        ) : partner && venue.videoUrl ? (
          <a
            href={venue.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block italic underline-offset-4 hover:underline"
          >
            Video →
          </a>
        ) : null}

        {partner && (venue.galleryUrls?.length ?? 0) > 0 ? (
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {venue.galleryUrls!.slice(0, 6).map((url) => (
              <img
                key={url}
                src={url}
                alt=""
                className="h-56 w-full border border-foreground/15 object-cover"
              />
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <a
            href={visitUrl(venue)}
            target="_blank"
            rel="noreferrer"
            className="italic underline-offset-4 hover:underline"
          >
            {visitLabel} →
          </a>
          {venue.websiteUrl ? (
            <a
              href={venue.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="italic underline-offset-4 hover:underline"
            >
              {websiteLabel}
            </a>
          ) : null}
          {venue.instagram ? (
            <a
              href={
                venue.instagram.startsWith("http")
                  ? venue.instagram
                  : `https://www.instagram.com/${venue.instagram.replace(/^@/, "")}/`
              }
              target="_blank"
              rel="noreferrer"
              className="italic underline-offset-4 hover:underline"
            >
              Instagram
            </a>
          ) : null}
          <a
            href={mapsUrl(venue)}
            target="_blank"
            rel="noreferrer"
            className="italic underline-offset-4 hover:underline"
          >
            {mapLabel}
          </a>
        </div>
      </main>
      <BrandFooter lang={lang} />
    </div>
  );
}
