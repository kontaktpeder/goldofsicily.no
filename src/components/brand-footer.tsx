import { Link } from "@tanstack/react-router";
import { BrandLockup, BrandWordmarkColor } from "@/components/brand-mark";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";

export function BrandFooter({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];
  const links = [
    { to: t.paths.arancini, label: t.nav.arancini },
    { to: t.paths.find, label: t.nav.find },
    { to: t.paths.venues, label: t.nav.venues },
    { to: t.paths.about, label: t.nav.about },
  ] as const;

  return (
    <footer className="bg-[color:var(--sea)] font-display text-[#F3EBDD]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <Link to={t.paths.home} className="inline-block">
          <BrandWordmarkColor className="h-auto w-[7.5rem] md:w-[10rem]" />
        </Link>
        <BrandLockup
          lang={lang}
          as="p"
          align="left"
          invert
          className="mt-5 text-lg md:text-xl"
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-10">
          <nav aria-label={t.footer.navHeading} className="min-w-0">
            <p className="text-sm tracking-wide text-[#F3EBDD]/55">{t.footer.navHeading}</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <p className="text-sm tracking-wide text-[#F3EBDD]/55">{t.footer.contactHeading}</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li>
                <a href="tel:45251280" className="underline-offset-4 hover:underline">
                  {SITE.phoneLabel}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="underline-offset-4 hover:underline">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <p className="text-sm tracking-wide text-[#F3EBDD]/55">{t.footer.socialHeading}</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {t.footer.instagram}
                </a>
              </li>
              <li>
                <a
                  href={SITE.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {t.footer.tiktok}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-[#F3EBDD]/20 pt-5 text-sm text-[#F3EBDD]/70">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
