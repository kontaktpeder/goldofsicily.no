export type BrandLang = "no" | "en";

export type ServeCardKey = "product" | "serve" | "menu" | "follow";

const navNo = {
  arancini: "Arancini",
  find: "Hvor serveres Gold?",
  about: "Om oss",
  venues: "For serveringssteder",
  menu: "Meny",
  close: "Lukk",
};

const navEn = {
  arancini: "Arancini",
  find: "Where is Gold served?",
  about: "About",
  venues: "For venues",
  menu: "Menu",
  close: "Close",
};

export const BRAND = {
  no: {
    nav: navNo,
    paths: {
      home: "/",
      arancini: "/arancini",
      find: "/finn-oss",
      about: "/about",
      venues: "/for-serveringssteder",
    },
    hero: {
      sub: "Sicilianske arancini, utviklet og produsert i Oslo.",
      subLine: "Klare for ditt serveringssted.",
      findCta: "Hvor serveres Gold?",
      venuesCta: "For ditt serveringssted",
      findBefore: "Hvor serveres ",
      findAfter: "?",
      venuesBefore: "For ",
      venuesMark: "ditt",
      venuesAfter: " serveringssted",
    },
    gold: {
      title: "Arancini",
      body: "Sprø utenpå. Myk inni.",
      flavors: ["'Nduja mozzarella", "Trøffel & sjampinjong"],
      cta: "Hva er arancini?",
      photoAlt: "Seks sprø arancini på et mørkt brett",
    },
    world: {
      body: "Vi tar med oss mer enn en siciliansk mattradisjon. Gold of Sicily er vår versjon av den italienske, uanstrengte elegansen: gode råvarer, tydelige smaker og enkel servering. Utviklet og produsert i Norge, med Sicilia som utgangspunkt.",
      photoAlt: "Arancini holdt i hendene, klar til å spises",
    },
    same: {
      line1: "Ulike steder.",
      line2Before: "Samme ",
      line2Mark: "Gold",
      line2After: ".",
      body: "Når Gold of Sicily står på menyen, skal du kjenne det igjen. Samme produkt. Samme uttrykk. Samme standard.",
      photoAlt: "Arancini servert med kald drikke i baren",
    },
    find: {
      titleBefore: "Hvor serveres ",
      titleMark: "Gold",
      titleAfter: "?",
      body: "Finn Gold of Sicily hos utvalgte serveringssteder.",
      more: "Se alle serveringssteder",
      pageBody:
        "Finn barer, restauranter og andre serveringssteder som serverer Gold of Sicily-arancini i Oslo og resten av Norge.",
    },
    serve: {
      eyebrowBefore: "For ",
      eyebrowMark: "ditt",
      eyebrowAfter: " serveringssted",
      title: "Mer enn arancini.",
      body: "Et gjennomført produkt, med et enkelt system rundt.",
      cards: [
        {
          key: "product" as const,
          title: "Produkt",
          body: "Håndlagde sicilianske arancini, klare på få minutter.",
        },
        {
          key: "serve" as const,
          title: "Servering",
          body: "Enkel tilberedning, lite utstyr og fast fremgangsmåte.",
        },
        {
          key: "menu" as const,
          title: "Meny & uttrykk",
          body: "Menytekst, produktbilder og materiell tilpasset stedet.",
        },
        {
          key: "follow" as const,
          title: "Oppfølging",
          body: "Opplæring, levering og forbedring basert på det som faktisk selger.",
        },
      ],
      cta: "Se løsningen for serveringssteder",
    },
    footer: {
      instagram: "Instagram",
      tiktok: "TikTok",
      copyright: "© 2026 Gold of Sicily",
    },
    about: {
      eyebrow: "Om oss",
      manifesto: [
        "Vi tar med oss mer enn en siciliansk mattradisjon. Gold of Sicily er vår versjon av den italienske, uanstrengte elegansen: gode råvarer, tydelige smaker og enkel servering. Utviklet og produsert i Norge, med Sicilia som utgangspunkt.",
      ],
      storyHeading: "Historien",
      story: [
        "Den begynte da Denis kom til Norge og lurte på hvorfor pizza og pasta var selvsagt — mens arancini nesten ikke fantes.",
        "Første kveld i Oslo bekreftet det vi håpet: folk vil sitte med dette. Nå lager vi Gold of Sicily som et ferdig konsept for steder som vil servere den følelsen, ikke bare en eske mat.",
      ],
      proof: "Første smaking: 4,5/5.",
      ctaFind: "Hvor serveres Gold?",
      ctaIg: "Instagram",
    },
    aranciniPage: {
      seoGuard:
        "I Oslo møter du arancini som siciliansk street food: sprø skorpe, varm ris og fyll som skal spises med hendene. Gold of Sicily lager dem med samme håndverk, servert på barer og steder rundt i byen.",
    },
  },
  en: {
    nav: navEn,
    paths: {
      home: "/en",
      arancini: "/arancini",
      find: "/en/find-us",
      about: "/en/about",
      venues: "/en/for-venues",
    },
    hero: {
      sub: "Sicilian arancini, developed and produced in Oslo.",
      subLine: "Ready for your venue.",
      findCta: "Where is Gold served?",
      venuesCta: "For your venue",
      findBefore: "Where is ",
      findAfter: " served?",
      venuesBefore: "For ",
      venuesMark: "your",
      venuesAfter: " venue",
    },
    gold: {
      title: "Arancini",
      body: "Crisp outside. Soft inside.",
      flavors: ["'Nduja mozzarella", "Truffle & champignon"],
      cta: "What is arancini?",
      photoAlt: "Six crisp arancini on a dark tray",
    },
    world: {
      body: "We bring more than a Sicilian food tradition. Gold of Sicily is our version of that Italian, unforced elegance: good ingredients, clear flavours and simple service. Developed and produced in Norway, with Sicily as the starting point.",
      photoAlt: "Arancini held in hands, ready to eat",
    },
    same: {
      line1: "Different places.",
      line2Before: "Same ",
      line2Mark: "Gold",
      line2After: ".",
      body: "When Gold of Sicily is on the menu, you should recognise it. Same product. Same look. Same standard.",
      photoAlt: "Arancini served with a cold drink at the bar",
    },
    find: {
      titleBefore: "Where is ",
      titleMark: "Gold",
      titleAfter: " served?",
      body: "Find Gold of Sicily at selected venues.",
      more: "See all venues",
      pageBody:
        "Find bars, restaurants and other venues serving Gold of Sicily arancini in Oslo and across Norway.",
    },
    serve: {
      eyebrowBefore: "For ",
      eyebrowMark: "your",
      eyebrowAfter: " venue",
      title: "More than arancini.",
      body: "A complete product, with a simple system around it.",
      cards: [
        {
          key: "product" as const,
          title: "Product",
          body: "Handmade Sicilian arancini, ready in minutes.",
        },
        {
          key: "serve" as const,
          title: "Service",
          body: "Simple prep, little equipment and a fixed method.",
        },
        {
          key: "menu" as const,
          title: "Menu & expression",
          body: "Menu copy, product photos and materials adapted to the venue.",
        },
        {
          key: "follow" as const,
          title: "Follow-up",
          body: "Training, delivery and improvement based on what actually sells.",
        },
      ],
      cta: "See the solution for venues",
    },
    footer: {
      instagram: "Instagram",
      tiktok: "TikTok",
      copyright: "© 2026 Gold of Sicily",
    },
    about: {
      eyebrow: "About",
      manifesto: [
        "We bring more than a Sicilian food tradition. Gold of Sicily is our version of that Italian, unforced elegance: good ingredients, clear flavours and simple service. Developed and produced in Norway, with Sicily as the starting point.",
      ],
      storyHeading: "The story",
      story: [
        "It began when Denis came to Norway and wondered why pizza and pasta were a given — while arancini barely existed.",
        "The first night in Oslo confirmed what we hoped: people want to sit with this. Now we make Gold of Sicily as a complete concept for venues that want to serve that feeling, not just a box of food.",
      ],
      proof: "First tasting: 4.5/5.",
      ctaFind: "Where is Gold served?",
      ctaIg: "Instagram",
    },
    aranciniPage: {
      seoGuard:
        "In Oslo you meet arancini as Sicilian street food: a crisp shell, warm rice and filling made to be eaten with your hands. Gold of Sicily makes them with the same craft, served at bars and venues around the city.",
    },
  },
} as const;
