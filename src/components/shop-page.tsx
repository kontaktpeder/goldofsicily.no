import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  orderCta,
  orderTotalOre,
  piecePriceLine,
  postDeliveryQuote,
  postShopOrder,
  type DiscoverySource,
  type FlavorFacts,
  type PublicShop,
  type ShopFlavorSlug,
} from "@/lib/shop";

type Lang = "no" | "en";

const COPY = {
  no: {
    title: "Baller i boks.",
    sub: "Sprø, sicilianske arancini.",
    body: "Håndlagde risballer fra Oslo, med sprø utside og smakfullt fyll. Leveres fryst og varmes enkelt opp. Fra frys til fest.",
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
    closed: "Bestillingen er ikke åpen ennå.",
    request: "Send forespørsel",
    requestNote:
      "Dette er en forespørsel, ikke en bestilling. Frakt og leveringstid er ikke avtalt.",
    bindingNote:
      "Bestillingen er bindende. Faktura kommer etter levering. Henting utenfor Smalgangen 31, 0188 Oslo.",
    name: "Navn",
    phone: "Telefon",
    address: "Adresse",
    postal: "Postnummer",
    city: "Poststed",
    org: "Organisasjonsnummer, valgfritt",
    pickup: "Henting utenfor Smalgangen 31, 0188 Oslo",
    pickupNote:
      "Vi leier kjøkkenet i restauranten. Hentingen skjer utenfor, ikke inne i restauranten.",
    delivery: "Levering til adresse",
    deliveryNote:
      "Fast pris i luftlinje fra Smalgangen 31: 60 kr innen 5 km, 179 kr innen 10 km og 349 kr innen 15 km. Utenfor 15 km sender vi et tilbud.",
    deliveryQuote: "Regner ut levering …",
    deliveryOutside: "Adressen er utenfor 15 km. Vi sender et tilbud med full pris.",
    deliveryPriced: "inkl. levering",
    receivedQuote: "Forespørselen er mottatt. Dette er ikke en bestilling.",
    receivedBinding: "Bestillingen er mottatt. Faktura kommer etter levering.",
    short: "Det er ikke nok esker igjen.",
    orderInvalid: "Sjekk feltene og prøv igjen.",
    orderUnavailable: "Vi fikk ikke sendt den. Prøv igjen.",
    email: "E-post",
    emailPlaceholder: "deg@epost.no",
    discovery: "Hvor fant du Gold?",
    discoveryOptional: "Hvor fant du Gold? Valgfritt",
    discoveryLabels: {
      friends: "Venner",
      instagram: "Instagram",
      venue: "Et serveringssted",
      search: "Søk",
      other: "Annet",
    } satisfies Record<DiscoverySource, string>,
    newsletter: "Ja, jeg vil også ha nyhetsbrevet fra Gold of Sicily.",
    submit: "Få beskjed når du kan bestille",
    submitting: "Lagrer …",
    doneLaunch: "Du står på listen. Vi skriver når du kan bestille.",
    doneRestock: "Du står på listen. Vi skriver når denne smaken er tilbake.",
    doneBoth: "Du står på listen. Vi skriver når du kan bestille, og når denne smaken er tilbake.",
    invalid: "Sjekk e-postadressen.",
    unavailable: "Listen er ikke åpnet i portalen ennå.",
    error: "Vi fikk ikke lagret det. Prøv igjen.",
    trust: ["Leveres fryst", "Utviklet og produsert i Oslo", "Pris inkludert mva"],
    how: "Slik fungerer det",
    steps: [
      { title: "Velg favorittene", body: "’Nduja & mozzarella, eller trøffel & sjampinjong." },
      {
        title: "Henting og levering",
        body: "Henting skjer utenfor Smalgangen 31, 0188 Oslo. Levering avklares før bestillingen kan betales.",
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
    title: "Golden balls. In a box.",
    sub: "Crisp, Sicilian arancini.",
    body: "Handmade rice balls from Oslo, with a crisp outside and a flavourful filling. Delivered frozen and easy to heat. From the freezer to the feast.",
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
    closed: "Ordering isn’t open yet.",
    request: "Send a request",
    requestNote: "This is a request, not an order. Freight and delivery time are not agreed.",
    bindingNote:
      "This order is binding. The invoice comes after delivery. Pickup is outside Smalgangen 31, 0188 Oslo.",
    name: "Name",
    phone: "Phone",
    address: "Address",
    postal: "Postal code",
    city: "City",
    org: "Organisation number, optional",
    pickup: "Pickup outside Smalgangen 31, 0188 Oslo",
    pickupNote:
      "We rent the kitchen in the restaurant. Pickup is outside, not inside the restaurant.",
    delivery: "Delivery to an address",
    deliveryNote:
      "Fixed straight-line price from Smalgangen 31: 60 kr within 5 km, 179 kr within 10 km and 349 kr within 15 km. Beyond 15 km we send an offer.",
    deliveryQuote: "Calculating delivery …",
    deliveryOutside: "This address is beyond 15 km. We will send an offer with the full price.",
    deliveryPriced: "incl. delivery",
    receivedQuote: "The request is received. This is not an order.",
    receivedBinding: "The order is received. The invoice comes after delivery.",
    short: "There are not enough boxes left.",
    orderInvalid: "Check the fields and try again.",
    orderUnavailable: "We couldn’t send it. Try again.",
    email: "Email",
    emailPlaceholder: "you@email.com",
    discovery: "Where did you find Gold?",
    discoveryOptional: "Where did you find Gold? Optional",
    discoveryLabels: {
      friends: "Friends",
      instagram: "Instagram",
      venue: "A venue",
      search: "Search",
      other: "Other",
    } satisfies Record<DiscoverySource, string>,
    newsletter: "Yes, I also want the Gold of Sicily newsletter.",
    submit: "Let me know when I can order",
    submitting: "Saving …",
    doneLaunch: "You’re on the list. We’ll write when you can order.",
    doneRestock: "You’re on the list. We’ll write when this flavour is back.",
    doneBoth: "You’re on the list. We’ll write when you can order, and when this flavour is back.",
    invalid: "Check the email address.",
    unavailable: "The list is not open in the portal yet.",
    error: "We couldn’t save that. Try again.",
    trust: ["Delivered frozen", "Developed and produced in Oslo", "Price includes VAT"],
    how: "How it works",
    steps: [
      { title: "Choose your favourites", body: "’Nduja & mozzarella, or truffle & champignon." },
      {
        title: "Pickup and delivery",
        body: "Pickup is outside Smalgangen 31, 0188 Oslo. Delivery is settled before an order can be paid.",
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
const NOTICE_ID = "shop-notice";
const EMAIL_ID = "shop-email";
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--olive)]";

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
        slug === "nduja" ? "bg-[color:var(--tomato)]" : "bg-[color:var(--golden)]"
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
    <figure className="relative">
      <img
        src={slide.src}
        alt={copy.photo[slide.id]}
        className={`w-full bg-[color:var(--paper)] object-center ${
          slide.kind === "box" ? "object-contain" : "object-cover"
        } h-[26vh] min-h-40 max-h-48 sm:h-80 lg:h-[min(70vh,38rem)] lg:max-h-none`}
      />
      {slides.length > 1 ? (
        <div className="absolute bottom-3 left-3 flex gap-2">
          {slides.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`${copy.slide} ${itemIndex + 1}`}
                aria-pressed={active}
                onClick={() => setIndex(itemIndex)}
                className={`h-11 w-11 overflow-hidden border bg-[color:var(--cream)] ${focusRing} ${
                  active ? "border-foreground" : "border-transparent opacity-80"
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
  launchNotice,
  restockNotice,
}: {
  lang: Lang;
  flavor: ShopFlavorSlug;
  launchNotice: boolean;
  restockNotice: boolean;
}) {
  const copy = COPY[lang];
  const submit = useServerFn(submitShopWaitlist);
  const [email, setEmail] = useState("");
  const [discovery, setDiscovery] = useState<DiscoverySource | "">("");
  const [newsletter, setNewsletter] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!launchNotice && !restockNotice) return;
    setStatus("loading");
    try {
      await submit({
        data: {
          email,
          flavor,
          lang,
          ...(discovery ? { discovery } : {}),
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

  return (
    <>
      {status === "done" ? (
        <p className="mt-6 text-base italic leading-relaxed text-foreground/80">{message}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <label className="block font-sans text-base" htmlFor={EMAIL_ID}>
            <span className="mb-1 block text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
              {copy.email}
            </span>
            <input
              id={EMAIL_ID}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
              className={`min-h-12 w-full border-b border-foreground/30 bg-transparent py-3 text-lg outline-none ${focusRing}`}
            />
          </label>
          <label className="flex min-h-11 items-start gap-3 font-sans text-sm leading-snug">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(event) => setNewsletter(event.target.checked)}
              className={`mt-1 h-4 w-4 ${focusRing}`}
            />
            <span>{copy.newsletter}</span>
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className={`min-h-12 bg-[color:var(--olive)] px-4 py-4 font-display text-xl italic tracking-tight text-[color:var(--cream)] disabled:opacity-40 ${focusRing}`}
          >
            {status === "loading" ? copy.submitting : copy.submit}
          </button>
          <details className="font-sans text-sm text-foreground/70">
            <summary className={`cursor-pointer py-1 ${focusRing}`}>
              {copy.discoveryOptional}
            </summary>
            <label className="mt-3 block">
              <span className="sr-only">{copy.discovery}</span>
              <select
                value={discovery}
                onChange={(event) => setDiscovery(event.target.value as DiscoverySource | "")}
                className={`min-h-11 w-full border-b border-foreground/30 bg-transparent py-2 text-base outline-none ${focusRing}`}
              >
                <option value="">{copy.discoveryOptional}</option>
                {DISCOVERY_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {copy.discoveryLabels[source]}
                  </option>
                ))}
              </select>
            </label>
          </details>
          {status === "error" ? (
            <p className="font-sans text-sm text-[color:var(--tomato)]">{message}</p>
          ) : null}
        </form>
      )}
    </>
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
    <dl className="mt-4 flex flex-col gap-4 pb-2">
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
    <details className="group mt-12 border-t border-foreground/10">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between py-4 font-display text-2xl tracking-tight ${focusRing}`}
      >
        {copy.factsTitle}
        <span aria-hidden className="text-xl text-foreground/45 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="text-lg italic">{name}</p>
      <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
        {facts.verified ? copy.confirmed : copy.preliminary}
      </p>
      {facts.verified ? null : (
        <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground/75">
          {copy.factsNote}
        </p>
      )}
      <FactBlocks lang={lang} facts={facts} />
    </details>
  );
}

function NoticeJump({
  lang,
  watch,
  targetId = NOTICE_ID,
  label,
  focusId = EMAIL_ID,
}: {
  lang: Lang;
  watch: string;
  targetId?: string;
  label?: string;
  focusId?: string;
}) {
  const copy = COPY[lang];
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById(targetId);
    if (!form) return;
    const barClearance = 64;
    const update = () => {
      const formBox = form.getBoundingClientRect();
      const stockBox = document.querySelector("[data-shop-stock]")?.getBoundingClientRect();
      const formOutside = formBox.bottom <= 0 || formBox.top >= window.innerHeight;
      const stockAboveBar = !stockBox || stockBox.bottom <= window.innerHeight - barClearance;
      setShow(formOutside && stockAboveBar);
    };
    update();
    const observer = new IntersectionObserver(update, { threshold: 0 });
    observer.observe(form);
    const stock = document.querySelector("[data-shop-stock]");
    if (stock) observer.observe(stock);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [watch, targetId]);

  if (!show) return null;

  return (
    <div className="shop-notice-bar fixed inset-x-0 bottom-0 z-30 border-t border-foreground/10 bg-[color:var(--cream)] px-4 py-2 lg:hidden">
      <a
        href={`#${targetId}`}
        className={`flex min-h-11 items-center justify-center bg-[color:var(--olive)] px-4 font-display text-lg italic text-[color:var(--cream)] ${focusRing}`}
        onClick={(event) => {
          event.preventDefault();
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
          if (focusId) document.getElementById(focusId)?.focus();
          else document.getElementById(targetId)?.querySelector("input")?.focus();
        }}
      >
        {label ?? copy.submit}
      </a>
    </div>
  );
}

const ORDER_ID = "shop-order";

function OrderForm({
  lang,
  flavor,
  boxes,
  bindingOpen,
  bindingLabel,
}: {
  lang: Lang;
  flavor: ShopFlavorSlug;
  boxes: number;
  bindingOpen: boolean;
  bindingLabel: string;
}) {
  const copy = COPY[lang];
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery_request">("pickup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState<Awaited<ReturnType<typeof postDeliveryQuote>>>(null);
  const [quoting, setQuoting] = useState(false);
  const pricedDelivery = fulfillment === "delivery_request" && quote?.freightOre != null;
  const binding = bindingOpen && (fulfillment === "pickup" || pricedDelivery);

  useEffect(() => {
    if (fulfillment !== "delivery_request") {
      setQuote(null);
      setQuoting(false);
      return;
    }
    const postal = postalCode.replace(/\s/g, "");
    if (addressLine.trim().length < 4 || !/^\d{4}$/.test(postal) || city.trim().length < 2) {
      setQuote(null);
      setQuoting(false);
      return;
    }
    let cancel = false;
    setQuoting(true);
    const timer = window.setTimeout(() => {
      void postDeliveryQuote({ addressLine, postalCode: postal, city, boxes }).then((next) => {
        if (cancel) return;
        setQuote(next);
        setQuoting(false);
      });
    }, 400);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, [addressLine, boxes, city, fulfillment, postalCode]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    const result = await postShopOrder({
      flavor,
      boxes,
      name,
      email,
      phone,
      addressLine,
      postalCode,
      city,
      ...(orgNumber.trim() ? { orgNumber } : {}),
      fulfillment,
      lang,
    });
    if (result.ok) {
      setStatus("done");
      const lead = result.kind === "binding" ? copy.receivedBinding : copy.receivedQuote;
      const price =
        result.totalOre != null && result.freightOre != null
          ? ` ${formatShopPrice(result.totalOre)} ${copy.deliveryPriced}.`
          : "";
      setMessage(result.number ? `${result.number}. ${lead}${price}` : `${lead}${price}`);
      return;
    }
    setStatus("error");
    setMessage(
      result.reason === "short"
        ? copy.short
        : result.reason === "invalid"
          ? copy.orderInvalid
          : copy.orderUnavailable,
    );
  }

  if (status === "done") {
    return (
      <p className="mt-6 text-lg italic leading-snug" role="status">
        {message}
      </p>
    );
  }

  return (
    <form id={ORDER_ID} className="mt-6 flex flex-col gap-3" onSubmit={onSubmit}>
      <p className="text-base italic text-foreground/75">
        {binding ? copy.bindingNote : copy.requestNote}
      </p>
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">{copy.pickup}</legend>
        <label className="flex min-h-11 items-center gap-3 text-base">
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "pickup"}
            onChange={() => setFulfillment("pickup")}
          />
          {copy.pickup}
        </label>
        <label className="flex min-h-11 items-center gap-3 text-base">
          <input
            type="radio"
            name="fulfillment"
            checked={fulfillment === "delivery_request"}
            onChange={() => setFulfillment("delivery_request")}
          />
          {copy.delivery}
        </label>
      </fieldset>
      {fulfillment === "pickup" ? (
        <p className="text-sm italic text-foreground/70">{copy.pickupNote}</p>
      ) : (
        <p className="text-sm italic text-foreground/70">{copy.deliveryNote}</p>
      )}
      <Field label={copy.name} value={name} onChange={setName} autoComplete="name" />
      <Field
        label={copy.email}
        value={email}
        onChange={setEmail}
        type="email"
        autoComplete="email"
      />
      <Field label={copy.phone} value={phone} onChange={setPhone} type="tel" autoComplete="tel" />
      <Field
        label={copy.address}
        value={addressLine}
        onChange={setAddressLine}
        autoComplete="street-address"
      />
      <Field
        label={copy.postal}
        value={postalCode}
        onChange={setPostalCode}
        autoComplete="postal-code"
      />
      <Field label={copy.city} value={city} onChange={setCity} autoComplete="address-level2" />
      {fulfillment === "delivery_request" && quoting ? (
        <p className="text-sm italic text-foreground/70">{copy.deliveryQuote}</p>
      ) : null}
      {fulfillment === "delivery_request" && quote?.freightOre != null && quote.totalOre != null ? (
        <p className="text-sm italic text-foreground/70">
          {formatShopPrice(quote.freightOre)} · {formatShopPrice(quote.totalOre)}{" "}
          {copy.deliveryPriced}
        </p>
      ) : null}
      {fulfillment === "delivery_request" && quote && quote.freightOre == null ? (
        <p className="text-sm italic text-foreground/70">{copy.deliveryOutside}</p>
      ) : null}
      <Field label={copy.org} value={orgNumber} onChange={setOrgNumber} />
      {status === "error" ? (
        <p className="text-base italic text-[color:var(--tomato)]" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className={`min-h-12 w-full bg-[color:var(--olive)] px-4 py-4 font-display text-xl italic tracking-tight text-[color:var(--cream)] disabled:opacity-60 ${focusRing}`}
      >
        {status === "loading" ? copy.submitting : binding ? bindingLabel : copy.request}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55">{label}</span>
      <input
        required={label !== COPY.no.org && label !== COPY.en.org}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={`min-h-12 border border-foreground/20 bg-transparent px-3 ${focusRing}`}
      />
    </label>
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
  const inStock = shop.stockKnown && boxes > 0;
  const stockLine = fiftyStockLine(lang, boxes, shop.stockKnown, shop.bindingOpen);

  return (
    <div className="min-h-screen bg-[color:var(--cream)] pb-16 font-display text-foreground lg:pb-0">
      <BrandNav lang={lang} />
      <main className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-3 flex justify-end">
          {lang === "no" ? (
            <Link to="/en/buy" className={`text-base italic text-[color:var(--sea)] ${focusRing}`}>
              {copy.langLabel}
            </Link>
          ) : (
            <Link to="/kjop" className={`text-base italic text-[color:var(--sea)] ${focusRing}`}>
              {copy.langLabel}
            </Link>
          )}
        </div>

        <div className="lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-start lg:gap-x-14 lg:gap-y-8">
          <div className="-mx-5 md:mx-0 lg:col-start-1 lg:row-start-1">
            <Gallery lang={lang} />
          </div>

          <div className="pt-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-0">
            <h1 className="font-display text-[clamp(2.6rem,8vw,4.2rem)] leading-[1.02] tracking-tight">
              {copy.title}
            </h1>
            <p className="mt-2 font-display text-2xl italic leading-snug tracking-tight text-[color:var(--sea)] md:text-3xl">
              {copy.sub}
            </p>
            <p className="mt-3 max-w-md text-base leading-relaxed text-foreground/75 md:text-lg">
              {copy.body}
            </p>

            <fieldset className="mt-4">
              <legend className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
                {copy.taste}
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {shop.flavors.map((item) => {
                  const active = item.slug === flavor;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFlavor(item.slug)}
                      className={`flex min-h-12 items-center gap-3 border px-3 py-3 text-left text-lg italic leading-tight ${focusRing} ${
                        active ? "border-foreground" : "border-foreground/15"
                      }`}
                    >
                      <FlavorDot slug={item.slug} />
                      {flavorName(shop, item.slug, lang)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
                {copy.size}
              </legend>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <div className="border border-foreground px-3 py-3">
                  <div className="flex min-h-12 items-center justify-between gap-3">
                    <span className="flex items-center gap-3 text-lg italic">
                      <span
                        aria-hidden
                        className="inline-block h-2 w-2 rounded-full bg-foreground"
                      />
                      {copy.fifty}
                    </span>
                    <span className="font-display text-xl tracking-tight">
                      {formatShopPrice(PRICE_FIFTY_ORE)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/55">
                    {piecePriceLine(lang)} · {copy.vat}
                  </p>
                  {soldOut ? null : (
                    <p
                      data-shop-stock
                      className="mt-2 text-sm leading-snug text-foreground/75"
                      aria-live="polite"
                    >
                      {stockLine}
                    </p>
                  )}
                </div>
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

            <div className="mt-5 flex items-center justify-between gap-4">
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
                  className={`h-11 w-11 border border-foreground/25 font-display text-2xl leading-none disabled:opacity-30 ${focusRing}`}
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
                  className={`h-11 w-11 border border-foreground/25 font-display text-2xl leading-none disabled:opacity-30 ${focusRing}`}
                >
                  +
                </button>
              </div>
            </div>

            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.2em] text-foreground/55">
              {copy.total}
            </p>
            <p className="font-display text-5xl tracking-tight" aria-live="polite">
              {formatShopPrice(orderTotalOre(shownQty))}
            </p>
            <p className="mt-1 text-sm text-foreground/55">
              {formatShopPrice(PRICE_FIFTY_ORE)} {copy.perBox} · {copy.vat}
            </p>

            {soldOut ? (
              <p
                data-shop-stock
                className="mt-5 whitespace-pre-line font-display text-[clamp(1.45rem,4vw,1.9rem)] italic leading-snug tracking-tight"
                aria-live="polite"
              >
                {stockLine}
              </p>
            ) : null}
            {!shop.bindingOpen && !soldOut ? (
              <p className="mt-4 text-base italic text-foreground/70">{copy.closed}</p>
            ) : null}

            <ul className="mt-4 flex flex-col gap-1 text-base italic text-foreground/70">
              {copy.trust.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {inStock ? (
              <OrderForm
                lang={lang}
                flavor={flavor}
                boxes={shownQty}
                bindingOpen={shop.bindingOpen}
                bindingLabel={orderCta(lang, shownQty)}
              />
            ) : (
              <div id={NOTICE_ID} className="scroll-mt-28">
                <NoticeForm
                  key={`${flavor}-${soldOut ? "out" : "in"}`}
                  lang={lang}
                  flavor={flavor}
                  launchNotice={!shop.stockKnown || !soldOut}
                  restockNotice={soldOut}
                />
              </div>
            )}
            {inStock && !shop.bindingOpen ? (
              <div id={NOTICE_ID} className="scroll-mt-28">
                <NoticeForm
                  key={`${flavor}-launch`}
                  lang={lang}
                  flavor={flavor}
                  launchNotice
                  restockNotice={false}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-14 lg:col-start-1 lg:row-start-2 lg:mt-0">
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
      </main>
      <BrandFooter lang={lang} />
      {inStock ? (
        <NoticeJump
          lang={lang}
          watch={flavor}
          targetId={ORDER_ID}
          label={shop.bindingOpen ? orderCta(lang, shownQty) : copy.request}
          focusId=""
        />
      ) : (
        <NoticeJump lang={lang} watch={flavor} />
      )}
    </div>
  );
}

function HowItWorks({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section>
      <h2 className="font-display text-3xl tracking-tight">{copy.how}</h2>
      <ol className="mt-6 flex flex-col gap-6">
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
