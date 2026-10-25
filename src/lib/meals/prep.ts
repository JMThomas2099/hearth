import type { PrepTask } from "./types";

export const PREP_TASKS: PrepTask[] = [
  {
    id: "p-oven",
    clock: "0:00",
    minutes: 10,
    title: "Heat the oven, salt the birds",
    detail: "425°F. Two chickens, already dry-brined if you did it Saturday. Potatoes washed. Sheet pans out.",
  },
  {
    id: "p-chicken",
    clock: "0:10",
    minutes: 10,
    title: "Chickens in, potatoes on",
    detail: "Oil and salt the potatoes on a second rack. Broccolini waits until the last 12 minutes.",
  },
  {
    id: "p-chili",
    clock: "0:15",
    minutes: 50,
    title: "Chili on the back burner",
    detail: "Brown turkey, onions, peppers. Tomatoes, beans, spices. Simmer while everything else happens.",
  },
  {
    id: "p-grains",
    clock: "0:20",
    minutes: 35,
    title: "Farro and rice pots",
    detail: "Salted water. Farro ~30 minutes, rice ~18. Spread on sheets to cool so they don't clump in the fridge.",
  },
  {
    id: "p-oats",
    clock: "0:25",
    minutes: 20,
    title: "Steel-cut oats, four jars",
    detail: "One pot, four portions. Apples for today only; the rest get topped on the day.",
  },
  {
    id: "p-muffins",
    clock: "0:40",
    minutes: 25,
    title: "Egg muffins in the oven",
    detail: "When there's a gap in the 425, drop to 350 or bake after the chickens rest. A dozen. Cool on a rack.",
  },
  {
    id: "p-potatoes-sweet",
    clock: "0:45",
    minutes: 45,
    title: "Sweet potatoes on a sheet",
    detail: "Four of them, beside the chickens if there's room, or after. Cool, wrap.",
  },
  {
    id: "p-sauces",
    clock: "1:20",
    minutes: 20,
    title: "Tahini yogurt and chimichurri",
    detail: "Two jars. Chimichurri wants parsley, cilantro, garlic, vinegar, oil. Tahini yogurt wants lemon and salt.",
  },
  {
    id: "p-shred",
    clock: "1:40",
    minutes: 20,
    title: "Rest, carve, shred",
    detail: "Dinner chicken stays whole. The second bird: breasts and thighs shredded into a two-cup and a three-cup container. Bones in a bag if you're making stock.",
  },
  {
    id: "p-portion",
    clock: "2:00",
    minutes: 20,
    title: "Portion chili, grains, muffins",
    detail: "Chili in pints. Farro in a quart. Muffins in a lidded box with paper between layers. Label with painter's tape.",
  },
  {
    id: "p-snacks",
    clock: "2:20",
    minutes: 15,
    title: "Snack drawer",
    detail: "Carrot sticks in water. Toast the walnuts. Dates in a jar. Almond butter portioned if you leave the house.",
  },
  {
    id: "p-map",
    clock: "2:35",
    minutes: 10,
    title: "Fridge map and reset",
    detail: "Top shelf: shredded chicken, chili pints, sauces. Middle: grains, muffins, oat jars. Drawer: snack veg. Door: yogurt. Oven off. That's the week.",
  },
];

export const FRIDGE_MAP = [
  { shelf: "Top", holds: "Shredded chicken, chili pints, chimichurri, tahini yogurt" },
  { shelf: "Middle", holds: "Farro, rice, egg muffins, oat jars, leftover salmon after Tuesday" },
  { shelf: "Drawers", holds: "Snack carrots, greens, herbs in a jar of water" },
  { shelf: "Door", holds: "Yogurt, milk, tortillas, salsa" },
];
