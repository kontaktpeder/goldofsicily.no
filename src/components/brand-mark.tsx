import { useId } from "react";
import goldMask from "@/assets/brand/inline-gold-mask.png";
import wordmarkMask from "@/assets/brand/wordmark-script-mask.png";
import type { BrandLang } from "@/lib/brand-copy";

const GOLD_BOX = { w: 912, h: 402 };
const WORD_BOX = { w: 1264, h: 222 };

const LOCKUP: Record<BrandLang, [string, string]> = {
  no: ["italiensk enkelhet.", "norsk utførelse."],
  en: ["italian simplicity.", "norwegian craft."],
};

function ScriptFill({
  src,
  box,
  className,
  label,
}: {
  src: string;
  box: { w: number; h: number };
  className?: string;
  label: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={className}
      viewBox={`0 0 ${box.w} ${box.h}`}
      role="img"
      aria-label={label}
      focusable="false"
    >
      <title>{label}</title>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse">
          <image href={src} width={box.w} height={box.h} />
        </mask>
      </defs>
      <rect width={box.w} height={box.h} fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <ScriptFill
      src={wordmarkMask}
      box={WORD_BOX}
      className={`brand-logo ${className}`}
      label="Gold of Sicily"
    />
  );
}

export function BrandWordmark({ className = "" }: { className?: string }) {
  return (
    <ScriptFill
      src={wordmarkMask}
      box={WORD_BOX}
      className={`brand-wordmark ${className}`}
      label="Gold of Sicily"
    />
  );
}

export function InlineGoldMark({ className = "" }: { className?: string }) {
  return (
    <ScriptFill
      src={goldMask}
      box={GOLD_BOX}
      className={`inline-gold ${className}`}
      label="Gold"
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
