export const SLOTS = ["breakfast", "lunch", "dinner", "snack"] as const;
export type Slot = (typeof SLOTS)[number];

export const AISLES = [
  "Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Bakery",
  "Pantry",
  "Frozen",
  "Spices & Oils",
] as const;
export type Aisle = (typeof AISLES)[number];

export type Ingredient = {
  item: string;
  qty: string;
  aisle: Aisle;
};

export type Heat = "Batch" | "Cook" | "Reheat" | "Assemble";

export type Meal = {
  id: string;
  name: string;
  slot: Slot;
  minutes: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  heat: Heat;
  blurb: string;
  ingredients: Ingredient[];
  steps: string[];
  makeAhead: string;
  leftover?: string;
};

export type DayPlan = {
  weekday: number;
  name: string;
  kicker: string;
  note: string;
  meals: Record<Slot, Meal>;
};

export type GroceryItem = {
  id: string;
  item: string;
  qty: string;
  aisle: Aisle;
  for: string[];
};

export type PrepTask = {
  id: string;
  clock: string;
  minutes: number;
  title: string;
  detail: string;
};

export type HolidayDish = {
  id: string;
  name: string;
  course: string;
  minutes: number;
  serves: string;
  blurb: string;
  ingredients: { item: string; qty: string }[];
  steps: string[];
  makeAhead?: string;
};

export type HolidayMenu = {
  id: string;
  name: string;
  date: string;
  iso: string;
  season: "Winter" | "Spring" | "Summer" | "Autumn";
  guests: string;
  vibe: string;
  kicker: string;
  description: string;
  dishes: HolidayDish[];
  timeline: { when: string; task: string }[];
  shopping: { aisle: string; items: string[] }[];
  drinks: string[];
};
