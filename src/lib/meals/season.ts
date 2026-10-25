export const REGIONS = [
  { id: "northeast", label: "Northeast", places: "New England and New York" },
  { id: "southeast", label: "Southeast", places: "Carolinas through Florida" },
  { id: "midwest", label: "Midwest", places: "Great Lakes down to the Ohio" },
  { id: "south", label: "South", places: "Texas, the Gulf, the Deep South" },
  { id: "southwest", label: "Southwest", places: "Arizona, New Mexico, the high desert" },
  { id: "mountain", label: "Mountain West", places: "Colorado, Utah, Montana, Idaho" },
  { id: "pacific", label: "Pacific Northwest", places: "Washington and Oregon" },
  { id: "california", label: "California", places: "Coast, valleys, and foothills" },
  { id: "hawaii", label: "Hawaii", places: "The islands" },
  { id: "alaska", label: "Alaska", places: "Southcentral and the interior" },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_NOTE = [
  "Stands are small. Buy what was grown to keep, and anything from a greenhouse.",
  "Still a storage month. Take the first forced greens only if a grower actually raised them.",
  "The ground is waking up. If it flew in from somewhere warm, leave it.",
  "Asparagus and tender leaves start, later the farther north you are.",
  "First sweet fruit and a lot of leaves. Go early — the good bunches leave.",
  "Berries and the first squash. Don't buy a tomato that is only red.",
  "High summer. Cook what you can this week and don't panic-buy the whole table.",
  "The glut. Tomatoes, peppers, and corn if your nights got hot enough.",
  "Summer is still here, and winter squash is starting to show its face.",
  "The last abundant month. Fruit for keeping, and greens that can take a frost.",
  "Frost has edited the fields. Roots, brassicas, and citrus where it grows.",
  "Holiday greens, citrus in the warm states, cellar crops everywhere else.",
];

/** Twelve months, January first. Comma-separated crops at a real farmers market. */
const CROPS: Record<RegionId, string[]> = {
  northeast: [
    "Kale, Cabbage, Storage apples, Potatoes, Onions, Winter squash, Leeks, Microgreens",
    "Kale, Cabbage, Potatoes, Storage apples, Onions, Carrots, Microgreens, Leeks",
    "Spinach, Kale, Radishes, Overwintered carrots, Green garlic, Microgreens",
    "Asparagus, Spinach, Radishes, Lettuce, Ramps, Green garlic, Chives",
    "Asparagus, Spinach, Lettuce, Radishes, Peas, Strawberries, Rhubarb",
    "Strawberries, Peas, Lettuce, Radishes, Zucchini, Cherries, Kale",
    "Blueberries, Cherries, Zucchini, Cucumbers, New potatoes, Green beans, Lettuce",
    "Tomatoes, Corn, Peaches, Peppers, Green beans, Eggplant, Cantaloupe",
    "Tomatoes, Corn, Apples, Peaches, Peppers, Winter squash, Kale",
    "Apples, Pears, Winter squash, Kale, Brussels sprouts, Cabbage, Pumpkins, Beets",
    "Brussels sprouts, Kale, Cabbage, Storage apples, Potatoes, Turnips, Leeks",
    "Kale, Cabbage, Potatoes, Storage apples, Onions, Winter squash, Leeks",
  ],
  southeast: [
    "Collards, Kale, Citrus, Cabbage, Carrots, Turnips, Broccoli, Radishes",
    "Collards, Citrus, Strawberries, Cabbage, Carrots, Lettuce, Broccoli",
    "Strawberries, Asparagus, Lettuce, Peas, Radishes, Collards, Citrus",
    "Strawberries, Asparagus, Snap peas, Lettuce, New potatoes, Radishes, Kale",
    "Strawberries, Blueberries, Squash, Cucumbers, Corn, Tomatoes, Peppers",
    "Tomatoes, Corn, Peaches, Blueberries, Okra, Peppers, Field peas, Watermelon",
    "Tomatoes, Okra, Corn, Peaches, Peppers, Watermelon, Field peas, Figs",
    "Tomatoes, Okra, Peppers, Muscadines, Sweet potatoes, Eggplant, Peppers",
    "Sweet potatoes, Peppers, Okra, Muscadines, Greens, Pecans, Apples in the hills",
    "Sweet potatoes, Pecans, Collards, Persimmons, Kale, Mustard greens, Apples",
    "Collards, Sweet potatoes, Citrus, Kale, Pecans, Turnips, Broccoli",
    "Citrus, Collards, Kale, Cabbage, Sweet potatoes, Broccoli, Carrots",
  ],
  midwest: [
    "Kale, Cabbage, Potatoes, Onions, Storage squash, Carrots, Beets, Microgreens",
    "Potatoes, Onions, Cabbage, Carrots, Storage squash, Microgreens, Beets",
    "Spinach, Radishes, Green onions, Overwintered kale, Microgreens",
    "Asparagus, Spinach, Radishes, Lettuce, Rhubarb, Green onions",
    "Asparagus, Strawberries, Lettuce, Radishes, Peas, Rhubarb, Spinach",
    "Strawberries, Peas, Cherries, Zucchini, Lettuce, Kale, New potatoes",
    "Blueberries, Cherries, Sweet corn, Green beans, Cucumbers, Zucchini, Beets",
    "Tomatoes, Sweet corn, Peaches, Peppers, Melons, Green beans, Eggplant",
    "Apples, Tomatoes, Sweet corn, Winter squash, Peppers, Grapes, Kale",
    "Apples, Winter squash, Pumpkins, Kale, Cabbage, Brussels sprouts, Potatoes",
    "Brussels sprouts, Kale, Cabbage, Apples, Potatoes, Turnips, Onions",
    "Potatoes, Onions, Cabbage, Storage squash, Carrots, Kale, Beets",
  ],
  south: [
    "Collards, Citrus, Kale, Cabbage, Carrots, Broccoli, Spinach, Turnips",
    "Collards, Citrus, Strawberries, Broccoli, Cabbage, Lettuce, Carrots",
    "Strawberries, Peas, Lettuce, Broccoli, New potatoes, Radishes, Citrus",
    "Strawberries, Squash, Snap peas, Lettuce, New potatoes, Beets",
    "Tomatoes, Squash, Blueberries, Corn, Cucumbers, Blackberries, Peppers",
    "Tomatoes, Peaches, Corn, Okra, Watermelon, Southern peas, Peppers",
    "Tomatoes, Okra, Corn, Peaches, Watermelon, Figs, Peppers, Eggplant",
    "Okra, Peppers, Sweet potatoes, Figs, Eggplant, Hot peppers, Melons",
    "Sweet potatoes, Peppers, Okra, Pecans, Greens, Figs, Apples in the hills",
    "Sweet potatoes, Pecans, Mustard greens, Collards, Persimmons, Peppers",
    "Collards, Sweet potatoes, Pecans, Citrus, Turnips, Kale, Broccoli",
    "Citrus, Collards, Kale, Sweet potatoes, Cabbage, Broccoli, Carrots",
  ],
  southwest: [
    "Citrus, Kale, Spinach, Carrots, Broccoli, Cabbage, Beets, Herbs",
    "Citrus, Spinach, Kale, Carrots, Broccoli, Peas, Lettuce",
    "Peas, Lettuce, Spinach, Carrots, Green garlic, Citrus, Herbs",
    "Asparagus, Peas, Lettuce, Strawberries, Artichokes, Carrots",
    "Strawberries, Apricots, Squash, Garlic, Lettuce, Onions",
    "Cherries, Apricots, Squash, Cucumbers, Green chiles starting, Garlic",
    "Green chiles, Tomatoes, Corn, Melons, Stone fruit, Cucumbers, Basil",
    "Green chiles, Melons, Tomatoes, Peaches, Corn, Eggplant, Basil",
    "Green chiles, Apples, Pears, Winter squash, Tomatoes, Grapes",
    "Chiles, Pomegranates, Winter squash, Apples, Greens, Pears",
    "Pomegranates, Winter squash, Greens, Citrus, Beets, Cabbage",
    "Citrus, Greens, Winter squash, Cabbage, Carrots, Beets, Herbs",
  ],
  mountain: [
    "Storage potatoes, Onions, Cabbage, Carrots, Winter squash, Microgreens",
    "Storage potatoes, Onions, Cabbage, Carrots, Beets, Microgreens",
    "Microgreens, Spinach under cover, Storage roots, Green onions",
    "Spinach, Radishes, Asparagus in the valleys, Lettuce, Green onions",
    "Asparagus, Lettuce, Radishes, Peas, Spinach, Rhubarb",
    "Peas, Lettuce, Cherries, Strawberries in warm valleys, Kale, New potatoes",
    "Cherries, Greens, Peas, New potatoes, Beets, Zucchini in the valleys",
    "Peaches, Tomatoes, Corn, Green beans, Peppers, Melons in the valleys",
    "Peaches, Apples, Tomatoes, Winter squash, Chiles, Corn",
    "Apples, Winter squash, Pumpkins, Kale, Potatoes, Cabbage, Chiles",
    "Winter squash, Potatoes, Kale, Cabbage, Apples, Onions, Carrots",
    "Potatoes, Onions, Cabbage, Carrots, Storage squash, Kale",
  ],
  pacific: [
    "Kale, Cabbage, Leeks, Storage apples, Pears, Potatoes, Brussels sprouts",
    "Kale, Leeks, Cabbage, Purple sprouting broccoli, Storage apples, Potatoes",
    "Purple sprouting broccoli, Kale, Radishes, Spinach, Leeks, Nettles",
    "Asparagus, Radishes, Spinach, Lettuce, Green garlic, Chives",
    "Asparagus, Strawberries, Lettuce, Radishes, Peas, Spinach",
    "Strawberries, Cherries, Peas, Lettuce, Zucchini, Kale, New potatoes",
    "Cherries, Berries, Zucchini, Cucumbers, Green beans, New potatoes, Lettuce",
    "Tomatoes, Berries, Corn, Beans, Peppers, Peaches, Eggplant",
    "Apples, Pears, Tomatoes, Corn, Winter squash, Peppers, Grapes",
    "Apples, Pears, Winter squash, Kale, Chanterelles early in the month, Cranberries, Cabbage",
    "Kale, Brussels sprouts, Cabbage, Pears, Leeks, Potatoes, Cranberries",
    "Kale, Cabbage, Leeks, Potatoes, Storage apples, Brussels sprouts, Pears",
  ],
  california: [
    "Citrus, Kale, Broccoli, Cauliflower, Avocados, Chard, Beets, Leeks",
    "Citrus, Broccoli, Cauliflower, Artichokes, Avocados, Kale, Strawberries",
    "Artichokes, Strawberries, Asparagus, Peas, Citrus, Lettuce, Avocados",
    "Strawberries, Artichokes, Asparagus, Peas, Lettuce, Avocados, New potatoes",
    "Strawberries, Cherries, Apricots, Peas, Lettuce, Garlic, Avocados",
    "Cherries, Apricots, Tomatoes, Corn, Stone fruit, Squash, Berries",
    "Tomatoes, Peaches, Corn, Melons, Peppers, Berries, Figs, Basil",
    "Tomatoes, Figs, Melons, Peppers, Corn, Stone fruit, Eggplant, Grapes",
    "Grapes, Figs, Tomatoes, Peppers, Apples, Pears, Melons",
    "Grapes, Persimmons, Pomegranates, Apples, Kale, Broccoli, Sweet potatoes",
    "Persimmons, Pomegranates, Citrus, Kale, Broccoli, Sweet potatoes, Chard",
    "Citrus, Kale, Broccoli, Avocados, Chard, Persimmons, Cauliflower, Beets",
  ],
  hawaii: [
    "Papaya, Citrus, Avocado, Sweet potato, Bok choy, Green onion, Herbs",
    "Papaya, Citrus, Avocado, Strawberries in the uplands, Greens, Sweet potato",
    "Papaya, Mango starting, Avocado, Lettuce, Green onion, Citrus, Herbs",
    "Mango, Papaya, Avocado, Tomatoes, Lettuce, Sweet potato, Herbs",
    "Mango, Lychee, Papaya, Tomatoes, Cucumbers, Sweet potato, Basil",
    "Mango, Lychee, Papaya, Tomatoes, Corn, Cucumbers, Basil",
    "Mango, Papaya, Tomatoes, Avocado, Corn, Cucumbers, Chili peppers",
    "Avocado, Papaya, Tomatoes, Chili peppers, Sweet potato, Bananas, Greens",
    "Apple bananas, Avocado, Papaya, Tomatoes, Ginger, Greens, Citrus",
    "Apple bananas, Avocado, Citrus, Sweet potato, Greens, Ginger, Papaya",
    "Citrus, Apple bananas, Avocado, Sweet potato, Greens, Green onion",
    "Citrus, Papaya, Avocado, Sweet potato, Bok choy, Herbs, Ginger",
  ],
  alaska: [
    "Storage potatoes, Carrots, Cabbage, Onions, Greenhouse greens, Frozen berries",
    "Storage potatoes, Carrots, Cabbage, Onions, Greenhouse greens",
    "Greenhouse greens, Storage roots, Sprouts, Onions",
    "Greenhouse greens, Radishes, Spinach under cover, Sprouts",
    "Greenhouse lettuce, Radishes, Spinach, Green onions, Rhubarb late in the month",
    "Lettuce, Radishes, Peas, Rhubarb, Spinach, Green onions, New potatoes starting",
    "Lettuce, Peas, Radishes, Strawberries in the south, Herbs, Kale, New potatoes",
    "Berries, Lettuce, Peas, Zucchini, Kale, Carrots, New potatoes, Herbs",
    "Berries, Carrots, Cabbage, Kale, Potatoes, Peas, Lettuce",
    "Storage potatoes, Carrots, Cabbage, Kale, Last greenhouse greens, Lingonberries",
    "Storage potatoes, Carrots, Cabbage, Onions, Frozen berries, Greenhouse greens",
    "Storage potatoes, Carrots, Cabbage, Onions, Frozen berries, Sprouts",
  ],
};

export function regionById(id: string | null | undefined) {
  return REGIONS.find((r) => r.id === id) ?? null;
}

export function cropsFor(region: RegionId, monthIndex: number) {
  const line = CROPS[region][monthIndex] ?? "";
  return [...new Set(line.split(",").map((s) => s.trim()).filter(Boolean))];
}

export function farmNote(region: RegionId, monthIndex: number) {
  const regionLabel = regionById(region)?.label ?? "Your";
  const month = MONTHS[monthIndex] ?? "This month";
  return `${regionLabel} markets in ${month}. ${MONTH_NOTE[monthIndex] ?? ""}`;
}

export function regionFromCoords(lat: number, lng: number): RegionId | null {
  if (lat >= 51 || (lat >= 54 && lng < -130)) return "alaska";
  if (lat > 18 && lat < 23 && lng > -161 && lng < -154) return "hawaii";
  if (lat >= 42 && lat <= 49.2 && lng <= -116.4 && lng >= -124.8) return "pacific";
  if (lat >= 32.5 && lat < 42 && lng <= -114 && lng >= -124.6) return "california";
  if (lat >= 31 && lat < 37.2 && lng <= -103 && lng >= -115) return "southwest";
  if (lat >= 37 && lat <= 49 && lng <= -104 && lng >= -117) return "mountain";
  if (lat >= 25 && lat < 36.8 && lng <= -84 && lng >= -106) return "south";
  if (lat >= 36.5 && lat <= 49.2 && lng <= -82 && lng >= -104) return "midwest";
  if (lat >= 38.5 && lat <= 47.6 && lng <= -66 && lng >= -80.5) return "northeast";
  if (lat >= 24.4 && lat < 36.6 && lng > -88 && lng <= -75) return "southeast";
  return null;
}

export function locateRegion(): Promise<RegionId | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(regionFromCoords(pos.coords.latitude, pos.coords.longitude)),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 1000 * 60 * 30 },
    );
  });
}
