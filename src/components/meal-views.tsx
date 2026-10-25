import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Clock, Flame, Printer, RotateCcw, Users, Utensils } from "lucide-react";
import { DietPills } from "@/components/diet-pills";
import { MealEditor } from "@/components/meal-editor";
import { Badge, Button, Dialog, DialogContent, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";
import { usePlan } from "@/lib/store";
import { dietById, fitsDiet } from "@/lib/meals/diets";
import { cropsFor, MONTHS, regionById } from "@/lib/meals/season";
import { isCustom, isSwap, mealFor, slotKey } from "@/lib/meals/resolve";
import { suggestionsFor } from "@/lib/meals/suggestions";
import { SLOT_LABEL, WEEK, dayTotals } from "@/lib/meals/week";
import type { DayPlan, Meal, Slot } from "@/lib/meals/types";
import { SLOTS } from "@/lib/meals/types";

export function MacroStrip({
  calories,
  protein,
  carbs,
  fat,
}: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) {
  return (
    <dl className="grid grid-cols-4 gap-2 text-center">
      {[
        { k: "kcal", v: calories },
        { k: "protein", v: `${protein}g` },
        { k: "carbs", v: `${carbs}g` },
        { k: "fat", v: `${fat}g` },
      ].map((n) => (
        <div key={n.k} className="rounded-md bg-surface-2/80 px-1 py-2">
          <dt className="text-xs uppercase tracking-kicker text-muted">{n.k}</dt>
          <dd className="font-display text-lg tabular-nums tracking-tight">{n.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MealDialogBody({ meal }: { meal: Meal }) {
  return (
    <div className="space-y-6">
      <p className="text-muted">{meal.blurb}</p>
      <MacroStrip calories={meal.calories} protein={meal.protein} carbs={meal.carbs} fat={meal.fat} />
      <div className="flex flex-wrap gap-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" /> {meal.minutes} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-4" /> {meal.servings} servings
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Flame className="size-4" /> {meal.heat}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {meal.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <section>
        <h3 className="mb-2 font-display text-lg">Ingredients</h3>
        <ul className="divide-y divide-rule">
          {meal.ingredients.map((ing) => (
            <li key={ing.item} className="flex justify-between gap-4 py-2 text-sm">
              <span>{ing.item}</span>
              <span className="shrink-0 text-muted">{ing.qty}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-2 font-display text-lg">Method</h3>
        <ol className="space-y-3">
          {meal.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-olive text-xs text-olive-fg tabular-nums">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="rounded-lg bg-surface-2 p-4">
        <h3 className="mb-1 font-display text-base">Make-ahead</h3>
        <p className="text-sm text-muted">{meal.makeAhead}</p>
        {meal.leftover ? <p className="mt-2 text-sm text-muted">Later: {meal.leftover}</p> : null}
      </section>
    </div>
  );
}

function MealCard({
  meal,
  eaten,
  outside,
  onToggle,
  onOpen,
}: {
  meal: Meal;
  eaten: boolean;
  outside: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl bg-surface p-4 shadow-border transition-[box-shadow,opacity] duration-150",
        eaten && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-kicker text-muted">
            {SLOT_LABEL[meal.slot]} · {meal.heat} · {meal.minutes}m
          </p>
          <h3 className="mt-1 font-display text-xl leading-snug tracking-tight">{meal.name}</h3>
        </div>
        <button
          type="button"
          aria-label={eaten ? "Mark as not eaten" : "Mark as cooked"}
          onClick={onToggle}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-md transition-[background-color,color] duration-150",
            eaten ? "bg-olive text-olive-fg" : "bg-surface-2 text-muted hover:text-ink",
          )}
        >
          <Check className="size-5" />
        </button>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{meal.blurb}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {isCustom(meal) ? <Badge tone="olive">Yours</Badge> : null}
        {isSwap(meal) && !isCustom(meal) ? <Badge>Swapped</Badge> : null}
        {outside ? <Badge>Outside diet</Badge> : null}
        <span className="text-xs tabular-nums text-muted">
          {meal.calories ? `${meal.calories} kcal` : "Macros open"} · {meal.protein ? `${meal.protein}g protein` : "protein open"}
        </span>
      </div>
      <Button variant="ghost" size="sm" className="mt-3 -ml-3" onClick={onOpen}>
        Open recipe
      </Button>
    </article>
  );
}

export function WeekBoard() {
  const [selected, setSelected] = useState(() => new Date().getDay());
  const [openSlot, setOpenSlot] = useState<{ weekday: number; slot: Slot } | null>(null);
  const eaten = usePlan((s) => s.eaten);
  const toggleEaten = usePlan((s) => s.toggleEaten);
  const resetWeek = usePlan((s) => s.resetWeek);
  const notes = usePlan((s) => s.notes);
  const setNote = usePlan((s) => s.setNote);
  const chosenDiet = usePlan((s) => s.diet);
  const dietFilters = usePlan((s) => s.dietFilters);
  const diet = dietFilters ? chosenDiet : "any";
  const overrides = usePlan((s) => s.overrides);
  const setOverride = usePlan((s) => s.setOverride);
  const clearOverride = usePlan((s) => s.clearOverride);
  const clearOverrides = usePlan((s) => s.clearOverrides);
  const regionId = usePlan((s) => s.regionId);
  const monthIndex = new Date().getMonth();
  const region = regionById(regionId);
  const seasonPeek = region ? cropsFor(region.id, monthIndex).slice(0, 3) : [];

  const resolved = useMemo(
    () =>
      WEEK.map((day) => ({
        day,
        meals: Object.fromEntries(SLOTS.map((slot) => [slot, mealFor(day.weekday, slot, overrides)])) as Record<Slot, Meal>,
      })),
    [overrides],
  );
  const flat = resolved.flatMap((d) => SLOTS.map((slot) => d.meals[slot]));
  const outsideCount = flat.filter((meal) => !fitsDiet(meal, diet)).length;
  const avgs = useMemo(() => {
    const n = resolved.length || 1;
    const sum = resolved.reduce(
      (acc, d) => {
        const t = dayTotals({ ...d.day, meals: d.meals });
        return { calories: acc.calories + t.calories, protein: acc.protein + t.protein };
      },
      { calories: 0, protein: 0 },
    );
    return { calories: Math.round(sum.calories / n), protein: Math.round(sum.protein / n) };
  }, [resolved]);
  const done = flat.filter((meal) => eaten[meal.id]).length;
  const current = resolved[selected] ?? resolved[0];
  const openMeal = openSlot ? mealFor(openSlot.weekday, openSlot.slot, overrides) : null;
  const openKey = openSlot ? slotKey(openSlot.weekday, openSlot.slot) : "";

  if (!current) return null;

  function swapMismatches() {
    for (const day of WEEK) {
      for (const slot of SLOTS) {
        const meal = mealFor(day.weekday, slot, usePlan.getState().overrides);
        if (fitsDiet(meal, diet)) continue;
        const idea = suggestionsFor(slot, diet, meal.id)[0];
        if (!idea) continue;
        setOverride(slotKey(day.weekday, slot), { ...idea, slot, id: `pick-${slotKey(day.weekday, slot)}` });
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-kicker text-muted">This week</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">Autumn reset</h1>
          <p className="mt-2 max-w-xl text-muted">
            A suggested draft for two. Keep it, swap a plate, or write your own.
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button variant="ghost" size="sm" onClick={resetWeek}>
            <RotateCcw className="size-4" />
            Reset checks
          </Button>
          {Object.keys(overrides).length ? (
            <Button variant="ghost" size="sm" onClick={clearOverrides}>
              Restore draft
            </Button>
          ) : null}
        </div>
      </div>

      <DietPills />

      {diet !== "any" && outsideCount > 0 ? (
        <div className="no-print flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-border sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {outsideCount} {outsideCount === 1 ? "meal sits" : "meals sit"} outside {dietById(diet).label.toLowerCase()}.
            Swap them one at a time, or fill the gaps with suggestions.
          </p>
          <Button size="sm" variant="outline" onClick={swapMismatches}>
            Swap mismatches
          </Button>
        </div>
      ) : null}

      <Link
        to="/season"
        className="no-print block rounded-2xl bg-surface p-4 shadow-border transition-[box-shadow] duration-150 hover:shadow-border-hover sm:p-5"
      >
        <p className="text-xs uppercase tracking-kicker text-muted">
          {MONTHS[monthIndex]} at the farm stand
        </p>
        <p className="mt-1 font-display text-2xl tracking-tight">
          {region ? region.label : "Set your market"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {region
            ? `${seasonPeek.join(", ")}. The list moves on the first of the month.`
            : "Pick a region, or use your location, for what growers have this month."}
        </p>
      </Link>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
          <p className="text-xs uppercase tracking-kicker text-muted">Daily average</p>
          <p className="mt-1 font-display text-3xl tabular-nums tracking-tight">{avgs.calories}</p>
          <p className="text-sm text-muted">kcal · {avgs.protein}g protein</p>
        </div>
        <div className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
          <p className="text-xs uppercase tracking-kicker text-muted">Week progress</p>
          <p className="mt-1 font-display text-3xl tabular-nums tracking-tight">
            {done}/{flat.length}
          </p>
          <Progress className="mt-3" value={flat.length ? (done / flat.length) * 100 : 0} label="Meals cooked or eaten" />
        </div>
        <Link to="/prep" className="rounded-2xl bg-olive p-4 text-olive-fg shadow-border sm:p-5">
          <p className="text-xs uppercase tracking-kicker text-olive-fg/70">Sunday cook</p>
          <p className="mt-1 font-display text-3xl tracking-tight">~3 hours</p>
          <p className="text-sm text-olive-fg/80">Open the prep board. Then four dinners are already spoken for.</p>
        </Link>
      </div>

      <div className="no-print -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2 sm:grid sm:min-w-0 sm:grid-cols-7">
          {resolved.map(({ day, meals }, i) => {
            const active = i === selected;
            const dayDone = SLOTS.filter((s) => eaten[meals[s].id]).length;
            return (
              <button
                key={day.name}
                type="button"
                onClick={() => setSelected(i)}
                className={cn(
                  "flex min-h-16 min-w-24 flex-col items-start rounded-xl px-3 py-2.5 text-left transition-[background-color,color] duration-150 sm:min-w-0",
                  active ? "bg-olive text-olive-fg" : "bg-surface text-ink shadow-border hover:shadow-border-hover",
                )}
              >
                <span className="text-xs uppercase tracking-kicker opacity-70">{day.name.slice(0, 3)}</span>
                <span className="font-display text-lg leading-tight">{day.kicker.split(" ")[0]}</span>
                <span className={cn("mt-1 text-xs tabular-nums", active ? "text-olive-fg/80" : "text-muted")}>
                  {dayDone}/4
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <DaySection
        day={current.day}
        meals={current.meals}
        totals={dayTotals({ ...current.day, meals: current.meals })}
        eaten={eaten}
        diet={diet}
        note={notes[current.day.name] ?? ""}
        onNote={(v) => setNote(current.day.name, v)}
        onToggle={toggleEaten}
        onOpen={(slot) => setOpenSlot({ weekday: current.day.weekday, slot })}
      />

      <GlanceGrid
        selected={selected}
        eaten={eaten}
        overrides={overrides}
        onPickDay={setSelected}
        onOpen={(weekday, slot) => setOpenSlot({ weekday, slot })}
      />

      <Dialog open={!!openSlot} onOpenChange={(o) => !o && setOpenSlot(null)}>
        {openMeal && openSlot ? (
          <DialogContent title={openMeal.name} className="sm:max-w-xl">
            <MealDialogBody meal={openMeal} />
            <MealEditor
              weekday={openSlot.weekday}
              slot={openSlot.slot}
              meal={openMeal}
              diet={diet}
              swapped={Boolean(overrides[openKey])}
              onUse={(meal) => setOverride(openKey, meal)}
              onClear={() => clearOverride(openKey)}
            />
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function DaySection({
  day,
  meals,
  totals,
  eaten,
  diet,
  note,
  onNote,
  onToggle,
  onOpen,
}: {
  day: DayPlan;
  meals: Record<Slot, Meal>;
  totals: ReturnType<typeof dayTotals>;
  eaten: Record<string, boolean>;
  diet: ReturnType<typeof usePlan.getState>["diet"];
  note: string;
  onNote: (v: string) => void;
  onToggle: (id: string) => void;
  onOpen: (slot: Slot) => void;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-tight">{day.name}</h2>
          <p className="text-muted">{day.kicker}</p>
        </div>
        <p className="max-w-lg text-sm text-muted">{day.note}</p>
      </div>
      <MacroStrip calories={totals.calories} protein={totals.protein} carbs={totals.carbs} fat={totals.fat} />
      <div className="grid gap-3 lg:grid-cols-2">
        {SLOTS.map((slot) => (
          <MealCard
            key={slot}
            meal={meals[slot]}
            eaten={!!eaten[meals[slot].id]}
            outside={!fitsDiet(meals[slot], diet)}
            onToggle={() => onToggle(meals[slot].id)}
            onOpen={() => onOpen(slot)}
          />
        ))}
      </div>
      <label className="no-print block">
        <span className="mb-1.5 block text-xs uppercase tracking-kicker text-muted">Day note</span>
        <textarea
          value={note}
          onChange={(e) => onNote(e.target.value)}
          rows={2}
          placeholder="Thaw the shrimp. Pack extra lemon."
          className="w-full rounded-lg bg-surface px-3 py-3 text-sm shadow-border outline-none placeholder:text-faint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
        />
      </label>
    </section>
  );
}

function GlanceGrid({
  selected,
  eaten,
  overrides,
  onPickDay,
  onOpen,
}: {
  selected: number;
  eaten: Record<string, boolean>;
  overrides: Record<string, Meal>;
  onPickDay: (i: number) => void;
  onOpen: (weekday: number, slot: Slot) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Utensils className="size-4 text-muted" />
        <h2 className="font-display text-2xl tracking-tight">Week at a glance</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-surface shadow-border">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-rule text-xs uppercase tracking-kicker text-muted">
              <th className="px-3 py-3 font-medium"> </th>
              {WEEK.map((d, i) => (
                <th key={d.name} className="px-2 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => onPickDay(i)}
                    className={cn("rounded-sm px-1 py-0.5", i === selected && "bg-olive text-olive-fg")}
                  >
                    {d.name.slice(0, 3)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot: Slot) => (
              <tr key={slot} className="border-b border-rule last:border-0">
                <th className="px-3 py-3 text-xs font-medium uppercase tracking-kicker text-muted">{SLOT_LABEL[slot]}</th>
                {WEEK.map((d) => {
                  const meal = mealFor(d.weekday, slot, overrides);
                  return (
                    <td key={slotKey(d.weekday, slot)} className="px-2 py-2 align-top">
                      <button
                        type="button"
                        onClick={() => onOpen(d.weekday, slot)}
                        className={cn(
                          "w-full rounded-md px-2 py-2 text-left leading-snug transition-[background-color] duration-150 hover:bg-surface-2",
                          eaten[meal.id] && "text-muted line-through",
                        )}
                      >
                        {meal.name}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
