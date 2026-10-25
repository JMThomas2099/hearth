import { useState } from "react";
import { fitsDiet, type DietId } from "@/lib/meals/diets";
import { placeMeal } from "@/lib/meals/resolve";
import { suggestionsFor } from "@/lib/meals/suggestions";
import type { Meal, Slot } from "@/lib/meals/types";
import { Button } from "@/components/ui";

const field =
  "w-full rounded-lg bg-bg px-3 py-2.5 text-sm text-ink shadow-border outline-none placeholder:text-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive";

export function MealEditor({
  weekday,
  slot,
  meal,
  diet,
  swapped,
  onUse,
  onClear,
}: {
  weekday: number;
  slot: Slot;
  meal: Meal;
  diet: DietId;
  swapped: boolean;
  onUse: (meal: Meal) => void;
  onClear: () => void;
}) {
  const [writing, setWriting] = useState(false);
  const ideas = suggestionsFor(slot, diet, meal.id).slice(0, 6);
  const matches = fitsDiet(meal, diet);

  return (
    <div className="mt-8 space-y-4 border-t border-rule pt-5">
      <div>
        <h3 className="font-display text-lg">Suggestions</h3>
        <p className="mt-1 text-sm text-muted">
          {matches
            ? "The draft is a starting point. Swap in another idea, or write the plate you actually want."
            : "This one sits outside the diet you picked. Take a suggestion, or write your own."}
        </p>
      </div>
      {ideas.length ? (
        <ul className="space-y-2">
          {ideas.map((idea) => (
            <li key={idea.id}>
              <button
                type="button"
                onClick={() => onUse(placeMeal(weekday, slot, idea, false))}
                className="flex w-full items-start justify-between gap-3 rounded-lg bg-surface-2 px-3 py-3 text-left transition-[background-color] duration-150 hover:bg-bg"
              >
                <span>
                  <span className="block font-medium">{idea.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">{idea.blurb}</span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted">{idea.protein}g</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Nothing in the draft matches this diet for this slot. Write one below.</p>
      )}
      {writing ? (
        <CustomForm
          meal={meal}
          slot={slot}
          onCancel={() => setWriting(false)}
          onSave={(next) => {
            onUse(placeMeal(weekday, slot, next, true));
            setWriting(false);
          }}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setWriting(true)}>
            Write your own
          </Button>
          {swapped ? (
            <Button type="button" variant="ghost" onClick={onClear}>
              Restore the draft
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function CustomForm({
  meal,
  slot,
  onSave,
  onCancel,
}: {
  meal: Meal;
  slot: Slot;
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(meal.name);
  const [blurb, setBlurb] = useState(meal.blurb);
  const [minutes, setMinutes] = useState(String(meal.minutes || ""));
  const [calories, setCalories] = useState(meal.calories ? String(meal.calories) : "");
  const [protein, setProtein] = useState(meal.protein ? String(meal.protein) : "");
  const [ingredients, setIngredients] = useState(meal.ingredients.map((i) => (i.qty ? `${i.qty} ${i.item}` : i.item)).join("\n"));
  const [steps, setSteps] = useState(meal.steps.join("\n"));
  const [makeAhead, setMakeAhead] = useState(meal.makeAhead);

  return (
    <form
      className="space-y-3 rounded-xl bg-surface-2 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const title = name.trim();
        if (!title) return;
        const lines = ingredients
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const method = steps
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        onSave({
          ...meal,
          name: title,
          slot,
          blurb: blurb.trim() || "Your meal.",
          minutes: Number(minutes) || 20,
          calories: Number(calories) || 0,
          protein: Number(protein) || 0,
          carbs: 0,
          fat: 0,
          tags: ["Custom"],
          heat: "Cook",
          ingredients: lines.map((line) => ({ item: line, qty: "", aisle: "Pantry" as const })),
          steps: method.length ? method : ["Cook it the way you like."],
          makeAhead: makeAhead.trim() || "Yours to plan.",
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Name</span>
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Note</span>
        <input className={field} value={blurb} onChange={(e) => setBlurb(e.target.value)} />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Minutes</span>
          <input className={field} inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Kcal</span>
          <input className={field} inputMode="numeric" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Protein</span>
          <input className={field} inputMode="numeric" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Ingredients, one per line</span>
        <textarea className={field} rows={4} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Steps, one per line</span>
        <textarea className={field} rows={4} value={steps} onChange={(e) => setSteps(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Make-ahead</span>
        <input className={field} value={makeAhead} onChange={(e) => setMakeAhead(e.target.value)} />
      </label>
      <div className="flex gap-2">
        <Button type="submit">Save meal</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
