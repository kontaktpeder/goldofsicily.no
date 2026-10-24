import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import imgFifty from "@/assets/b2b-pa-fat.jpg";
import imgSix from "@/assets/b2b-spiseklar.jpg";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { submitShopWaitlist } from "@/lib/shop.functions";
import {
  DISCOVERY_SOURCES,
  PRICE_FIFTY_ORE,
  PRICE_SIX_ORE,
  fiftyStockLine,
  formatShopPrice,
  type DiscoverySource,
  type PublicShop,
  type ShopFlavorSlug,
} from "@/lib/shop";

type Lang = "no" | "en";

const COPY = {
  no: {
    title: "Kjøp Golden Balls",
    intro:
      "Prisene er inkludert mva. Betaling åpner når en ekte ordre er testet fra kjøp til levering.",
    six: "6 Golden Balls",
    fifty: "50 Golden Balls",
    flavors: "’Nduja / Trøffel",
    coming: "Kommer snart",
    vat: "inkl. mva",
    taste: "Smak",
    paymentOff: "Betaling er av",
    email: "E-post",
    emailPlaceholder: "deg@epost.no",
    discovery: "Hvor fant du Gold?",
    discoveryLabels: {
      friends: "Venner",
      instagram: "Instagram",
      venue: "Et serveringssted",
      search: "Søk",
      other: "Annet",
    } satisfies Record<DiscoverySource, string>,
    newsletter: "Ja, jeg vil også ha nyhetsbrev fra Gold of Sicily.",
    submit: "Si ifra",
    submitting: "Lagrer …",
    done: "Du står på listen. Vi sier ifra når denne smaken er tilbake.",
    invalid: "Sjekk e-post, smak og hvor du fant Gold.",
    unavailable: "Ventelisten er ikke åpnet i portalen ennå.",
    error: "Vi fikk ikke lagret det. Prøv igjen.",
    langLabel: "English",
    photoAlt: "Sprø arancini fra Gold of Sicily",
  },
  en: {
    title: "Buy Golden Balls",
    intro:
      "Prices include VAT. Payment opens once a real order has been tested from purchase to delivery.",
    six: "6 Golden Balls",
    fifty: "50 Golden Balls",
    flavors: "’Nduja / Truffle",
    coming: "Coming soon",
    vat: "incl. VAT",
    taste: "Flavour",
    paymentOff: "Payment is off",
    email: "Email",
    emailPlaceholder: "you@email.com",
    discovery: "Where did you find Gold?",
    discoveryLabels: {
      friends: "Friends",
      instagram: "Instagram",
      venue: "A venue",
      search: "Search",
      other: "Other",
    } satisfies Record<DiscoverySource, string>,
    newsletter: "Yes, I also want the Gold of Sicily newsletter.",
    submit: "Tell me",
    submitting: "Saving …",
    done: "You’re on the list. We’ll write when this flavour is back.",
    invalid: "Check the email, flavour and where you found Gold.",
    unavailable: "The waitlist is not open in the portal yet.",
    error: "We couldn’t save that. Try again.",
    langLabel: "Norsk",
    photoAlt: "Crisp arancini from Gold of Sicily",
  },
} as const;

function flavorName(shop: PublicShop, slug: ShopFlavorSlug, lang: Lang) {
  const flavor = shop.flavors.find((item) => item.slug === slug);
  if (!flavor) return slug;
  return lang === "en" ? flavor.nameEn : flavor.nameNo;
}

function OffButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="mt-8 w-full cursor-not-allowed border border-foreground/25 px-4 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-foreground/45"
    >
      {label}
    </button>
  );
}

function WaitlistForm({ lang, flavor }: { lang: Lang; flavor: ShopFlavorSlug }) {
  const copy = COPY[lang];
  const submit = useServerFn(submitShopWaitlist);
  const [email, setEmail] = useState("");
  const [discovery, setDiscovery] = useState<DiscoverySource | "">("");
  const [newsletter, setNewsletter] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!discovery) {
      setStatus("error");
      setMessage(copy.invalid);
      return;
    }
    setStatus("loading");
    try {
      await submit({
        data: {
          email,
          flavor,
          lang,
          discovery,
          newsletterConsent: newsletter,
        },
      });
      setStatus("done");
      setMessage(copy.done);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setStatus("error");
      setMessage(
        code === "invalid" ? copy.invalid : code === "unavailable" ? copy.unavailable : copy.error,
      );
    }
  }

  if (status === "done") {
    return <p className="mt-6 text-base italic text-foreground/80">{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
      <label className="block font-sans text-sm">
        <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
          {copy.email}
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.emailPlaceholder}
          className="w-full border-b border-foreground/30 bg-transparent py-2 text-base outline-none"
        />
      </label>
      <label className="block font-sans text-sm">
        <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
          {copy.discovery}
        </span>
        <select
          required
          value={discovery}
          onChange={(event) => setDiscovery(event.target.value as DiscoverySource | "")}
          className="w-full border-b border-foreground/30 bg-transparent py-2 text-base outline-none"
        >
          <option value="">{copy.discovery}</option>
          {DISCOVERY_SOURCES.map((source) => (
            <option key={source} value={source}>
              {copy.discoveryLabels[source]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-start gap-3 font-sans text-sm leading-snug">
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(event) => setNewsletter(event.target.checked)}
          className="mt-1"
        />
        <span>{copy.newsletter}</span>
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[color:var(--espresso)] px-4 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-[color:var(--cream)] disabled:opacity-40"
      >
        {status === "loading" ? copy.submitting : copy.submit}
      </button>
      {status === "error" ? (
        <p className="font-sans text-sm text-[color:var(--tomato)]">{message}</p>
      ) : null}
    </form>
  );
}

export function ShopPage({ lang, shop }: { lang: Lang; shop: PublicShop }) {
  const copy = COPY[lang];
  const firstWithStock = shop.flavors.find((flavor) => flavor.boxes50 > 0)?.slug ?? "nduja";
  const [flavor, setFlavor] = useState<ShopFlavorSlug>(firstWithStock);
  const selected = shop.flavors.find((item) => item.slug === flavor) ?? shop.flavors[0];
  const boxes = selected?.boxes50 ?? 0;
  const showWaitlist = !shop.stockKnown || boxes <= 0;

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display text-foreground">
      <BrandNav lang={lang} />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-8 md:px-8 md:pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">Gold of Sicily</p>
          {lang === "no" ? (
            <Link to="/en/buy" className="text-base italic text-[color:var(--sea)]">
              {copy.langLabel}
            </Link>
          ) : (
            <Link to="/kjop" className="text-base italic text-[color:var(--sea)]">
              {copy.langLabel}
            </Link>
          )}
        </div>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.6rem,8vw,4.6rem)] leading-[1.02] tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-foreground/75">{copy.intro}</p>

        <div className="mt-12 grid items-start gap-6 md:grid-cols-2">
          <article className="flex flex-col bg-[color:var(--paper)] p-5 md:p-7">
            <img src={imgSix} alt={copy.photoAlt} className="aspect-[4/3] w-full object-cover" />
            <p className="mt-6 text-lg italic text-[color:var(--sea)]">{copy.six}</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
              {copy.flavors}
            </h2>
            <p className="mt-8 font-display text-4xl tracking-tight">
              {formatShopPrice(PRICE_SIX_ORE)}
            </p>
            <p className="mt-1 text-sm text-foreground/55">{copy.vat}</p>
            <p className="mt-6 font-display text-2xl italic tracking-tight">{copy.coming}</p>
            <OffButton label={copy.coming} />
          </article>

          <article className="flex flex-col bg-[color:var(--paper)] p-5 md:p-7">
            <img src={imgFifty} alt={copy.photoAlt} className="aspect-[4/3] w-full object-cover" />
            <p className="mt-6 text-lg italic text-[color:var(--sea)]">{copy.fifty}</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
              {copy.flavors}
            </h2>
            <p className="mt-8 font-display text-4xl tracking-tight">
              {formatShopPrice(PRICE_FIFTY_ORE)}
            </p>
            <p className="mt-1 text-sm text-foreground/55">{copy.vat}</p>
            <fieldset className="mt-6">
              <legend className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
                {copy.taste}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {shop.flavors.map((item) => {
                  const active = item.slug === flavor;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFlavor(item.slug)}
                      className={`border px-3 py-2 text-base italic ${
                        active
                          ? "border-foreground bg-foreground text-[color:var(--cream)]"
                          : "border-foreground/25"
                      }`}
                    >
                      {flavorName(shop, item.slug, lang)}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <p
              className="mt-6 font-display text-[clamp(1.7rem,3vw,2.2rem)] italic leading-tight tracking-tight"
              aria-live="polite"
            >
              {fiftyStockLine(lang, boxes, shop.stockKnown)}
            </p>
            <OffButton label={copy.paymentOff} />
            {showWaitlist ? <WaitlistForm key={flavor} lang={lang} flavor={flavor} /> : null}
          </article>
        </div>
      </main>
      <BrandFooter lang={lang} />
    </div>
  );
}
