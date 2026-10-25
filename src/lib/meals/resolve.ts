import type { GroceryItem, Meal, Slot } from "./types";
import { WEEK } from "./week";

export function slotKey(weekday: number, slot: Slot) {
  return `${weekday}-${slot}`;
}

export function mealFor(weekday: number, slot: Slot, overrides: Record<string, Meal>) {
  const day = WEEK.find((d) => d.weekday === weekday) ?? WEEK[0];
  if (!day) throw new Error("Week draft is empty");
  return overrides[slotKey(weekday, slot)] ?? day.meals[slot];
}

export function isCustom(meal: Meal) {
  return meal.id.startsWith("custom-");
}

export function isSwap(meal: Meal) {
  return meal.id.startsWith("pick-") || meal.id.startsWith("custom-");
}

export function placeMeal(weekday: number, slot: Slot, meal: Meal, custom: boolean): Meal {
  const key = slotKey(weekday, slot);
  return { ...meal, slot, id: custom ? `custom-${key}` : `pick-${key}` };
}

export function extraGrocery(overrides: Record<string, Meal>): GroceryItem[] {
  return Object.entries(overrides).flatMap(([key, meal]) =>
    meal.ingredients.map((ing, i) => ({
      id: `extra-${key}-${i}-${ing.item}`,
      item: ing.item,
      qty: ing.qty,
      aisle: ing.aisle,
      for: [meal.name],
    })),
  );
}
