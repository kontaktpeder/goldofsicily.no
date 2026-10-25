import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import iconAirfryer from "@/assets/brand/icon-airfryer.png";
import iconArancini from "@/assets/brand/icon-arancini.png";
import iconBox from "@/assets/brand/icon-box.png";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { submitShopWaitlist } from "@/lib/shop.functions";
import { shopSlides } from "@/lib/shop-gallery";
import {
  DISCOVERY_SOURCES,
  PRICE_FIFTY_ORE,
  PRICE_SIX_ORE,
  clampBoxQty,
  fiftyStockLine,
  formatShopPrice,
  orderTotalOre,
  type DiscoverySource,
  type FlavorFacts,
  type PublicShop,
  type ShopFlavorSlug,
} from "@/lib/shop";

type Lang = "no" | "en";

const COPY = {
  no: {
    title: "Sicilianske arancini.",
    sub: "Sprø utenpå. Myk inni.",
    body: "Håndlagde arancini fra Oslo. Leveres fryst, klare på få minutter. Fra frys til fest.",
    langLabel: "English",
    taste: "Smak",
    size: "Størrelse",
    fifty: "50 stk",
    six: "6 stk",
    coming: "Kommer snart",
    quantity: "Antall esker",
    less: "Færre esker",
    more: "Flere esker",
    total: "Totalt",
    perBox: "per eske",
    vat: "inkl. mva",
    opens: "Bestilling åpner snart",
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
    launch: "Si ifra når bestilling åpner",
    restock: "Si ifra når denne smaken er tilbake",
    newsletter: "Ja, jeg vil også ha nyhetsbrev fra Gold of Sicily.",
    submit: "Si ifra når jeg kan bestille",
    submitting: "Lagrer …",
    doneLaunch: "Du står på listen. Vi sier ifra når bestilling åpner.",
    doneRestock: "Du står på listen. Vi sier ifra når denne smaken er tilbake.",
    doneBoth:
      "Du står på listen. Vi sier ifra når bestilling åpner, og når denne smaken er tilbake.",
    invalid: "Sjekk e-post, smak og hvor du fant Gold.",
    needNotice: "Kryss av for minst ett varsel.",
    unavailable: "Listen er ikke åpnet i portalen ennå.",
    error: "Vi fikk ikke lagret det. Prøv igjen.",
    trust: ["Leveres fryst", "Utviklet og produsert i Oslo", "Pris inkludert mva"],
    how: "Slik fungerer det",
    steps: [
      { title: "Velg favorittene", body: "’Nduja & mozzarella, eller trøffel & sjampinjong." },
      {
        title: "Henting og levering",
        body: "Henting og levering avklares før bestillingen kan betales.",
      },
      { title: "Varm og server", body: "Fra frys til fest." },
    ],
    factsTitle: "Produktinformasjon",
    preliminary: "Foreløpig",
    confirmed: "Bekreftet",
    factsNote:
      "Melk står i den foreløpige oversikten. Andre allergener er ikke avklart. Teksten er ikke ferdig merket for salg.",
    ingredients: "Ingredienser",
    allergens: "Allergener",
    storage: "Oppbevaring",
    prep: "Tilberedning",
    photo: {
      box: "50-esken med sicilianske arancini fra Gold of Sicily",
      tray: "Sprø arancini på et brett",
      hands: "Arancini holdt i hendene",
    },
    slide: "Bilde",
  },
  en: {
    title: "Sicilian arancini.",
    sub: "Crisp outside. Soft inside.",
    body: "Handmade arancini from Oslo. Delivered frozen, ready in a few minutes. From the freezer to the feast.",
    langLabel: "Norsk",
    taste: "Flavour",
    size: "Size",
    fifty: "50 pcs",
    six: "6 pcs",
    coming: "Coming soon",
    quantity: "Number of boxes",
    less: "Fewer boxes",
    more: "More boxes",
    total: "Total",
    perBox: "per box",
    vat: "incl. VAT",
    opens: "Ordering opens soon",
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
    launch: "Tell me when ordering opens",
    restock: "Tell me when this flavour is back",
    newsletter: "Yes, I also want the Gold of Sicily newsletter.",
    submit: "Tell me when I can order",
    submitting: "Saving …",
    doneLaunch: "You’re on the list. We’ll write when ordering opens.",
    doneRestock: "You’re on the list. We’ll write when this flavour is back.",
    doneBoth: "You’re on the list. We’ll write when ordering opens, and when this flavour is back.",
    invalid: "Check the email, flavour and where you found Gold.",
    needNotice: "Tick at least one notice.",
    unavailable: "The list is not open in the portal yet.",
    error: "We couldn’t save that. Try again.",
    trust: ["Delivered frozen", "Developed and produced in Oslo", "Price includes VAT"],
    how: "How it works",
    steps: [
      { title: "Choose your favourites", body: "’Nduja & mozzarella, or truffle & champignon." },
      {
        title: "Pickup and delivery",
        body: "Pickup and delivery are settled before an order can be paid.",
      },
      { title: "Heat and serve", body: "From the freezer to the feast." },
    ],
    factsTitle: "Product information",
    preliminary: "Preliminary",
    confirmed: "Confirmed",
    factsNote:
      "Milk is listed in the preliminary overview. Other allergens are not settled. The text is not finished labelling for sale.",
    ingredients: "Ingredients",
    allergens: "Allergens",
    storage: "Storage",
    prep: "Preparation",
    photo: {
      box: "The 50-box of Sicilian arancini from Gold of Sicily",
      tray: "Crisp arancini on a tray",
      hands: "Arancini held in two hands",
    },
    slide: "Image",
  },
} as const;

const STEP_MARKS = [iconArancini, iconBox, iconAirfryer];

function flavorName(shop: PublicShop, slug: ShopFlavorSlug, lang: Lang) {
  const flavor = shop.flavors.find((item) => item.slug === slug);
  if (!flavor) return slug;
  return lang === "en" ? flavor.nameEn : flavor.nameNo;
}

function FlavorDot({ slug }: { slug: ShopFlavorSlug }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${
        slug === "nduja" ? "bg-[color:var(--tomato)]" : "bg-[color:var(--olive)]"
      }`}
    />
  );
}

function Gallery({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  const slides = shopSlides();
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <figure>
      <img
        src={slide.src}
        alt={copy.photo[slide.id]}
        className={`aspect-[4/5] w-full bg-[color:var(--paper)] sm:aspect-[5/4] lg:aspect-[4/5] ${
          slide.kind === "box" ? "object-contain" : "object-cover"
        }`}
      />
      {slides.length > 1 ? (
        <div className="mt-3 flex gap-2 px-5 md:px-0">
          {slides.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`${copy.slide} ${itemIndex + 1}`}
                aria-pressed={active}
                onClick={() => setIndex(itemIndex)}
                className={`h-16 w-16 overflow-hidden border ${
                  active ? "border-foreground" : "border-transparent opacity-70"
                }`}
              >
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </figure>
  );
}

function NoticeForm({
  lang,
  flavor,
  soldOut,
}: {
  lang: Lang;
  flavor: ShopFlavorSlug;
  soldOut: boolean;
}) {
  const copy = COPY[lang];
  const submit = useServerFn(submitShopWaitlist);
  const [email, setEmail] = useState("");
  const [discovery, setDiscovery] = useState<DiscoverySource | "">("");
  const [launch, setLaunch] = useState(true);
  const [restock, setRestock] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const launchNotice = launch;
    const restockNotice = soldOut && restock;
    if (!launchNotice && !restockNotice) {
      setStatus("error");
      setMessage(copy.needNotice);
      return;
    }
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
          launchNotice,
          restockNotice,
        },
      });
      setStatus("done");
      setMessage(
        launchNotice && restockNotice
          ? copy.doneBoth
          : restockNotice
            ? copy.doneRestock
            : copy.doneLaunch,
      );
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setStatus("error");
      setMessage(
        code === "invalid" ? copy.invalid : code === "unavailable" ? copy.unavailable : copy.error,
      );
    }
  }

  if (status === "done") {
    return <p className="mt-6 text-base italic leading-relaxed text-foreground/80">{message}</p>;
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
          checked={launch}
          onChange={(event) => setLaunch(event.target.checked)}
          className="mt-1"
        />
        <span>{copy.launch}</span>
      </label>
      {soldOut ? (
        <label className="flex items-start gap-3 font-sans text-sm leading-snug">
          <input
            type="checkbox"
            checked={restock}
            onChange={(event) => setRestock(event.target.checked)}
            className="mt-1"
          />
          <span>{copy.restock}</span>
        </label>
      ) : null}
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
        className="bg-[color:var(--espresso)] px-4 py-4 font-display text-xl italic tracking-tight text-[color:var(--cream)] disabled:opacity-40"
      >
        {status === "loading" ? copy.submitting : copy.submit}
      </button>
      {status === "error" ? (
        <p className="font-sans text-sm text-[color:var(--tomato)]">{message}</p>
      ) : null}
    </form>
  );
}

function factBody(
  facts: FlavorFacts,
  lang: Lang,
  key: "ingredients" | "allergens" | "storage" | "prep",
): string | null {
  if (lang === "en") {
    const english =
      key === "ingredients"
        ? facts.ingredientsEn
        : key === "allergens"
          ? facts.allergensEn
          : key === "storage"
            ? facts.storageEn
            : facts.prepEn;
    if (english) return english;
  }
  return facts[key];
}

function FactBlocks({ lang, facts }: { lang: Lang; facts: FlavorFacts }) {
  const copy = COPY[lang];
  const rows = [
    [copy.ingredients, factBody(facts, lang, "ingredients")],
    [copy.allergens, factBody(facts, lang, "allergens")],
    [copy.storage, factBody(facts, lang, "storage")],
    [copy.prep, factBody(facts, lang, "prep")],
  ] as const;
  const filled = rows.filter((row) => row[1]);
  if (filled.length === 0) return null;
  return (
    <dl className="mt-6 flex flex-col gap-4">
      {filled.map(([label, text]) => (
        <div key={label}>
          <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">{label}</dt>
          <dd className="mt-1 whitespace-pre-line text-base leading-relaxed text-foreground/80">
            {text}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProductFacts({ lang, name, facts }: { lang: Lang; name: string; facts: FlavorFacts }) {
  const copy = COPY[lang];
  return (
    <section className="mt-14 border-t border-foreground/10 pt-10">
      <h2 className="font-display text-3xl tracking-tight">{copy.factsTitle}</h2>
      <p className="mt-3 text-lg italic">{name}</p>
      <p className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
        {facts.verified ? copy.confirmed : copy.preliminary}
      </p>
      {facts.verified ? null : (
        <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground/75">
          {copy.factsNote}
        </p>
      )}
      <FactBlocks lang={lang} facts={facts} />
    </section>
  );
}

export function ShopPage({ lang, shop }: { lang: Lang; shop: PublicShop }) {
  const copy = COPY[lang];
  const firstWithStock = shop.flavors.find((flavor) => flavor.boxes50 > 0)?.slug ?? "nduja";
  const [flavor, setFlavor] = useState<ShopFlavorSlug>(firstWithStock);
  const [qty, setQty] = useState(1);
  const selected = shop.flavors.find((item) => item.slug === flavor) ?? shop.flavors[0];
  const boxes = selected?.boxes50 ?? 0;
  const shownQty = clampBoxQty(qty, boxes, shop.stockKnown);
  const soldOut = shop.stockKnown && boxes <= 0;
  const stockLine = fiftyStockLine(lang, boxes, shop.stockKnown);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display text-foreground">
      <BrandNav lang={lang} />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-24 md:px-8 md:pt-28">
        <div className="mb-4 flex justify-end">
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

        <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start lg:gap-14">
          <div className="-mx-5 md:mx-0">
            <Gallery lang={lang} />
            <div className="mt-14 hidden px-5 md:px-0 lg:block">
              <HowItWorks lang={lang} />
              {selected ? (
                <ProductFacts
                  lang={lang}
                  name={flavorName(shop, selected.slug, lang)}
                  facts={selected.facts}
                />
              ) : null}
            </div>
          </div>

          <div className="pt-8 lg:pt-2">
            <h1 className="font-display text-[clamp(2.7rem,8vw,4.4rem)] leading-[1.02] tracking-tight">
              {copy.title}
            </h1>
            <p className="mt-3 font-display text-2xl italic leading-snug tracking-tight text-[color:var(--sea)] md:text-3xl">
              {copy.sub}
            </p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-foreground/75">{copy.body}</p>

            <fieldset className="mt-8">
              <legend className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
                {copy.taste}
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {shop.flavors.map((item) => {
                  const active = item.slug === flavor;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFlavor(item.slug)}
                      className={`flex min-h-12 items-center gap-3 border px-3 py-3 text-left text-lg italic ${
                        active ? "border-foreground" : "border-foreground/20"
                      }`}
                    >
                      <FlavorDot slug={item.slug} />
                      {flavorName(shop, item.slug, lang)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
                {copy.size}
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  aria-pressed
                  className="flex min-h-12 items-center justify-between gap-3 border border-foreground px-3 py-3 text-left"
                >
                  <span className="flex items-center gap-3 text-lg italic">
                    <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-foreground" />
                    {copy.fifty}
                  </span>
                  <span className="font-display text-xl tracking-tight">
                    {formatShopPrice(PRICE_FIFTY_ORE)}
                  </span>
                </button>
                <button
                  type="button"
                  disabled
                  className="flex min-h-12 cursor-not-allowed items-center justify-between gap-3 border border-foreground/15 px-3 py-3 text-left text-foreground/45"
                >
                  <span className="text-lg italic">{copy.six}</span>
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-xl tracking-tight">
                      {formatShopPrice(PRICE_SIX_ORE)}
                    </span>
                    <span className="text-base italic">{copy.coming}</span>
                  </span>
                </button>
              </div>
            </fieldset>

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
                {copy.quantity}
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={copy.less}
                  disabled={shownQty <= 1}
                  onClick={() =>
                    setQty((current) => clampBoxQty(current - 1, boxes, shop.stockKnown))
                  }
                  className="h-11 w-11 border border-foreground/25 font-display text-2xl leading-none disabled:opacity-30"
                >
                  −
                </button>
                <span className="min-w-6 text-center font-display text-2xl" aria-live="polite">
                  {shownQty}
                </span>
                <button
                  type="button"
                  aria-label={copy.more}
                  disabled={!shop.stockKnown || boxes <= shownQty}
                  onClick={() =>
                    setQty((current) => clampBoxQty(current + 1, boxes, shop.stockKnown))
                  }
                  className="h-11 w-11 border border-foreground/25 font-display text-2xl leading-none disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <p className="mt-8 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
              {copy.total}
            </p>
            <p className="font-display text-5xl tracking-tight" aria-live="polite">
              {formatShopPrice(orderTotalOre(shownQty))}
            </p>
            <p className="mt-1 text-sm text-foreground/55">
              {formatShopPrice(PRICE_FIFTY_ORE)} {copy.perBox} · {copy.vat}
            </p>

            <p
              className={
                soldOut
                  ? "mt-6 font-display text-[clamp(1.55rem,4vw,2rem)] italic leading-snug tracking-tight"
                  : "mt-6 text-base leading-relaxed text-foreground/70"
              }
              aria-live="polite"
            >
              {stockLine}
            </p>

            <ul className="mt-6 flex flex-col gap-1 text-base italic text-foreground/70">
              {copy.trust.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-3xl italic tracking-tight">{copy.opens}</h2>
            <NoticeForm
              key={`${flavor}-${soldOut ? "out" : "in"}`}
              lang={lang}
              flavor={flavor}
              soldOut={soldOut}
            />
          </div>
        </div>

        <div className="lg:hidden">
          <div className="mt-16">
            <HowItWorks lang={lang} />
          </div>
          {selected ? (
            <ProductFacts
              lang={lang}
              name={flavorName(shop, selected.slug, lang)}
              facts={selected.facts}
            />
          ) : null}
        </div>
      </main>
      <BrandFooter lang={lang} />
    </div>
  );
}

function HowItWorks({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section>
      <h2 className="font-display text-3xl tracking-tight">{copy.how}</h2>
      <ol className="mt-8 flex flex-col gap-8">
        {copy.steps.map((step, index) => {
          const mark = STEP_MARKS[index];
          return (
            <li key={step.title} className="flex items-start gap-4">
              {mark ? (
                <span
                  aria-hidden
                  className="shop-line-icon"
                  style={{ ["--mark" as string]: `url("${mark}")` }}
                />
              ) : (
                <span className="font-display text-3xl italic">{index + 1}</span>
              )}
              <div>
                <p className="font-display text-2xl tracking-tight">{step.title}</p>
                <p className="mt-1 max-w-sm text-base leading-relaxed text-foreground/75">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
