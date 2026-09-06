import { isMenuImageUrl, isPublicMenuUrl } from "@/lib/portal-venues";

export function VenueMenuFile({
  lang,
  url,
  venueName,
}: {
  lang: "no" | "en";
  url: string | null | undefined;
  venueName: string;
}) {
  if (!isPublicMenuUrl(url)) return null;

  const menuLabel = lang === "en" ? "See the menu" : "Se menyen";
  const alt = lang === "en" ? `Menu at ${venueName}` : `Meny hos ${venueName}`;

  if (isMenuImageUrl(url)) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block max-w-[16rem]">
        <img
          src={url}
          alt={alt}
          className="max-h-72 w-full border border-foreground/15 bg-[color:var(--paper)] object-contain"
        />
        <span className="mt-3 inline-block text-sm italic underline-offset-4 hover:underline">
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
      className="inline-block border border-foreground/20 px-5 py-3 text-sm italic underline-offset-4 hover:underline"
    >
      {menuLabel} ↓
    </a>
  );
}
