import { SITE } from "./site.ts";

const SITE_URL = SITE.domain;

export const ARANCINI_PHOTO_PATH = "/arancini.jpg";
export const ARANCINI_PHOTO_URL = `${SITE_URL}${ARANCINI_PHOTO_PATH}`;

export const ARANCINI_PAGE = {
  path: "/arancini",
  title: "Hva er arancini? Oppskrift på sicilianske risboller | Gold of Sicily",
  description:
    "Hva er arancini, og hvordan lager du dem hjemme? Se vår enkle arancini-oppskrift med ’nduja og mozzarella, og finn ut hvor Gold of Sicily serveres.",
  h1: "Hva er arancini?",
  intro:
    "Arancini er sicilianske risboller laget av kokt ris, fyll og ost, som paneres og stekes til de blir sprø utenpå og myke inni. De finnes i mange varianter over hele Sicilia og spises gjerne som street food, lunsj eller en liten rett.",
  photoAlt: "Seks sprø Gold of Sicily-arancini på et mørkt brett",
  sicily: {
    heading: "Fra Sicilia",
    paragraphs: [
      "Arancini kommer fra Sicilia. Navnet henger sammen med det italienske ordet arancia, som betyr appelsin: de gylne bollene kan ligne en appelsin i både farge og form.",
      "Form og fyll varierer over øya. Rundt Palermo er de gjerne runde. Spissere varianter forbindes blant annet med Catania. Klassiske fyll er ragù, ost og erter.",
    ],
  },
  recipe: {
    heading: "Arancini-oppskrift med ’nduja og mozzarella",
    description:
      "Enkel hjemmeoppskrift på sicilianske arancini med ’nduja og mozzarella.",
    yieldLabel: "Ca. 6–9 arancini",
    yieldLd: "ca. 6–9 stk., etter størrelse",
    timeLabel: "Tid: ca. 1 time + avkjøling",
    prepLabel: "Forberedelse: ca. 1 time + avkjøling",
    cookLabel: "Fritering: 6–8 minutter",
    category: "Street food",
    cuisine: "Siciliansk / italiensk",
    prepTime: "PT1H",
    cookTime: "PT8M",
    totalTime: "PT1H",
    ingredientsHeading: "Ingredienser",
    methodHeading: "Slik gjør du",
    sizesHeading: "Størrelse",
    sizesNote: "Vei bollene så de blir like store.",
    sizes: [
      {
        title: "Snack",
        body: "35 g ris + batter og panko blir ca. 45 g ferdig. Passer fint som snack.",
      },
      {
        title: "Måltid",
        body: "50 g ris + batter og panko blir ca. 60–70 g ferdig. Da blir du som regel mett av tre.",
      },
    ],
    keywords: "arancini, sicilianske risboller, ’nduja, mozzarella, oppskrift",
    ingredients: [
      "300 g risottoris, gjerne Carnaroli eller Arborio",
      "40 g smør",
      "50 g parmesan",
      "60–80 g ’nduja",
      "125 g mozzarella",
      "hvetemel",
      "2 egg",
      "150–200 g panko eller brødsmuler",
      "frityrolje eller solsikkeolje",
    ],
    steps: [
      {
        name: "Kok risen",
        text: "Kok risen til den er mør og kan formes.",
      },
      {
        name: "Rør inn fyll",
        text: "Mens risen fortsatt er varm, rør inn smør, parmesan og ’nduja.",
      },
      {
        name: "Avkjøl risen",
        text: "Spre risen utover og la den avkjøles helt.",
      },
      {
        name: "Vei bollene",
        text: "Vei risen så bollene blir like store. 35 g ris + batter og panko blir ca. 45 g ferdig og passer som snack. 50 g ris + batter og panko blir ca. 60–70 g ferdig — da blir du som regel mett av tre.",
      },
      {
        name: "Lag en fordypning",
        text: "Ta litt ris i hånden og lag en fordypning i midten.",
      },
      {
        name: "Form bollene",
        text: "Legg i en bit mozzarella og form risen rundt til en fast ball.",
      },
      {
        name: "Paner aranciniene",
        text: "Vend arancinien først i mel, deretter egg og til slutt panko.",
      },
      {
        name: "Friter",
        text: "Fyll en gryte med frityrolje eller solsikkeolje. Varm opp til rundt 170 °C og la aranciniene ligge i 6–8 minutter, alt etter størrelse, til de er gylne og sprø.",
      },
      {
        name: "Server varm",
        text: "La dem renne av kort og server varm.",
      },
    ],
  },
  fillings: {
    heading: "Hva kan arancini fylles med?",
    intro: "Arancini finnes i mange varianter. Fyllet kan være klassisk, sesongbasert eller mer lekent — det som holder, er ris, ost og en sprø skorpe rundt.",
    items: [
      "ragù",
      "mozzarella",
      "kjøttsaus og erter",
      "forskjellige oster",
      "sopp",
      "trøffel",
      "’nduja",
    ],
    goldLine:
      "Hos Gold of Sicily lager vi i dag to varianter: ’Nduja & mozzarella og Trøffel & sjampinjong.",
  },
  oslo: {
    heading: "Hvor kan du spise arancini i Oslo?",
    body: "Vil du heller spise dem enn å lage dem selv? Gold of Sicily serveres hos utvalgte barer, restauranter og andre serveringssteder.",
    empty:
      "Serveringssteder vises her når de er merket offentlige i portalen.",
    cta: "Hvor serveres Gold? →",
    ctaTo: "/finn-oss",
  },
} as const;

export function recipeStepId(index: number) {
  return `steg-${index + 1}`;
}

export function recipeStepUrl(index: number) {
  return `${SITE_URL}${ARANCINI_PAGE.path}#${recipeStepId(index)}`;
}

export function buildAranciniRecipeJsonLd(imageUrl = ARANCINI_PHOTO_URL) {
  const recipe = ARANCINI_PAGE.recipe;
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.heading,
    description: recipe.description,
    image: [imageUrl],
    keywords: recipe.keywords,
    recipeYield: recipe.yieldLd,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeIngredient: [...recipe.ingredients],
    recipeInstructions: recipe.steps.map((step, index) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      url: recipeStepUrl(index),
    })),
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
  };
}

export const ARANCINI_RECIPE_JSON_LD = buildAranciniRecipeJsonLd();
