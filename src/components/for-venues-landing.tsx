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
    heroTitleLine1: "Siciliansk arancini",
    heroTitleLine2: "for serveringssteder.",
    heroSub: "Enkel å tilberede. Lett å sette på menyen.",
    callCta: "Ring 45 25 12 80",
    mailCta: "Send e-post",
    heroAlt: "Arancini servert med drikke",
    productEyebrow: "Hva Gold er",
    productTitle: "Frossen arancini. To smaker. Klar på få minutter.",
    productBody:
      "Gold of Sicily er håndlagde sicilianske arancini, utviklet og produsert i Norge. De kommer frosne, i to smaker, og tilberedes på få minutter. Server som snack, sharing eller en mindre matrett.",
    flavors: ["'Nduja mozzarella", "Trøffel & sjampinjong"],
    productAlt: "Arancini klar til å spises",
    offerEyebrow: "To måter",
    offerTitle: "Gold Partner eller Gold Supply",
    offerBody:
      "To enkle måter å få Gold på menyen. Velg om dere vil ha hjelp med å komme i gang, eller om dere bare vil ha produktet levert.",
    offerPartner: "Gold Partner",
    offerPartnerBody:
      "For dere som vil ha hjelp med oppstart. Vi hjelper med serveringsoppsett, meny, materiell og hvordan Gold fungerer best hos dere.",
    offerSupply: "Gold Supply",
    offerSupplyBody:
      "For dere som bare vil ha Gold levert. Dere får produktet gjennom distribusjon og står selv for oppsett, meny og servering.",
    offerNote:
      "Steder som serverer Gold kan vises på kartet og få en stedsside — uavhengig av modell.",
    offerRows: [
      { label: "Arancini", partner: true, supply: true },
      { label: "Levering", partner: true, supply: true },
      { label: "Hjelp med oppstart", partner: true, supply: false },
      { label: "Serveringsoppsett", partner: true, supply: false },
      { label: "Meny og materiell", partner: true, supply: false },
      { label: "Oppfølging", partner: true, supply: false },
    ],
    exampleEyebrow: "Ett ekte eksempel",
    exampleName: "Oslo Bar & Bowling",
    exampleBody:
      "De hadde pizza, men manglet en enkel mindre snack. Gold ble satt inn som et raskt alternativ ved siden av eksisterende meny.",
    exampleCta: "Se stedet",
    exampleAlt: "Arancini servert hos Oslo Bar & Bowling",
    exampleTo: "/steder/oslo-bar-bowling" as const,
    contactEyebrow: "Kontakt",
    contactTitle: "Vil du teste Gold hos dere?",
    contactBody: "Ring Peder på 45 25 12 80 eller send e-post til mail@goldofsicily.no.",
  },
  en: {
    eyebrow: "For venues",
    heroTitleLine1: "Sicilian arancini",
    heroTitleLine2: "for venues.",
    heroSub: "Simple to prepare. Easy to put on the menu.",
    callCta: "Call 45 25 12 80",
    mailCta: "Send email",
    heroAlt: "Arancini served with a drink",
    productEyebrow: "What Gold is",
    productTitle: "Frozen arancini. Two flavours. Ready in minutes.",
    productBody:
      "Gold of Sicily is handmade Sicilian arancini, developed and produced in Norway. They arrive frozen, in two flavours, and are prepared in a few minutes. Serve as a snack, for sharing, or as a smaller dish.",
    flavors: ["'Nduja mozzarella", "Truffle & champignon"],
    productAlt: "Arancini ready to eat",
    offerEyebrow: "Two ways",
    offerTitle: "Gold Partner or Gold Supply",
    offerBody:
      "Two simple ways to get Gold on the menu. Choose whether you want help getting started, or whether you just want the product delivered.",
    offerPartner: "Gold Partner",
    offerPartnerBody:
      "For venues that want help getting started. We help with serving setup, menu, materials, and how Gold works best at your place.",
    offerSupply: "Gold Supply",
    offerSupplyBody:
      "For venues that just want Gold delivered. You get the product through distribution and handle setup, menu and serving yourselves.",
    offerNote:
      "Venues that serve Gold can appear on the map and get a venue page — regardless of model.",
    offerRows: [
      { label: "Arancini", partner: true, supply: true },
      { label: "Delivery", partner: true, supply: true },
      { label: "Help getting started", partner: true, supply: false },
      { label: "Serving setup", partner: true, supply: false },
      { label: "Menu and materials", partner: true, supply: false },
      { label: "Follow-up", partner: true, supply: false },
    ],
    exampleEyebrow: "One real example",
    exampleName: "Oslo Bar & Bowling",
    exampleBody:
      "They had pizza, but lacked a simple smaller snack. Gold was added as a fast option beside the existing menu.",
    exampleCta: "See the venue",
    exampleAlt: "Arancini served at Oslo Bar & Bowling",
    exampleTo: "/steder/oslo-bar-bowling" as const,
    contactEyebrow: "Contact",
    contactTitle: "Want to try Gold at your place?",
    contactBody: "Call Peder on 45 25 12 80 or send an email to mail@goldofsicily.no.",
  },
} as const;

const sectionPad = "mx-auto px-5 py-16 md:px-8 md:py-24";

const phoneHref = "tel:45251280";
const mailHref = `mailto:${SITE.email}`;

function ContactCtas({ lang, invert = false, className = "" }: { lang: Lang; invert?: boolean; className?: string }) {
  const t = COPY[lang];
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={phoneHref} className="btn-gold btn-gold-solid">
        {t.callCta}
      </a>
      <a href={mailHref} className={`btn-gold ${invert ? "btn-gold-ghost-invert" : "btn-gold-ghost"}`}>
        {t.mailCta}
      </a>
    </div>
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
              <span className="block md:whitespace-nowrap">{t.heroTitleLine1}</span>
              <span className="block md:whitespace-nowrap">{t.heroTitleLine2}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/75 md:text-xl">
              {t.heroSub}
            </p>
            <ContactCtas lang={lang} className="mt-8" />
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
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl tracking-tight">{t.offerPartner}</h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/75">{t.offerPartnerBody}</p>
            </div>
            <div>
              <h3 className="font-display text-2xl tracking-tight">{t.offerSupply}</h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/75">{t.offerSupplyBody}</p>
            </div>
          </div>
          <div className="mt-10 overflow-x-auto border border-foreground/15 bg-background">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-foreground/15">
                  <th className="px-4 py-3 font-medium" />
                  <th className="px-4 py-3 font-display text-base">{t.offerPartner}</th>
                  <th className="px-4 py-3 font-display text-base">{t.offerSupply}</th>
                </tr>
              </thead>
              <tbody>
                {t.offerRows.map((row) => (
                  <tr key={row.label} className="border-b border-foreground/10 last:border-0">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3">{row.partner ? "✓" : "—"}</td>
                    <td className="px-4 py-3">{row.supply ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-foreground/55">{t.offerNote}</p>
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
          <p className="mx-auto mt-5 max-w-lg text-base text-background/70">{t.contactBody}</p>
          <ContactCtas lang={lang} invert className="mt-10 justify-center" />
        </div>
      </section>

      <BrandFooter lang={lang} />
    </main>
  );
}
