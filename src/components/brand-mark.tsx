import logo from "@/assets/brand/logo-characters.png";
import wordmark from "@/assets/brand/wordmark-script.png";
import goldMark from "@/assets/brand/mark-gold.png";
import type { BrandLang } from "@/lib/brand-copy";

const LOCKUP: Record<BrandLang, [string, string]> = {
  no: ["italiensk enkelhet.", "norsk utførelse."],
  en: ["italian simplicity.", "norwegian craft."],
};

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Gold of Sicily"
      className={`mx-auto h-auto w-full max-w-[13.5rem] object-contain sm:max-w-[16rem] md:max-w-[18rem] ${className}`}
    />
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src={wordmark}
      alt="Gold of Sicily"
      className={`h-7 w-auto object-contain md:h-8 ${className}`}
    />
  );
}

export function GoldMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={goldMark}
      alt="Gold"
      className={`inline-block h-[0.92em] w-auto translate-y-[-0.06em] object-contain object-left align-baseline ${className}`}
    />
  );
}

export function BrandLockup({
  lang,
  as: Tag = "p",
  align = "center",
  invert = false,
  className = "",
}: {
  lang: BrandLang;
  as?: "h1" | "h2" | "p";
  align?: "center" | "left";
  invert?: boolean;
  className?: string;
}) {
  const [line1, line2] = LOCKUP[lang];
  return (
    <Tag
      className={`brand-lockup brand-lockup-${align} ${invert ? "brand-lockup-invert" : ""} ${className}`}
    >
      <span className="brand-lockup-line">{line1}</span>
      <span className="brand-lockup-line">{line2}</span>
    </Tag>
  );
}

export function BrandScript({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <em className={`brand-script ${className}`}>{children}</em>;
}
