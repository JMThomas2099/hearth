import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DietPills } from "@/components/diet-pills";
import { Button, CheckRow } from "@/components/ui";
import { DRINK_WHENS, drinksFor, type Drink, type DrinkWhen } from "@/lib/meals/drinks";
import { usePlan } from "@/lib/store";

export const Route = createFileRoute("/drinks")({ component: DrinksPage });

const field =
  "w-full rounded-lg bg-bg px-3 py-2.5 text-sm text-ink shadow-border outline-none placeholder:text-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive";

function DrinksPage() {
  const chosenDiet = usePlan((s) => s.diet);
  const dietFilters = usePlan((s) => s.dietFilters);
  const diet = dietFilters ? chosenDiet : "any";
  const custom = usePlan((s) => s.customDrinks);
  const pinned = usePlan((s) => s.pinnedDrinks);
  const toggle = usePlan((s) => s.togglePinnedDrink);
  const addDrink = usePlan((s) => s.addDrink);
  const removeDrink = usePlan((s) => s.removeDrink);
  const suggested = drinksFor(diet);

  return (
    <AppShell>
      <p className="text-xs uppercase tracking-kicker text-muted">Beverages</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight">What to pour</h1>
      <p className="mt-2 max-w-xl text-muted">
        Morning, afternoon, and evening. Suggestions follow the diet on the week. Pin anything you want on the grocery list, or add your own.
      </p>
      <div className="mt-5">
        <DietPills />
      </div>

      <div className="mt-8 space-y-10">
        {DRINK_WHENS.map((when) => {
          const list = suggested.filter((d) => d.when === when);
          if (!list.length) return null;
          return (
            <section key={when}>
              <h2 className="font-display text-2xl tracking-tight">{when}</h2>
              <ul className="mt-3 grid gap-3 lg:grid-cols-2">
                {list.map((drink) => (
                  <DrinkCard key={drink.id} drink={drink} pinned={!!pinned[drink.id]} onToggle={() => toggle(drink.id)} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Your drinks</h2>
        {custom.length ? (
          <ul className="mt-3 grid gap-3 lg:grid-cols-2">
            {custom.map((drink) => (
              <li key={drink.id} className="rounded-2xl bg-surface p-4 shadow-border">
                <DrinkBody drink={drink} pinned={!!pinned[drink.id]} onToggle={() => toggle(drink.id)} />
                <Button variant="ghost" size="sm" className="mt-2 -ml-3" onClick={() => removeDrink(drink.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">Nothing saved yet. The form below keeps it on this device.</p>
        )}
        <DrinkForm
          onSave={(drink) => {
            addDrink(drink);
          }}
        />
      </section>
    </AppShell>
  );
}

function DrinkCard({ drink, pinned, onToggle }: { drink: Drink; pinned: boolean; onToggle: () => void }) {
  return (
    <li className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
      <DrinkBody drink={drink} pinned={pinned} onToggle={onToggle} />
    </li>
  );
}

function DrinkBody({ drink, pinned, onToggle }: { drink: Drink; pinned: boolean; onToggle: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl tracking-tight">{drink.name}</h3>
          <p className="mt-1 text-sm text-muted">{drink.blurb}</p>
        </div>
      </div>
      <ul className="mt-3 divide-y divide-rule">
        {drink.ingredients.map((ing) => (
          <li key={ing.item} className="flex justify-between gap-3 py-1.5 text-sm">
            <span>{ing.item}</span>
            <span className="text-muted">{ing.qty}</span>
          </li>
        ))}
      </ul>
      <ol className="mt-3 space-y-1 text-sm text-muted">
        {drink.steps.map((step, i) => (
          <li key={i}>
            {i + 1}. {step}
          </li>
        ))}
      </ol>
      <div className="mt-2">
        <CheckRow checked={pinned} onChange={onToggle}>
          Add to the grocery list
        </CheckRow>
      </div>
    </>
  );
}

function DrinkForm({ onSave }: { onSave: (drink: Drink) => void }) {
  const [name, setName] = useState("");
  const [when, setWhen] = useState<DrinkWhen>("Evening");
  const [blurb, setBlurb] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  return (
    <form
      className="mt-4 space-y-3 rounded-2xl bg-surface p-4 shadow-border sm:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        const title = name.trim();
        if (!title) return;
        const lines = ingredients
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((line) => ({ item: line, qty: "" }));
        const method = steps
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        onSave({
          id: `custom-drink-${Date.now()}`,
          name: title,
          when,
          blurb: blurb.trim() || "Your pour.",
          ingredients: lines.length ? lines : [{ item: title, qty: "1" }],
          steps: method.length ? method : ["Make it the way you like."],
          custom: true,
        });
        setName("");
        setBlurb("");
        setIngredients("");
        setSteps("");
      }}
    >
      <h3 className="font-display text-xl">Add a drink</h3>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Name</span>
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">When</span>
        <select className={field} value={when} onChange={(e) => setWhen(e.target.value as DrinkWhen)}>
          {DRINK_WHENS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Note</span>
        <input className={field} value={blurb} onChange={(e) => setBlurb(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Ingredients, one per line</span>
        <textarea className={field} rows={3} value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">How to make it</span>
        <textarea className={field} rows={3} value={steps} onChange={(e) => setSteps(e.target.value)} />
      </label>
      <Button type="submit">Save drink</Button>
    </form>
  );
}
