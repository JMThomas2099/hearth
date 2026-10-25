import { fitsDiet, type DietId } from "./diets";
import type { Ingredient, Meal, Slot } from "./types";
import { allMeals } from "./week";

function ing(item: string, qty: string, aisle: Ingredient["aisle"]): Ingredient {
  return { item, qty, aisle };
}

function sug(slot: Slot, rest: Omit<Meal, "slot" | "servings"> & { servings?: number }): Meal {
  return { slot, servings: rest.servings ?? 2, ...rest };
}

export const EXTRAS: Meal[] = [
  sug("breakfast", {
    id: "sug-tofu-scramble",
    name: "Turmeric tofu scramble",
    minutes: 15,
    calories: 340,
    protein: 24,
    carbs: 14,
    fat: 20,
    tags: ["Vegan", "Gluten-free", "High protein"],
    heat: "Cook",
    blurb: "Crumble firm tofu into a hot pan with turmeric, spinach, and a squeeze of lemon. The vegan stand-in for the egg muffins.",
    ingredients: [
      ing("Firm tofu", "14 oz", "Produce"),
      ing("Baby spinach", "2 cups", "Produce"),
      ing("Turmeric", "1 tsp", "Spices & Oils"),
      ing("Olive oil", "1 tbsp", "Spices & Oils"),
      ing("Lemon", "1/2", "Produce"),
    ],
    steps: [
      "Press and crumble the tofu. Warm oil, add turmeric and a pinch of salt.",
      "Cook 6 minutes until the edges dry a little. Fold in spinach until wilted.",
      "Lemon over the top. Pack half for tomorrow.",
    ],
    makeAhead: "Holds 3 days. Reheat in a dry pan so it doesn't steam.",
  }),
  sug("breakfast", {
    id: "sug-chia",
    name: "Chia coconut pudding",
    minutes: 10,
    calories: 310,
    protein: 8,
    carbs: 28,
    fat: 18,
    tags: ["Vegan", "Gluten-free"],
    heat: "Assemble",
    blurb: "Stirred the night before. Coconut milk, chia, citrus zest. No dairy, no honey.",
    ingredients: [
      ing("Chia seeds", "1/4 cup", "Pantry"),
      ing("Canned coconut milk", "3/4 cup", "Pantry"),
      ing("Orange", "zest of 1", "Produce"),
      ing("Maple syrup", "2 tsp", "Pantry"),
    ],
    steps: [
      "Stir chia, coconut milk, maple, zest, and a pinch of salt.",
      "Refrigerate at least 4 hours. Stir once if it clumps.",
    ],
    makeAhead: "Four jars on Sunday. Eat cold.",
  }),
  sug("lunch", {
    id: "sug-lentil-salad",
    name: "Herb lentil salad",
    minutes: 25,
    calories: 480,
    protein: 26,
    carbs: 62,
    fat: 14,
    tags: ["Vegan", "Gluten-free", "High protein"],
    heat: "Cook",
    blurb: "French lentils, a lot of parsley, lemon, olive oil, cucumber. Eats well cold from a container.",
    ingredients: [
      ing("French lentils", "1 cup dry", "Pantry"),
      ing("Parsley", "1 bunch", "Produce"),
      ing("Cucumber", "1", "Produce"),
      ing("Lemon", "1", "Produce"),
      ing("Olive oil", "2 tbsp", "Spices & Oils"),
    ],
    steps: [
      "Simmer lentils in salted water 20 minutes. Drain well.",
      "Toss with chopped parsley, cucumber, lemon, oil, salt.",
    ],
    makeAhead: "Better after an hour in the fridge. Keeps 4 days.",
  }),
  sug("lunch", {
    id: "sug-chickpea-stew",
    name: "Chickpea tomato stew",
    minutes: 30,
    calories: 520,
    protein: 22,
    carbs: 68,
    fat: 16,
    tags: ["Vegan", "Gluten-free", "High protein"],
    heat: "Cook",
    servings: 4,
    blurb: "A pot of chickpeas, crushed tomato, garlic, and greens. Spoon over rice or eat from a bowl.",
    ingredients: [
      ing("Chickpeas", "2 cans, drained", "Pantry"),
      ing("Crushed tomatoes", "14 oz", "Pantry"),
      ing("Garlic", "3 cloves", "Produce"),
      ing("Baby spinach", "3 cups", "Produce"),
      ing("Olive oil", "2 tbsp", "Spices & Oils"),
    ],
    steps: [
      "Warm oil and garlic. Add tomatoes, chickpeas, salt, chili flake. Simmer 15 minutes.",
      "Fold in spinach. Rest 5 minutes.",
    ],
    makeAhead: "Sunday pot. It thickens in the fridge — loosen with water.",
  }),
  sug("dinner", {
    id: "sug-curry",
    name: "Coconut chickpea curry",
    minutes: 35,
    calories: 610,
    protein: 22,
    carbs: 70,
    fat: 26,
    tags: ["Vegan", "Gluten-free"],
    heat: "Cook",
    servings: 4,
    blurb: "Onion, ginger, chickpeas, coconut milk, spinach. Rice on the side. The vegan dinner that still feels like a plan.",
    ingredients: [
      ing("Chickpeas", "2 cans", "Pantry"),
      ing("Coconut milk", "1 can", "Pantry"),
      ing("Yellow onion", "1", "Produce"),
      ing("Fresh ginger", "1 tbsp", "Produce"),
      ing("Baby spinach", "3 cups", "Produce"),
      ing("Cooked rice", "2 cups", "Pantry"),
    ],
    steps: [
      "Sweat onion and ginger. Add curry powder, chickpeas, coconut milk. Simmer 15 minutes.",
      "Spinach at the end. Serve over rice.",
    ],
    makeAhead: "The curry keeps 4 days. Cook rice fresh or from the Sunday pot.",
  }),
  sug("dinner", {
    id: "sug-quinoa-bowl",
    name: "Roasted vegetable quinoa bowl",
    minutes: 40,
    calories: 540,
    protein: 18,
    carbs: 72,
    fat: 20,
    tags: ["Vegan", "Gluten-free"],
    heat: "Cook",
    blurb: "Squash or broccoli, red onion, quinoa, tahini lemon sauce. Uses whatever the farm stand actually has.",
    ingredients: [
      ing("Quinoa", "1 cup dry", "Pantry"),
      ing("Broccoli", "1 head", "Produce"),
      ing("Red onion", "1", "Produce"),
      ing("Tahini", "2 tbsp", "Pantry"),
      ing("Lemon", "1", "Produce"),
    ],
    steps: [
      "Roast broccoli and onion at 425 for 20 minutes.",
      "Simmer quinoa 15 minutes. Stir tahini with lemon and salt.",
      "Bowl, sauce, eat.",
    ],
    makeAhead: "Roast a sheet on Sunday. Quinoa holds 4 days.",
  }),
  sug("snack", {
    id: "sug-edamame",
    name: "Salted edamame",
    minutes: 8,
    calories: 190,
    protein: 18,
    carbs: 14,
    fat: 8,
    tags: ["Vegan", "Gluten-free", "High protein"],
    heat: "Cook",
    blurb: "Frozen edamame, boiled, salted. The high-protein snack that isn't dairy.",
    ingredients: [
      ing("Frozen edamame", "2 cups", "Frozen"),
      ing("Flaky salt", "pinch", "Spices & Oils"),
    ],
    steps: ["Boil 4 minutes. Drain, salt. Eat warm or cold."],
    makeAhead: "Keep a bag in the freezer. That's the prep.",
  }),
  sug("snack", {
    id: "sug-sunflower",
    name: "Apple and sunflower butter",
    minutes: 3,
    calories: 230,
    protein: 6,
    carbs: 26,
    fat: 12,
    tags: ["Vegan", "Gluten-free"],
    heat: "Assemble",
    blurb: "The almond-butter snack without the almond, for anyone skipping nuts or just out of the jar.",
    ingredients: [
      ing("Apple", "1", "Produce"),
      ing("Sunflower seed butter", "1 1/2 tbsp", "Pantry"),
    ],
    steps: ["Slice the apple. Spoon the butter. Salt if it tastes flat."],
    makeAhead: "None.",
  }),
  sug("breakfast", {
    id: "sug-smoked-trout",
    name: "Smoked trout and cucumber",
    minutes: 8,
    calories: 360,
    protein: 32,
    carbs: 8,
    fat: 22,
    tags: ["Pescatarian", "Gluten-free", "High protein", "Dairy-free"],
    heat: "Assemble",
    blurb: "A no-cook breakfast with smoke and crunch. Lemon, cucumber, trout, olive oil. No bread required.",
    ingredients: [
      ing("Smoked trout", "4 oz", "Meat & Seafood"),
      ing("Cucumber", "1", "Produce"),
      ing("Lemon", "1/2", "Produce"),
      ing("Olive oil", "1 tsp", "Spices & Oils"),
    ],
    steps: ["Slice cucumber. Flake trout over it. Oil, lemon, pepper."],
    makeAhead: "Portion the trout the night before so breakfast is a plate, not a search.",
  }),
  sug("dinner", {
    id: "sug-turkey-meatballs",
    name: "Turkey meatballs and greens",
    minutes: 30,
    calories: 520,
    protein: 46,
    carbs: 18,
    fat: 28,
    tags: ["High protein", "Gluten-free", "Dairy-free"],
    heat: "Cook",
    servings: 4,
    blurb: "Meatballs bound with egg, not breadcrumbs. Pan sauce of garlic and greens. A high-protein swap when the draft is too light.",
    ingredients: [
      ing("Ground turkey", "1.5 lb", "Meat & Seafood"),
      ing("Egg", "1", "Dairy & Eggs"),
      ing("Garlic", "3 cloves", "Produce"),
      ing("Baby spinach", "4 cups", "Produce"),
      ing("Olive oil", "1 tbsp", "Spices & Oils"),
    ],
    steps: [
      "Mix turkey, egg, salt, pepper. Roll into small balls.",
      "Brown in oil, 8 minutes. Add garlic and spinach with a splash of water. Cover 3 minutes.",
    ],
    makeAhead: "Cook the batch Sunday. Reheat covered.",
  }),
];

export function suggestionsFor(slot: Slot, diet: DietId, excludeId?: string) {
  const pool = [...allMeals(), ...EXTRAS].filter((meal) => meal.slot === slot && meal.id !== excludeId && fitsDiet(meal, diet));
  const seen = new Set<string>();
  return pool.filter((meal) => {
    if (seen.has(meal.name)) return false;
    seen.add(meal.name);
    return true;
  });
}
