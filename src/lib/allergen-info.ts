/**
 * Central allergen data for bar sales pages.
 * Update here when recipes and suppliers are standardized.
 */

export type AllergenProduct = {
  id: string;
  name: { no: string; en: string };
  confirmed: { no: string[]; en: string[] };
  /** Ingredients that must be checked against the specific batch — not formal "may contain" labelling */
  dependsOnIngredients: { no: string[]; en: string[] };
  status: { no: string; en: string };
};

export const allergenProducts: AllergenProduct[] = [
  {
    id: "nduja",
    name: {
      no: "Nduja-arancini",
      en: "'Nduja arancini",
    },
    confirmed: {
      no: ["Hvete (gluten)", "Soya", "Melk", "Egg", "Selleri"],
      en: ["Wheat (gluten)", "Soy", "Milk", "Egg", "Celery"],
    },
    dependsOnIngredients: { no: [], en: [] },
    status: { no: "Bekreftet", en: "Confirmed" },
  },
  {
    id: "truffle-mushroom",
    name: {
      no: "Trøffel og sjampinjong",
      en: "Truffle & mushroom",
    },
    confirmed: {
      no: ["Hvete (gluten)", "Soya", "Melk", "Egg", "Selleri"],
      en: ["Wheat (gluten)", "Soy", "Milk", "Egg", "Celery"],
    },
    dependsOnIngredients: { no: [], en: [] },
    status: { no: "Bekreftet", en: "Confirmed" },
  },
];

export const allergenCopy = {
  no: {
    title: "Allergener og produktinformasjon",
    intro:
      "Begge variantene har de samme deklarerte allergenene, fra den offisielle produktspesifikasjonen.",
    body: [
      "’Nduja & mozzarella og trøffel & sjampinjong deklarerer hvete (gluten), soya, melk, egg og selleri.",
      "Ingredienslisten for hver variant står på kjøpssiden og følger produktet.",
    ],
    overviewLabel: "Deklarerte allergener",
    overviewSummary: "Hvete (gluten), soya, melk, egg og selleri gjelder begge variantene.",
    confirmedLabel: "Bekreftet",
    dependsLabel: "Må kontrolleres ut fra valgt råvare",
    closing:
      "Serveringsstedet bruker denne deklarasjonen i meny, ved disken og i internkontrollen.",
    contactLink: "Har dere spørsmål om allergener eller en konkret levering? Kontakt oss.",
    contactHref: "#kontakt",
  },
  en: {
    title: "Allergens and product information",
    intro:
      "Both varieties carry the same declared allergens, from the official product specification.",
    body: [
      "’Nduja & mozzarella and truffle & champignon declare wheat (gluten), soy, milk, egg and celery.",
      "The ingredient list for each variety is on the buy page and follows the product.",
    ],
    overviewLabel: "Declared allergens",
    overviewSummary: "Wheat (gluten), soy, milk, egg and celery apply to both varieties.",
    confirmedLabel: "Confirmed",
    dependsLabel: "Must be verified against chosen ingredients",
    closing:
      "Venues use this declaration on the menu, at the counter and in their food-safety routines.",
    contactLink: "Questions about allergens or a specific delivery? Contact us.",
    contactHref: "#kontakt",
  },
} as const;
