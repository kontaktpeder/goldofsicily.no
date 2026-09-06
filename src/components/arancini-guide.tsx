import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { ARANCINI_PAGE, ARANCINI_PHOTO_PATH } from "@/lib/arancini-page";
import type { PublicVenue } from "@/lib/portal-venues";
import drawLine from "@/assets/brand/draw-arancini-line.png";
import drawLemon from "@/assets/brand/draw-lemon.webp";

export function AranciniGuide({ venues }: { venues: PublicVenue[] }) {
  const page = ARANCINI_PAGE;
  const recipe = page.recipe;

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display text-foreground">
      <BrandNav lang="no" />
      <article className="relative overflow-hidden">
        <div className="relative mx-auto max-w-3xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
          <h1 className="font-display text-[clamp(2.6rem,8vw,5.25rem)] leading-[0.95] tracking-tight">
            {page.h1}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl">
            {page.intro}
          </p>
        </div>

        <figure className="mx-auto max-w-5xl px-5 md:px-8">
          <img
            src={ARANCINI_PHOTO_PATH}
            alt={page.photoAlt}
            className="aspect-[16/10] w-full object-cover"
          />
        </figure>

        <div className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <img
            src={drawLine}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-6 top-8 w-28 opacity-80 md:right-0 md:w-36"
          />

          <section>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {page.sicily.heading}
            </h2>
            <div className="mt-6 flex max-w-2xl flex-col gap-5 text-base leading-relaxed text-foreground/75 md:text-lg">
              {page.sicily.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </div>

        <section className="border-y border-foreground/10 bg-[color:var(--paper)]">
          <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
            <h2 className="max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] tracking-tight">
              {recipe.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/75">
              {recipe.description}
            </p>
            <p className="mt-3 text-sm italic text-foreground/55">
              {recipe.category} · {recipe.cuisine}
            </p>
            <dl className="mt-8 grid gap-3 text-lg sm:grid-cols-2">
              <div>
                <dt className="sr-only">Utbytte</dt>
                <dd>{recipe.yieldLabel}</dd>
                <dd className="text-base text-foreground/60">{recipe.yieldLd}</dd>
              </div>
              <div>
                <dt className="sr-only">Tid</dt>
                <dd>{recipe.timeLabel}</dd>
                <dd className="mt-1 text-base text-foreground/70">{recipe.prepLabel}</dd>
                <dd className="text-base text-foreground/70">{recipe.cookLabel}</dd>
              </div>
            </dl>

            <div className="mt-12 flex flex-col gap-14 lg:grid lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <h3 className="font-display text-2xl tracking-tight">
                  {recipe.ingredientsHeading}
                </h3>
                <ul className="mt-5 divide-y divide-foreground/10">
                  {recipe.ingredients.map((item) => (
                    <li key={item} className="py-3 text-base leading-snug md:text-lg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-display text-2xl tracking-tight">{recipe.methodHeading}</h3>
                <ol className="mt-6 space-y-6">
                  {recipe.steps.map((step, index) => (
                    <li key={step} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
                      <span
                        aria-hidden
                        className="font-display text-2xl leading-none text-[color:var(--sea)]"
                      >
                        {index + 1}
                      </span>
                      <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <div className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <section>
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {page.airfryer.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {page.airfryer.body}
            </p>
          </section>

          <section className="mt-16 md:mt-20">
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {page.oven.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {page.oven.body}
            </p>
          </section>

          <section className="mt-16 md:mt-20">
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {page.fillings.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {page.fillings.intro}
            </p>
            <ul className="mt-6 max-w-md divide-y divide-foreground/10">
              {page.fillings.items.map((item) => (
                <li key={item} className="py-2.5 text-lg italic tracking-tight">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {page.fillings.goldLine}
            </p>
          </section>
        </div>

        <section className="relative overflow-hidden border-t border-foreground/10">
          <img
            src={drawLemon}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-8 bottom-0 w-36 rotate-12 opacity-80 md:w-48"
          />
          <div className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {page.oslo.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {page.oslo.body}
            </p>

            {venues.length === 0 ? (
              <p className="mt-8 text-lg leading-relaxed text-foreground/70">{page.oslo.empty}</p>
            ) : (
              <ul className="mt-10 divide-y divide-foreground/10">
                {venues.map((venue) => (
                  <li key={venue.slug}>
                    <Link
                      to="/steder/$slug"
                      params={{ slug: venue.slug }}
                      className="flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className="text-xl italic tracking-tight">{venue.name}</span>
                      {venue.city ? (
                        <span className="shrink-0 text-sm text-foreground/50">{venue.city}</span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-10">
              <Link
                to={page.oslo.ctaTo}
                className="text-lg italic underline-offset-4 hover:underline"
              >
                {page.oslo.cta}
              </Link>
            </p>
          </div>
        </section>
      </article>
      <BrandFooter lang="no" />
    </div>
  );
}
