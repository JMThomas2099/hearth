import type { Meal } from "./types";

export const DIETS = [
  { id: "any", label: "Everything", blurb: "The full draft, no filter." },
  { id: "vegetarian", label: "Vegetarian", blurb: "No meat or seafood." },
  { id: "vegan", label: "Vegan", blurb: "No meat, seafood, dairy, eggs, or honey." },
  { id: "pescatarian", label: "Pescatarian", blurb: "Fish is fine. Land meat is not." },
  { id: "gluten-free", label: "Gluten-free", blurb: "No wheat, barley, or rye." },
  { id: "dairy-free", label: "Dairy-free", blurb: "No milk, cheese, butter, or yogurt." },
  { id: "high-protein", label: "High protein", blurb: "Meals with real protein, not just a garnish." },
] as const;

export type DietId = (typeof DIETS)[number]["id"];

const LAND = ["chicken", "turkey", "steak", "sausage", "beef", "pork", "bacon", "lamb", "ham"];
const FISH = ["salmon", "shrimp", "fish", "tuna", "cod", "anchovy", "trout", "sardine", "mackerel"];
const DAIRY = ["yogurt", "cheese", "butter", "milk", "ricotta", "feta", "cheddar", "parmesan", "cottage", "cream", "kefir"];
const GLUTEN = ["sourdough", "bread", "pita", "orzo", "farro", "flour", "soy sauce", "barley", "wheat"];
const NOT_DAIRY = [
  "oat milk",
  "coconut milk",
  "almond milk",
  "soy milk",
  "rice milk",
  "hemp milk",
  "coconut cream",
  "almond butter",
  "peanut butter",
  "sunflower seed butter",
  "sunflower butter",
  "cashew butter",
  "cocoa butter",
];

function textOf(meal: Pick<Meal, "name" | "tags" | "ingredients">) {
  return `${meal.name} ${meal.tags.join(" ")} ${meal.ingredients.map((i) => i.item).join(" ")}`.toLowerCase();
}

function has(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function hasDairy(text: string) {
  let cleaned = text;
  for (const phrase of NOT_DAIRY) cleaned = cleaned.replaceAll(phrase, " ");
  return has(cleaned, DAIRY);
}

export function dietProfile(meal: Pick<Meal, "name" | "tags" | "ingredients" | "protein">) {
  const text = textOf(meal);
  const glutenFree = meal.tags.includes("Gluten-free");
  const tortillaGluten = text.includes("tortilla") && !text.includes("corn tortilla");
  return {
    land: has(text, LAND),
    fish: has(text, FISH),
    dairy: hasDairy(text),
    egg: /\beggs?\b/.test(text.replaceAll("eggplant", " ")),
    honey: /\bhoney\b/.test(text),
    gluten: !glutenFree && (has(text, GLUTEN) || tortillaGluten),
    protein: meal.protein,
    highProtein: meal.protein >= 15 || meal.tags.includes("High protein"),
  };
}

export function fitsDiet(meal: Pick<Meal, "name" | "tags" | "ingredients" | "protein">, diet: DietId) {
  if (diet === "any") return true;
  const p = dietProfile(meal);
  switch (diet) {
    case "vegetarian":
      return !p.land && !p.fish;
    case "vegan":
      return !p.land && !p.fish && !p.dairy && !p.egg && !p.honey;
    case "pescatarian":
      return !p.land;
    case "gluten-free":
      return !p.gluten;
    case "dairy-free":
      return !p.dairy;
    case "high-protein":
      return p.highProtein;
  }
}

export function dietById(id: DietId) {
  return DIETS.find((d) => d.id === id) ?? DIETS[0];
}
