import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

type EnPath =
  | "/en"
  | "/en/what-is-arancini"
  | "/en/next-popup"
  | "/en/about"
  | "/en/for-bars"
  | "/en/find-us"
  | "/en/collaborate";
type NoPath =
  | "/"
  | "/what-is-arancini"
  | "/next-popup"
  | "/about"
  | "/for-barer"
  | "/finn-oss"
  | "/samarbeid";

const NO_TO_EN: Record<string, EnPath> = {
  "/": "/en",
  "/what-is-arancini": "/en/what-is-arancini",
  "/next-popup": "/en/next-popup",
  "/about": "/en/about",
  "/for-barer": "/en/for-bars",
  "/finn-oss": "/en/find-us",
  "/samarbeid": "/en/collaborate",
};

const EN_TO_NO: Record<string, NoPath> = {
  "/en": "/",
  "/en/": "/",
  "/en/what-is-arancini": "/what-is-arancini",
  "/en/next-popup": "/next-popup",
  "/en/about": "/about",
  "/en/for-bars": "/for-barer",
  "/en/find-us": "/finn-oss",
  "/en/collaborate": "/samarbeid",
};

export function counterpartPath(lang: "no" | "en", pathname: string): string {
  const noVenue = pathname.match(/^\/steder\/([^/]+)$/);
  if (noVenue) return `/en/venues/${noVenue[1]}`;
  const enVenue = pathname.match(/^\/en\/venues\/([^/]+)$/);
  if (enVenue) return `/steder/${enVenue[1]}`;
  return lang === "no" ? (NO_TO_EN[pathname] ?? "/en") : (EN_TO_NO[pathname] ?? "/");
}

export function LanguageSwitchLink({
  lang,
  pathname,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  lang: "no" | "en";
  pathname: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const noVenue = pathname.match(/^\/steder\/([^/]+)$/);
  if (noVenue) {
    return (
      <Link to="/en/venues/$slug" params={{ slug: noVenue[1] }} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  const enVenue = pathname.match(/^\/en\/venues\/([^/]+)$/);
  if (enVenue) {
    return (
      <Link to="/steder/$slug" params={{ slug: enVenue[1] }} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={counterpartPath(lang, pathname)} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function LangSwitch({ lang }: { lang: "no" | "en" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const label = lang === "no" ? "EN" : "NO";
  return (
    <LanguageSwitchLink
      lang={lang}
      pathname={pathname}
      aria-label={lang === "no" ? "Switch to English" : "Bytt til norsk"}
      className="fixed right-3 top-3 z-50 inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 text-[0.55rem] font-medium uppercase tracking-[0.18em] text-foreground/55 transition hover:border-foreground/40 hover:text-foreground md:right-5 md:top-5 md:h-8 md:w-8 md:text-[0.6rem]"
    >
      {label}
    </LanguageSwitchLink>
  );
}
