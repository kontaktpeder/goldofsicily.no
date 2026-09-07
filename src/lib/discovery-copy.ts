export type DiscoveryRoute =
  | "/arancini"
  | "/next-popup"
  | "/about"
  | "/for-serveringssteder"
  | "/en/next-popup"
  | "/en/for-venues"
  | "/en/about";

export type EditorialCard = {
  title: string;
  description: string;
  cta: string;
  to: DiscoveryRoute;
};

export type CreditsLink = {
  label: string;
  to: DiscoveryRoute;
};

export type DiscoveryCopy = {
  heroIntro: {
    eyebrow: string;
    body: string;
  };
  editorial: {
    eyebrow: string;
    cards: EditorialCard[];
  };
  credits: {
    label: string;
    links: CreditsLink[];
  };
  footer: {
    tagline: string;
    rights: string;
    barsLabel: string;
    barsTo: "/for-serveringssteder" | "/en/for-venues";
  };
};

export const DISCOVERY_NO: DiscoveryCopy = {
  heroIntro: {
    eyebrow: "",
    body: "Fra gatene i Palermo til Oslo.",
  },
  editorial: {
    eyebrow: "Fra gatene i Palermo",
    cards: [
      {
        title: "Hva er arancini?",
        description: "Sprø skorpe, varm ris og fyll fra Sicilia.",
        cta: "Lær mer",
        to: "/arancini",
      },
      {
        title: "For serveringssteder",
        description: "Siciliansk arancini til menyen. Enkel tilberedning, to smaker.",
        cta: "Les mer",
        to: "/for-serveringssteder",
      },
      {
        title: "Om Gold of Sicily",
        description: "Historien bak Gold of Sicily og siciliansk arancini produsert i Oslo.",
        cta: "Vår historie",
        to: "/about",
      },
    ],
  },
  credits: {
    label: "Oppdag",
    links: [
      { label: "Hva er arancini", to: "/arancini" },
      { label: "For serveringssteder", to: "/for-serveringssteder" },
      { label: "Om oss", to: "/about" },
    ],
  },
  footer: {
    tagline: "Oslo · Palermo",
    rights: "© Gold of Sicily",
    barsLabel: "For serveringssteder",
    barsTo: "/for-serveringssteder",
  },
};

export const DISCOVERY_EN: DiscoveryCopy = {
  heroIntro: {
    eyebrow: "",
    body: "From the streets of Palermo to Oslo.",
  },
  editorial: {
    eyebrow: "From the streets of Palermo",
    cards: [
      {
        title: "What is arancini?",
        description: "Crisp shell, warm rice, filling from Sicily.",
        cta: "Learn more",
        to: "/arancini",
      },
      {
        title: "For venues",
        description: "Sicilian arancini for the menu. Simple prep, two flavours.",
        cta: "Read more",
        to: "/en/for-venues",
      },
      {
        title: "About Gold of Sicily",
        description: "The story behind Gold of Sicily and Sicilian arancini made in Oslo.",
        cta: "Our story",
        to: "/en/about",
      },
    ],
  },
  credits: {
    label: "Discover",
    links: [
      { label: "What is arancini?", to: "/arancini" },
      { label: "For venues", to: "/en/for-venues" },
      { label: "About", to: "/en/about" },
    ],
  },
  footer: {
    tagline: "Oslo · Palermo",
    rights: "© Gold of Sicily",
    barsLabel: "For venues",
    barsTo: "/en/for-venues",
  },
};
