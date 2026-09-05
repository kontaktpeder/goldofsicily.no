import wordmark from "@/assets/brand/wordmark-gold.png";
import logo from "@/assets/brand/logo-characters.png";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Gold of Sicily"
      className={`mx-auto h-auto w-full max-w-[22rem] object-contain md:max-w-[32rem] ${className}`}
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

export function BrandScript({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <em className={`brand-script ${className}`}>{children}</em>;
}
