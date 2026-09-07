import { Link } from "@tanstack/react-router";
import { BrandDrawingColor, BrandLockup, BrandWordmarkColor } from "@/components/brand-mark";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";
import drawLemon from "@/assets/brand/draw-lemon.webp";

export function BrandFooter({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];

  return (
    <footer className="relative overflow-hidden bg-[color:var(--sea)] font-display text-[#F3EBDD]">
      <img
        src={drawLemon}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-16 right-2 w-[min(48vw,18rem)] rotate-12 opacity-90 md:-bottom-20 md:right-8"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Link to={t.paths.home} className="inline-block">
          <BrandWordmarkColor className="h-10 w-auto md:h-12" />
        </Link>
        <BrandDrawingColor className="mt-8 h-36 w-auto md:mt-10 md:h-48" />
        <BrandLockup
          lang={lang}
          as="p"
          align="left"
          invert
          className="mt-6 text-xl md:text-2xl"
        />
        <p className="mt-10 flex flex-wrap items-baseline gap-x-3 text-xl italic">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {t.footer.instagram}
          </a>
          <span aria-hidden>·</span>
          <a
            href={SITE.tiktok}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {t.footer.tiktok}
          </a>
        </p>
      </div>
    </footer>
  );
}
