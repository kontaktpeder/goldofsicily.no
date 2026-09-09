import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  ARANCINI_PAGE,
  ARANCINI_RECIPE_JSON_LD,
  recipeStepId,
  recipeStepUrl,
} from "./arancini-page.ts";

const pageSource = readFileSync(new URL("../components/arancini-guide.tsx", import.meta.url), "utf8");
const routeSource = readFileSync(new URL("../routes/arancini.tsx", import.meta.url), "utf8");
const oldRoute = readFileSync(new URL("../routes/what-is-arancini.tsx", import.meta.url), "utf8");
const copyBlob = JSON.stringify(ARANCINI_PAGE);

test("arancini page keeps information H1 and recipe H2", () => {
  assert.equal(ARANCINI_PAGE.h1, "Hva er arancini?");
  assert.equal(ARANCINI_PAGE.recipe.heading, "Arancini-oppskrift med ’nduja og mozzarella");
  assert.match(pageSource, /Hva er/);
  assert.match(pageSource, /arancini\?/);
  assert.match(pageSource, /recipe\.heading/);
});

test("H1 shows the pronunciation beside arancini, without a badge", () => {
  assert.equal(ARANCINI_PAGE.h1Pronunciation, "(a-ran-TCHI-ni)");
  assert.match(pageSource, /arancini-pronunciation/);
  assert.match(pageSource, /page\.h1Pronunciation/);
  assert.match(pageSource, /md:whitespace-nowrap/);
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  const block = css.slice(css.indexOf(".arancini-pronunciation"), css.indexOf(".brand-lockup"));
  assert.match(block, /font-size: 0\.4em/);
  assert.match(block, /font-style: italic/);
  assert.match(block, /vertical-align: baseline/);
  assert.equal(block.includes("background"), false);
  assert.equal(block.includes("border"), false);
});

test("home recipe stays simpler than a production recipe", () => {
  for (const phrase of [
    "vått på den gode måten",
    "frossen snacks",
    "håndverk, ikke fabrikk",
    "tomatpuré",
    "tomatpure",
    "krydrede panko",
    "produksjonsoppskrift",
    "draw-arancini-bite",
    "buljong",
    "grønnsaksbuljong",
    "Kan arancini lages i airfryer",
    "Kan arancini lages i ovn",
    "190 °C",
    "210 °C",
  ]) {
    assert.equal(copyBlob.includes(phrase), false, phrase);
    assert.equal(pageSource.includes(phrase), false, phrase);
  }
});

test("Recipe JSON-LD mirrors the visible home recipe", () => {
  const ld = ARANCINI_RECIPE_JSON_LD;
  assert.equal(ld["@type"], "Recipe");
  assert.equal(ld.name, ARANCINI_PAGE.recipe.heading);
  assert.equal(ld.description, ARANCINI_PAGE.recipe.description);
  assert.equal(ld.recipeYield, "ca. 6–9 stk., etter størrelse");
  assert.equal(ld.recipeCategory, ARANCINI_PAGE.recipe.category);
  assert.equal(ld.recipeCuisine, ARANCINI_PAGE.recipe.cuisine);
  assert.deepEqual(ld.recipeIngredient, [...ARANCINI_PAGE.recipe.ingredients]);
  assert.deepEqual(
    ld.recipeInstructions.map((step) => step.text),
    ARANCINI_PAGE.recipe.steps.map((step) => step.text),
  );
  assert.match(pageSource, /recipe\.yieldLabel/);
  assert.match(pageSource, /recipe\.yieldLd/);
  assert.match(pageSource, /recipe\.timeLabel/);
  assert.match(pageSource, /recipe\.prepLabel/);
  assert.match(pageSource, /recipe\.cookLabel/);
  assert.match(pageSource, /recipe\.category/);
  assert.match(pageSource, /recipe\.cuisine/);
  assert.match(routeSource, /ARANCINI_RECIPE_JSON_LD/);
});

test("Oslo venues come from the public portal API, not hardcoded names", () => {
  assert.match(routeSource, /fetchPublicVenues/);
  assert.match(routeSource, /useHydratedVenues/);
  assert.match(pageSource, /venues\.map/);
  assert.match(pageSource, /venue\.name/);
  assert.equal(ARANCINI_PAGE.oslo.cta, "Hvor serveres Gold? →");
  assert.equal(ARANCINI_PAGE.oslo.ctaTo, "/finn-oss");
  assert.match(pageSource, /page\.oslo\.cta/);
  assert.equal(pageSource.includes("Oslo Street Food"), false);
  assert.equal(pageSource.includes("Himkok"), false);
});

test("old arancini URL permanently redirects", () => {
  assert.match(oldRoute, /statusCode: 301/);
  assert.match(oldRoute, /href: "\/arancini"/);
});

test("Recipe JSON-LD fills Search Console HowToStep fields without inventing nutrition or video", () => {
  const ld = ARANCINI_RECIPE_JSON_LD;
  assert.equal(ld.keywords, ARANCINI_PAGE.recipe.keywords);
  assert.match(ld.keywords, /arancini/);
  assert.equal("nutrition" in ld, false);
  assert.equal("video" in ld, false);
  assert.equal(ld.recipeInstructions.length, ARANCINI_PAGE.recipe.steps.length);
  ld.recipeInstructions.forEach((step, index) => {
    assert.equal(step["@type"], "HowToStep");
    assert.equal(step.name, ARANCINI_PAGE.recipe.steps[index].name);
    assert.equal(step.text, ARANCINI_PAGE.recipe.steps[index].text);
    assert.equal(step.url, recipeStepUrl(index));
    assert.match(step.url, /#steg-\d+$/);
  });
  assert.match(pageSource, /recipeStepId/);
  assert.match(pageSource, /step\.name/);
  assert.match(pageSource, /step\.text/);
  assert.equal(recipeStepId(0), "steg-1");
});

test("home recipe fries in oil, weighs two sizes, and drops broth", () => {
  const fry = ARANCINI_PAGE.recipe.steps.find((step) => step.name === "Friter");
  const weigh = ARANCINI_PAGE.recipe.steps.find((step) => step.name === "Vei bollene");
  assert.ok(fry);
  assert.ok(weigh);
  assert.match(fry.text, /frityrolje eller solsikkeolje/);
  assert.match(fry.text, /170 °C/);
  assert.match(fry.text, /6–8 minutter/);
  assert.match(weigh.text, /35 g/);
  assert.match(weigh.text, /45 g/);
  assert.match(weigh.text, /50 g/);
  assert.match(weigh.text, /60–70 g/);
  assert.match(ARANCINI_PAGE.recipe.sizesNote, /Vei bollene/);
  assert.match(pageSource, /recipe\.sizesHeading/);
  assert.equal(copyBlob.toLowerCase().includes("buljong"), false);
  assert.equal(pageSource.includes("airfryer"), false);
  assert.equal(pageSource.includes("page.oven"), false);
});
