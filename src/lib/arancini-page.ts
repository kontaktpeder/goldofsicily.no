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
    yieldLabel: "Ca. 12 arancini",
    yieldLd: "ca. 12 stk.",
    timeLabel: "Tid: ca. 1 time + avkjøling",
    prepLabel: "Forberedelse: ca. 1 time + avkjøling",
    cookLabel: "Steking: 4–6 minutter",
    category: "Street food",
    cuisine: "Siciliansk / italiensk",
    prepTime: "PT1H",
    cookTime: "PT6M",
    totalTime: "PT1H",
    ingredientsHeading: "Ingredienser",
    methodHeading: "Slik gjør du",
    ingredients: [
      "300 g risottoris, gjerne Carnaroli eller Arborio",
      "ca. 8 dl grønnsaksbuljong",
      "40 g smør",
      "50 g parmesan",
      "60–80 g ’nduja",
      "125 g mozzarella",
      "hvetemel",
      "2 egg",
      "150–200 g panko eller brødsmuler",
      "nøytral olje til fritering",
    ],
    steps: [
      "Kok risen i buljongen til den er mør og væsken er absorbert.",
      "Mens risen fortsatt er varm, rør inn smør, parmesan og ’nduja.",
      "Spre risen utover og la den avkjøles helt.",
      "Ta litt ris i hånden og lag en fordypning i midten.",
      "Legg i en bit mozzarella og form risen rundt til en fast ball.",
      "Vend arancinien først i mel, deretter egg og til slutt panko.",
      "Friter ved 170–175 °C i omtrent 4–6 minutter, til den er gyllen og sprø.",
      "La den renne av kort og server varm.",
    ],
  },
  airfryer: {
    heading: "Kan arancini lages i airfryer?",
    body: "Ja. Pensle eller spray paneringen lett med olje og stek arancinien ved omtrent 190 °C i 10–14 minutter. Snu dem gjerne halvveis, og stek til paneringen er gyllen og sprø.",
  },
  oven: {
    heading: "Kan arancini lages i ovn?",
    body: "Ja. Stek dem ved omtrent 210 °C i 15–20 minutter. Litt olje på paneringen gir bedre farge og en sprøere overflate.",
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

export function buildAranciniRecipeJsonLd(imageUrl = ARANCINI_PHOTO_URL) {
  const recipe = ARANCINI_PAGE.recipe;
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.heading,
    description: recipe.description,
    image: [imageUrl],
    recipeYield: recipe.yieldLd,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    recipeIngredient: [...recipe.ingredients],
    recipeInstructions: recipe.steps.map((text) => ({
      "@type": "HowToStep",
      text,
    })),
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
  };
}

export const ARANCINI_RECIPE_JSON_LD = buildAranciniRecipeJsonLd();
