import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandLockup } from "@/components/brand-mark";
import { BrandNav } from "@/components/brand-nav";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";

export function AboutView({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display">
      <BrandNav lang={lang} />
      <article className="relative overflow-hidden">
        <div className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <BrandLockup
            lang={lang}
            as="h1"
            align="left"
            className="mt-4 text-[clamp(2rem,6vw,4rem)]"
          />

          <div className="mt-12 flex flex-col gap-6 text-lg leading-relaxed text-foreground/80 md:text-xl">
            {t.about.manifesto.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <h2 className="mt-20 font-display text-3xl tracking-tight md:text-4xl">
            {t.about.storyHeading}
          </h2>
          <div className="mt-6 flex flex-col gap-5 text-base leading-relaxed text-foreground/75 md:text-lg">
            {t.about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 text-lg italic text-foreground/60">{t.about.proof}</p>

          <p className="mt-14 flex flex-wrap gap-x-6 gap-y-3 text-lg italic">
            <Link to={t.paths.find} className="underline-offset-4 hover:underline">
              {t.about.ctaFind} →
            </Link>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {t.about.ctaIg} →
            </a>
            <a
              href={SITE.tiktok}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              TikTok →
            </a>
          </p>
        </div>
      </article>
      <BrandFooter lang={lang} />
    </div>
  );
}
