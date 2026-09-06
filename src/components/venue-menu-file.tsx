import { isMenuImageUrl, isPublicMenuUrl } from "@/lib/portal-venues";

export function VenueMenuFile({
  lang,
  url,
  venueName,
  compact = false,
}: {
  lang: "no" | "en";
  url: string | null | undefined;
  venueName: string;
  compact?: boolean;
}) {
  if (!isPublicMenuUrl(url)) return null;

  const menuLabel = lang === "en" ? "See the menu" : "Se menyen";
  const alt = lang === "en" ? `Menu at ${venueName}` : `Meny hos ${venueName}`;

  if (isMenuImageUrl(url)) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block">
        <img
          src={url}
          alt={alt}
          className={
            compact
              ? "max-h-80 w-full bg-[color:var(--cream)] object-contain px-4 pt-4"
              : "w-full border border-foreground/15 object-contain"
          }
        />
        <span
          className={
            compact
              ? "mt-3 block px-6 pb-4 text-sm italic underline-offset-4 hover:underline"
              : "mt-4 inline-block text-sm italic underline-offset-4 hover:underline"
          }
        >
          {menuLabel} ↓
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={
        compact
          ? "block px-6 py-4 text-sm italic underline-offset-4 hover:underline"
          : "inline-block border border-foreground/20 px-5 py-3 text-sm italic underline-offset-4 hover:underline"
      }
    >
      {menuLabel} ↓
    </a>
  );
}
