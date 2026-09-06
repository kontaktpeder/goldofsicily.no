import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ARANCINI_PAGE, ARANCINI_RECIPE_JSON_LD } from "./arancini-page.ts";

const pageSource = readFileSync(new URL("../components/arancini-guide.tsx", import.meta.url), "utf8");
const routeSource = readFileSync(new URL("../routes/arancini.tsx", import.meta.url), "utf8");
const oldRoute = readFileSync(new URL("../routes/what-is-arancini.tsx", import.meta.url), "utf8");
const copyBlob = JSON.stringify(ARANCINI_PAGE);

test("arancini page keeps information H1 and recipe H2", () => {
  assert.equal(ARANCINI_PAGE.h1, "Hva er arancini?");
  assert.equal(ARANCINI_PAGE.recipe.heading, "Arancini-oppskrift med ’nduja og mozzarella");
  assert.match(pageSource, /page\.h1/);
  assert.match(pageSource, /recipe\.heading/);
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
  assert.equal(ld.recipeYield, "ca. 12 stk.");
  assert.equal(ld.recipeCategory, ARANCINI_PAGE.recipe.category);
  assert.equal(ld.recipeCuisine, ARANCINI_PAGE.recipe.cuisine);
  assert.deepEqual(ld.recipeIngredient, [...ARANCINI_PAGE.recipe.ingredients]);
  assert.deepEqual(
    ld.recipeInstructions.map((step) => step.text),
    [...ARANCINI_PAGE.recipe.steps],
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
