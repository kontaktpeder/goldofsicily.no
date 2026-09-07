import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { SITE } from "@/lib/site";

import imgMedDrikke from "@/assets/b2b-med-drikke.jpg";
import imgSpiseklar from "@/assets/b2b-spiseklar.jpg";
import imgPaFat from "@/assets/b2b-pa-fat.jpg";

type Lang = "no" | "en";

const COPY = {
  no: {
    eyebrow: "For serveringssteder",
    heroTitle: "Siciliansk arancini for serveringssteder.",
    heroSub: "Enkel å tilberede. Lett å sette på menyen.",
    cta: "Kontakt oss",
    mailSubject: "Gold til serveringssted",
    heroAlt: "Arancini servert med drikke",
    productEyebrow: "Hva Gold er",
    productTitle: "Frossen arancini. To smaker. Klar på få minutter.",
    productBody:
      "Gold of Sicily er håndlagde sicilianske arancini, utviklet og produsert i Norge. De kommer frosne, i to smaker, og tilberedes på få minutter. Server som snack, sharing eller en mindre matrett. Airfryer er én måte å varme dem på — ikke konseptet.",
    flavors: ["'Nduja", "Trøffel & sjampinjong"],
    productAlt: "Arancini klar til å spises",
    offerEyebrow: "To måter",
    offerTitle: "Gold Partner eller levering.",
    offerBody:
      "Alle steder som serverer Gold vises på kartet. Gold Partner får produkt, meny og materiell, foto og video, synlighet og et samarbeid om hvordan dere serverer. Levering er kjøp via distribusjon — stedet vises fortsatt, uten partnersamarbeid.",
    offerPartner: "Gold Partner",
    offerDelivery: "Levering",
    offerRows: [
      { label: "Arancini", partner: true, delivery: true },
      { label: "Oppføring på kart", partner: true, delivery: true },
      { label: "Egen stedsside", partner: true, delivery: true },
      { label: "Meny og materiell", partner: true, delivery: false },
      { label: "Foto og video", partner: true, delivery: false },
      { label: "Samarbeid om servering", partner: true, delivery: false },
    ],
    exampleEyebrow: "Ett ekte eksempel",
    exampleName: "Oslo Bar & Bowling",
    exampleBody:
      "De hadde pizza, men manglet en enkel mindre snack. Gold ble satt inn som et raskt alternativ ved siden av eksisterende meny.",
    exampleCta: "Se stedet",
    exampleAlt: "Arancini servert hos Oslo Bar & Bowling",
    exampleTo: "/steder/oslo-bar-bowling" as const,
    contactEyebrow: "Kontakt",
    contactTitle: "Vil du teste Gold på ditt serveringssted?",
    contactBody: "Kontakt Peder / Villa Import.",
    orWrite: "Eller skriv til",
    call: "Ring",
  },
  en: {
    eyebrow: "For venues",
    heroTitle: "Sicilian arancini for venues.",
    heroSub: "Simple to prepare. Easy to put on the menu.",
    cta: "Contact us",
    mailSubject: "Gold for venues",
    heroAlt: "Arancini served with a drink",
    productEyebrow: "What Gold is",
    productTitle: "Frozen arancini. Two flavours. Ready in minutes.",
    productBody:
      "Gold of Sicily is handmade Sicilian arancini, developed and produced in Norway. They arrive frozen, in two flavours, and are prepared in a few minutes. Serve as a snack, for sharing, or as a smaller dish. An air fryer is one way to heat them — not the concept.",
    flavors: ["'Nduja", "Truffle & champignon"],
    productAlt: "Arancini ready to eat",
    offerEyebrow: "Two ways",
    offerTitle: "Gold Partner or delivery.",
    offerBody:
      "Every venue that serves Gold appears on the map. Gold Partner gets the product, menu materials, photo and video, visibility and a collaboration on how you serve. Delivery is buying through distribution — the venue is still listed, without a partnership.",
    offerPartner: "Gold Partner",
    offerDelivery: "Delivery",
    offerRows: [
      { label: "Arancini", partner: true, delivery: true },
      { label: "Map listing", partner: true, delivery: true },
      { label: "Venue page", partner: true, delivery: true },
      { label: "Menu and materials", partner: true, delivery: false },
      { label: "Photo and video", partner: true, delivery: false },
      { label: "Service collaboration", partner: true, delivery: false },
    ],
    exampleEyebrow: "One real example",
    exampleName: "Oslo Bar & Bowling",
    exampleBody:
      "They had pizza, but lacked a simple smaller snack. Gold was added as a fast option beside the existing menu.",
    exampleCta: "See the venue",
    exampleAlt: "Arancini served at Oslo Bar & Bowling",
    exampleTo: "/steder/oslo-bar-bowling" as const,
    contactEyebrow: "Contact",
    contactTitle: "Want to try Gold at your venue?",
    contactBody: "Contact Peder / Villa Import.",
    orWrite: "Or write to",
    call: "Call",
  },
} as const;

const sectionPad = "mx-auto px-5 py-16 md:px-8 md:py-24";

function mailHref(subject: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}

function ContactCta({ lang, className = "" }: { lang: Lang; className?: string }) {
  const t = COPY[lang];
  return (
    <a href={mailHref(t.mailSubject)} className={`btn-gold btn-gold-solid ${className}`}>
      {t.cta}
    </a>
  );
}

export function ForVenuesLanding({ lang = "no" }: { lang?: Lang }) {
  const t = COPY[lang];

  return (
    <main className="min-h-screen bg-[color:var(--cream)] font-display text-foreground">
      <BrandNav lang={lang} />

      <section className="border-b border-foreground/15">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:px-8 md:py-24">
          <div className="min-w-0">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="mt-4 font-display text-[clamp(2.1rem,6.5vw,4.25rem)] leading-[1.02] tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/75 md:text-xl">
              {t.heroSub}
            </p>
            <ContactCta lang={lang} className="mt-8" />
          </div>
          <img
            src={imgMedDrikke}
            alt={t.heroAlt}
            className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
          />
        </div>
      </section>

      <section className="border-b border-foreground/15 bg-[color:var(--paper)]">
        <div className={`${sectionPad} grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16`}>
          <img
            src={imgSpiseklar}
            alt={t.productAlt}
            className="order-2 aspect-[5/4] w-full object-cover md:order-1 md:aspect-[4/5]"
            loading="lazy"
          />
          <div className="order-1 md:order-2">
            <p className="eyebrow">{t.productEyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight">
              {t.productTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {t.productBody}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              {t.flavors.map((flavor) => (
                <li key={flavor} className="font-display text-2xl italic tracking-tight md:text-3xl">
                  {flavor}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-foreground/15">
        <div className={`${sectionPad} max-w-4xl`}>
          <p className="eyebrow">{t.offerEyebrow}</p>
          <h2 className="mt-3 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight">
            {t.offerTitle}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/75 md:text-lg">
            {t.offerBody}
          </p>
          <div className="mt-10 overflow-x-auto border border-foreground/15 bg-background">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/15">
                  <th className="px-4 py-3 font-medium" />
                  <th className="px-4 py-3 font-display text-base">{t.offerPartner}</th>
                  <th className="px-4 py-3 font-display text-base">{t.offerDelivery}</th>
                </tr>
              </thead>
              <tbody>
                {t.offerRows.map((row) => (
                  <tr key={row.label} className="border-b border-foreground/10 last:border-0">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3">{row.partner ? "✓" : "—"}</td>
                    <td className="px-4 py-3">{row.delivery ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-foreground/15 bg-[color:var(--paper)]">
        <div className={`${sectionPad} grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16`}>
          <div>
            <p className="eyebrow">{t.exampleEyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight">
              {t.exampleName}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/75 md:text-lg">
              {t.exampleBody}
            </p>
            <Link
              to={t.exampleTo}
              className="mt-8 inline-block text-lg italic underline-offset-4 hover:underline"
            >
              {t.exampleCta} →
            </Link>
          </div>
          <img
            src={imgPaFat}
            alt={t.exampleAlt}
            className="aspect-[5/4] w-full object-cover md:aspect-[4/5]"
            loading="lazy"
          />
        </div>
      </section>

      <section id="kontakt" className="bg-foreground text-background">
        <div className={`${sectionPad} max-w-3xl text-center md:py-28`}>
          <p className="eyebrow text-background/55">{t.contactEyebrow}</p>
          <h2 className="mt-3 font-display text-[clamp(1.85rem,5vw,3.25rem)] leading-[1.08] tracking-tight">
            {t.contactTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-background/70">{t.contactBody}</p>
          <ContactCta lang={lang} className="mt-10" />
          <p className="mt-6 text-sm text-background/55">
            {t.call}{" "}
            <a href={`tel:${SITE.phoneTel}`} className="underline underline-offset-2">
              {SITE.phoneLabel}
            </a>
            . {t.orWrite}{" "}
            <a href={mailHref(t.mailSubject)} className="underline underline-offset-2">
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </section>

      <BrandFooter lang={lang} />
    </main>
  );
}
