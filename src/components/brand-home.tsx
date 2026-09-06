import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandLockup, BrandLogo } from "@/components/brand-mark";
import { BrandNav } from "@/components/brand-nav";
import { FindGoldGrid } from "@/components/find-gold-grid";
import { BRAND, type BrandLang, type ServeCardKey } from "@/lib/brand-copy";
import type { PublicVenue } from "@/lib/portal-venues";
import photoGold from "@/assets/brand/photo-the-gold.jpg";
import photoHands from "@/assets/brand/photo-hands.jpg";
import drawAranciniLine from "@/assets/brand/draw-arancini-line.png";
import drawVespa from "@/assets/brand/draw-vespa.webp";
import iconAirfryer from "@/assets/brand/icon-airfryer.png";
import iconMenu from "@/assets/brand/icon-menu.png";
import iconBox from "@/assets/brand/icon-box.png";

const SERVE_ICONS: Record<ServeCardKey, string> = {
  product: drawAranciniLine,
  serve: iconAirfryer,
  menu: iconMenu,
  follow: iconBox,
};

export function BrandHome({ lang, venues }: { lang: BrandLang; venues: PublicVenue[] }) {
  const t = BRAND[lang];

  return (
    <div className="bg-[color:var(--cream)] font-display text-foreground">
      <BrandNav lang={lang} revealLogoOnScroll />

      <section className="brand-hero px-5 md:px-12 lg:px-16">
        <div className="brand-hero-inner mx-auto max-w-3xl text-center">
          <BrandLogo priority />
          <p className="mt-5 text-[0.62rem] uppercase tracking-[0.22em] text-foreground/50 md:mt-6">
            {t.hero.kicker}
          </p>
          <BrandLockup
            lang={lang}
            as="h1"
            align="center"
            className="mt-3 text-[clamp(1.55rem,3.4vw,2.45rem)] md:mt-4"
          />
          <p className="mx-auto mt-3 max-w-xl text-lg leading-snug text-foreground/80 md:mt-4 md:text-xl">
            {t.hero.sub}
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
            <a href="#find-gold" className="btn-gold btn-gold-solid whitespace-nowrap">
              {t.hero.findCta}
            </a>
            <Link to={t.paths.venues} className="btn-gold btn-gold-ghost whitespace-nowrap">
              {t.hero.venuesCta}
            </Link>
          </div>
        </div>
      </section>

      <section id="the-gold" className="px-5 py-16 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-[clamp(3.2rem,10vw,7rem)] leading-[0.9] tracking-tight">
              {t.gold.title}
            </h2>
            <p className="mt-6 max-w-sm text-xl leading-snug text-foreground/80 md:text-2xl">
              {t.gold.body}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              {t.gold.flavors.map((flavor) => (
                <li
                  key={flavor}
                  className="font-display text-2xl italic tracking-tight md:text-3xl"
                >
                  {flavor}
                </li>
              ))}
            </ul>
            <Link
              to={t.paths.arancini}
              className="mt-10 inline-block text-lg italic underline-offset-4 hover:underline"
            >
              {t.gold.cta} →
            </Link>
          </div>
          <img
            src={photoGold}
            alt={t.gold.photoAlt}
            width={1086}
            height={1448}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover lg:max-h-[58vh]"
          />
        </div>
      </section>

      <section className="bg-[color:var(--espresso)] text-[#F3EBDD]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-12 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-16">
          <div className="order-1 lg:order-2">
            <BrandLockup
              lang={lang}
              as="h2"
              align="left"
              invert
              className="text-[clamp(1.7rem,4vw,2.8rem)]"
            />
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#F3EBDD]/80 md:text-xl">
              {t.world.body}
            </p>
          </div>
          <img
            src={photoHands}
            alt={t.world.photoAlt}
            width={1086}
            height={1448}
            loading="lazy"
            className="order-2 aspect-[4/5] w-full object-cover object-center lg:order-1 lg:max-h-[52vh]"
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[color:var(--sea)] text-[#F3EBDD]">
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="max-w-xl lg:max-w-[58%]">
            <h2 className="font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.95] tracking-tight">
              <span className="block">{t.same.line1}</span>
              <span className="block">
                {t.same.line2Before}
                {t.same.line2Mark}
                {t.same.line2After}
              </span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#F3EBDD]/85 md:text-xl">
              {t.same.body}
            </p>
          </div>
          <img
            src={drawVespa}
            alt=""
            aria-hidden
            loading="lazy"
            className="mt-10 w-36 md:w-44 lg:hidden"
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-[-4%] hidden w-[32%] lg:block">
          <svg
            viewBox="0 0 200 200"
            aria-hidden
            className="absolute top-1/2 left-1/2 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2"
          >
            <path
              d="M38 54c18-28 62-42 98-28 34 14 52 52 40 88-10 32-44 58-84 56-42-2-72-28-80-62-6-28 8-38 26-54z"
              fill="var(--golden)"
            />
          </svg>
          <img
            src={drawVespa}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute right-[-12%] bottom-[-8%] w-[118%]"
          />
        </div>
      </section>

      <section id="find-gold" className="scroll-mt-20 px-5 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
            {t.find.titleBefore}
            {t.find.titleMark}
            {t.find.titleAfter}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/75 md:text-xl">
            {t.find.body}
          </p>
          <div className="mt-12">
            <FindGoldGrid lang={lang} compact venues={venues} />
          </div>
        </div>
      </section>

      <section
        id="serve-gold"
        className="scroll-mt-20 bg-[color:var(--paper)] px-5 py-20 md:px-12 md:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">
            {t.serve.eyebrowBefore}
            <em className="brand-script">{t.serve.eyebrowMark}</em>
            {t.serve.eyebrowAfter}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
            {t.serve.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/75 md:text-xl">
            {t.serve.body}
          </p>
          <ul className="mt-12 grid grid-cols-2 gap-3 md:gap-4">
            {t.serve.cards.map((card) => (
              <li
                key={card.key}
                className="border border-foreground/15 bg-[color:var(--cream)] px-4 py-5 md:px-8 md:py-8"
              >
                <img
                  src={SERVE_ICONS[card.key]}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="mb-4 h-10 w-auto object-contain md:mb-5 md:h-12"
                />
                <h3 className="font-display text-xl tracking-tight md:text-3xl">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70 md:mt-3 md:text-lg">
                  {card.body}
                </p>
              </li>
            ))}
          </ul>
          <Link
            to={t.paths.venues}
            className="mt-12 inline-block text-lg italic underline-offset-4 hover:underline"
          >
            {t.serve.cta} →
          </Link>
        </div>
      </section>

      <BrandFooter lang={lang} />
    </div>
  );
}
