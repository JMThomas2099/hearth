import { fitsDiet, type DietId } from "./diets";
import type { GroceryItem, Meal } from "./types";

export const DRINK_WHENS = ["Morning", "Afternoon", "Evening"] as const;
export type DrinkWhen = (typeof DRINK_WHENS)[number];

export type Drink = {
  id: string;
  name: string;
  when: DrinkWhen;
  blurb: string;
  ingredients: { item: string; qty: string }[];
  steps: string[];
  custom?: boolean;
};

export const DRINKS: Drink[] = [
  {
    id: "drink-pourover",
    name: "Pour-over coffee",
    when: "Morning",
    blurb: "The default. Two mugs, a paper filter, water just off the boil. Nothing to shop if you already have beans.",
    ingredients: [
      { item: "Coffee beans", qty: "30 g" },
      { item: "Water", qty: "500 ml, just off the boil" },
    ],
    steps: ["Rinse the filter.", "Bloom the grounds 30 seconds.", "Pour in circles until you have two cups."],
  },
  {
    id: "drink-oat-latte",
    name: "Oat milk latte",
    when: "Morning",
    blurb: "The dairy-free morning. Extra oat milk steams better than the thin stuff.",
    ingredients: [
      { item: "Espresso or strong coffee", qty: "2 shots" },
      { item: "Oat milk", qty: "1 cup" },
    ],
    steps: ["Heat oat milk until steaming, not boiling.", "Pour into the coffee."],
  },
  {
    id: "drink-milk-latte",
    name: "Whole milk latte",
    when: "Morning",
    blurb: "Saturday version. Whole milk, no syrup, a pinch of salt if the beans are bitter.",
    ingredients: [
      { item: "Espresso or strong coffee", qty: "2 shots" },
      { item: "Whole milk", qty: "1 cup" },
    ],
    steps: ["Steam or heat the milk.", "Combine. Drink it before it cools into a puddle."],
  },
  {
    id: "drink-ginger-tea",
    name: "Ginger lemon tea",
    when: "Morning",
    blurb: "When coffee is too much. Sliced ginger, lemon, hot water. Maple if you want it sweet, not honey.",
    ingredients: [
      { item: "Fresh ginger", qty: "6 slices" },
      { item: "Lemon", qty: "2 wedges" },
      { item: "Maple syrup", qty: "optional" },
    ],
    steps: ["Simmer ginger 8 minutes.", "Off the heat, add lemon. Sweeten only if you need to."],
  },
  {
    id: "drink-citrus-water",
    name: "Citrus water for the fridge",
    when: "Afternoon",
    blurb: "A pitcher so the 3 p.m. drink is not another coffee. Orange, lemon, a crushed herb stem.",
    ingredients: [
      { item: "Orange", qty: "1, sliced" },
      { item: "Lemon", qty: "1, sliced" },
      { item: "Mint or rosemary", qty: "a sprig" },
    ],
    steps: ["Fill a pitcher. Chill at least an hour.", "Refill the water once before you toss the fruit."],
  },
  {
    id: "drink-hibiscus",
    name: "Iced hibiscus",
    when: "Afternoon",
    blurb: "Tart, cold, caffeine-free. Steep it strong, then ice it so it doesn't taste like colored water.",
    ingredients: [
      { item: "Dried hibiscus", qty: "1/4 cup" },
      { item: "Water", qty: "1 quart" },
    ],
    steps: ["Steep 10 minutes, covered.", "Strain, chill, pour over ice."],
  },
  {
    id: "drink-kefir",
    name: "Plain kefir",
    when: "Afternoon",
    blurb: "A small glass, not a smoothie project. Salt and pepper if you want it savory.",
    ingredients: [{ item: "Plain kefir", qty: "1 cup" }],
    steps: ["Pour it cold. Don't blend it into oblivion."],
  },
  {
    id: "drink-miso",
    name: "Miso sip",
    when: "Evening",
    blurb: "A mug instead of a cocktail. White miso whisked into hot water, scallion if you have one. Vegetarian, not a bone broth.",
    ingredients: [
      { item: "White miso", qty: "1 tbsp" },
      { item: "Hot water", qty: "1 cup" },
      { item: "Scallion", qty: "optional" },
    ],
    steps: ["Whisk miso into hot, not boiling, water.", "Scallion on top."],
  },
  {
    id: "drink-shrub",
    name: "Apple shrub soda",
    when: "Evening",
    blurb: "The non-alcoholic pour. Apple cider vinegar, maple, sparkling water. Sharp enough to feel like a drink.",
    ingredients: [
      { item: "Apple cider vinegar", qty: "1 tbsp" },
      { item: "Maple syrup", qty: "1 tsp" },
      { item: "Sparkling water", qty: "1 cup" },
    ],
    steps: ["Stir vinegar and maple in a glass.", "Top with cold sparkling water."],
  },
  {
    id: "drink-wine",
    name: "Friday glass of red",
    when: "Evening",
    blurb: "One glass with the steak, not a bottle because the week was long. Pinot or a light cabernet.",
    ingredients: [{ item: "Red wine", qty: "5 oz" }],
    steps: ["Open it when the steak rests.", "Stop at one unless it's Saturday."],
  },
  {
    id: "drink-golden",
    name: "Oat golden milk",
    when: "Evening",
    blurb: "Turmeric, ginger, oat milk, black pepper. Warm, dairy-free, and not dessert.",
    ingredients: [
      { item: "Oat milk", qty: "1 cup" },
      { item: "Turmeric", qty: "1/2 tsp" },
      { item: "Fresh ginger", qty: "2 slices" },
      { item: "Black pepper", qty: "a grind" },
    ],
    steps: ["Simmer 5 minutes. Strain into a mug."],
  },
];

function asMeal(drink: Drink): Pick<Meal, "name" | "tags" | "ingredients" | "protein"> {
  return {
    name: drink.name,
    tags: [],
    protein: 0,
    ingredients: drink.ingredients.map((i) => ({ ...i, aisle: "Pantry" as const })),
  };
}

export function drinksFor(diet: DietId) {
  const gate: DietId = diet === "high-protein" ? "any" : diet;
  return DRINKS.filter((drink) => fitsDiet(asMeal(drink), gate));
}

export function drinkGrocery(drinks: Drink[], pinned: Record<string, boolean>): GroceryItem[] {
  return drinks
    .filter((d) => pinned[d.id])
    .flatMap((drink) =>
      drink.ingredients.map((ing, i) => ({
        id: `drink-${drink.id}-${i}`,
        item: ing.item,
        qty: ing.qty,
        aisle: "Pantry" as const,
        for: [drink.name],
      })),
    );
}
