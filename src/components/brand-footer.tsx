import { Link } from "@tanstack/react-router";
import { BrandLockup, BrandWordmark } from "@/components/brand-mark";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";

export function BrandFooter({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];

  return (
    <footer className="bg-[color:var(--sea)] font-display text-[#F3EBDD]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Link to={t.paths.home} className="inline-block text-[#F3EBDD]">
          <BrandWordmark className="footer-wordmark" />
        </Link>
        <BrandLockup lang={lang} as="p" align="left" invert className="mt-6 text-xl md:text-2xl" />
        <p className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl italic">
          <a href={`tel:${SITE.phoneTel}`} className="underline-offset-4 hover:underline">
            {SITE.phoneLabel}
          </a>
          <span aria-hidden>·</span>
          <a href={`mailto:${SITE.email}`} className="underline-offset-4 hover:underline">
            {SITE.email}
          </a>
        </p>
        <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xl italic">
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
        <p className="mt-14 text-xs font-normal not-italic leading-relaxed tracking-normal text-[#F3EBDD]/70">
          {SITE.legalNotice}
        </p>
      </div>
    </footer>
  );
}
