import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DietId } from "./meals/diets";
import type { Drink } from "./meals/drinks";
import type { RegionId } from "./meals/season";
import type { Meal } from "./meals/types";

type PlanState = {
  eaten: Record<string, boolean>;
  grocery: Record<string, boolean>;
  prep: Record<string, boolean>;
  holidayShop: Record<string, boolean>;
  holidayPrep: Record<string, boolean>;
  notes: Record<string, string>;
  diet: DietId;
  dietFilters: boolean;
  regionId: RegionId | null;
  overrides: Record<string, Meal>;
  customDrinks: Drink[];
  pinnedDrinks: Record<string, boolean>;
  toggleEaten: (id: string) => void;
  toggleGrocery: (id: string) => void;
  togglePrep: (id: string) => void;
  toggleHolidayShop: (id: string) => void;
  toggleHolidayPrep: (id: string) => void;
  setNote: (day: string, note: string) => void;
  resetWeek: () => void;
  setDiet: (diet: DietId) => void;
  setDietFilters: (on: boolean) => void;
  setRegion: (regionId: RegionId | null) => void;
  setOverride: (key: string, meal: Meal) => void;
  clearOverride: (key: string) => void;
  clearOverrides: () => void;
  addDrink: (drink: Drink) => void;
  removeDrink: (id: string) => void;
  togglePinnedDrink: (id: string) => void;
};

function flip(map: Record<string, boolean>, id: string) {
  return { ...map, [id]: !map[id] };
}

export const usePlan = create<PlanState>()(
  persist(
    (set) => ({
      eaten: {},
      grocery: {},
      prep: {},
      holidayShop: {},
      holidayPrep: {},
      notes: {},
      diet: "any",
      dietFilters: true,
      regionId: null,
      overrides: {},
      customDrinks: [],
      pinnedDrinks: {},
      toggleEaten: (id) => set((s) => ({ eaten: flip(s.eaten, id) })),
      toggleGrocery: (id) => set((s) => ({ grocery: flip(s.grocery, id) })),
      togglePrep: (id) => set((s) => ({ prep: flip(s.prep, id) })),
      toggleHolidayShop: (id) => set((s) => ({ holidayShop: flip(s.holidayShop, id) })),
      toggleHolidayPrep: (id) => set((s) => ({ holidayPrep: flip(s.holidayPrep, id) })),
      setNote: (day, note) => set((s) => ({ notes: { ...s.notes, [day]: note } })),
      resetWeek: () => set({ eaten: {}, grocery: {}, prep: {}, notes: {} }),
      setDiet: (diet) => set({ diet }),
      setDietFilters: (dietFilters) => set({ dietFilters }),
      setRegion: (regionId) => set({ regionId }),
      setOverride: (key, meal) => set((s) => ({ overrides: { ...s.overrides, [key]: meal } })),
      clearOverride: (key) =>
        set((s) => {
          const overrides = { ...s.overrides };
          delete overrides[key];
          return { overrides };
        }),
      clearOverrides: () => set({ overrides: {} }),
      addDrink: (drink) =>
        set((s) => ({
          customDrinks: [drink, ...s.customDrinks],
          pinnedDrinks: { ...s.pinnedDrinks, [drink.id]: true },
        })),
      removeDrink: (id) =>
        set((s) => ({
          customDrinks: s.customDrinks.filter((d) => d.id !== id),
          pinnedDrinks: { ...s.pinnedDrinks, [id]: false },
        })),
      togglePinnedDrink: (id) => set((s) => ({ pinnedDrinks: flip(s.pinnedDrinks, id) })),
    }),
    { name: "hearth-plan" },
  ),
);
