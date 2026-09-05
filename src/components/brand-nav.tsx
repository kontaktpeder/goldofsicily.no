import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { BrandWordmark, GoldMark } from "@/components/brand-mark";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";

type Props = {
  lang: BrandLang;
  tone?: "overlay" | "solid";
};

export function BrandNav({ lang, tone = "solid" }: Props) {
  const t = BRAND[lang];

  const links = [
    { key: "arancini", label: t.nav.arancini, to: t.paths.arancini },
    { key: "find", label: t.nav.find, to: t.paths.find },
    { key: "about", label: t.nav.about, to: t.paths.about },
    { key: "venues", label: t.nav.venues, to: t.paths.venues },
  ] as const;

  const overlay = tone === "overlay";

  function linkLabel(key: (typeof links)[number]["key"], label: string) {
    if (key !== "find") return label;
    return (
      <>
        {t.hero.findBefore}
        <GoldMark />
        {t.hero.findAfter}
      </>
    );
  }

  return (
    <header
      className={`z-[90] font-display has-[details[open]]:fixed has-[details[open]]:inset-x-0 has-[details[open]]:top-0 has-[details[open]]:bg-[color:var(--cream)] has-[details[open]]:text-foreground ${
        overlay
          ? "absolute inset-x-0 top-0 text-[#F3EBDD]"
          : "sticky top-0 bg-[color:var(--cream)] text-foreground"
      }`}
    >
      <div className="relative z-[80] mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8 md:py-4">
        <Link to={t.paths.home} className="text-current">
          <BrandWordmark className={overlay ? "brightness-0 invert" : ""} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[1.05rem] italic tracking-tight text-current transition hover:text-[color:var(--sea)]"
            >
              {linkLabel(item.key, item.label)}
            </Link>
          ))}
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-current transition hover:text-[color:var(--sea)]"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </nav>

        <details className="lg:hidden">
          <summary className="relative z-[80] cursor-pointer list-none text-lg italic tracking-tight text-current [&::-webkit-details-marker]:hidden">
            <span className="details-closed">{t.nav.menu}</span>
            <span className="details-open">{t.nav.close}</span>
          </summary>
          <div className="fixed inset-0 z-[70] overflow-y-auto bg-[color:var(--cream)] px-5 pb-12 pt-24 text-foreground">
            <nav className="flex flex-col gap-5">
              {links.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="font-display text-3xl italic tracking-tight text-foreground"
                >
                  {linkLabel(item.key, item.label)}
                </Link>
              ))}
              <div className="mt-4 flex items-center gap-5">
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="text-foreground"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </div>
        </details>
      </div>

      {tone === "solid" ? <div className="border-b border-foreground/15" /> : null}
    </header>
  );
}
