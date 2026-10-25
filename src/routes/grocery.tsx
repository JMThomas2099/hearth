import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button, CheckRow, Progress } from "@/components/ui";
import { DRINKS, drinkGrocery } from "@/lib/meals/drinks";
import { groceryByAisle, WEEK_GROCERY } from "@/lib/meals/grocery";
import { extraGrocery } from "@/lib/meals/resolve";
import { usePlan } from "@/lib/store";

export const Route = createFileRoute("/grocery")({ component: GroceryPage });

function GroceryPage() {
  const grocery = usePlan((s) => s.grocery);
  const toggle = usePlan((s) => s.toggleGrocery);
  const resetWeek = usePlan((s) => s.resetWeek);
  const overrides = usePlan((s) => s.overrides);
  const customDrinks = usePlan((s) => s.customDrinks);
  const pinnedDrinks = usePlan((s) => s.pinnedDrinks);
  const groups = groceryByAisle();
  const extras = [...extraGrocery(overrides), ...drinkGrocery([...DRINKS, ...customDrinks], pinnedDrinks)];
  const total = WEEK_GROCERY.length + extras.length;
  const done = [...WEEK_GROCERY, ...extras].filter((i) => grocery[i.id]).length;

  return (
    <AppShell>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-kicker text-muted">Shopping list</p>
          <h1 className="mt-1 font-display text-4xl tracking-tight">This week's market</h1>
          <p className="mt-2 max-w-xl text-muted">
            The draft list for two, plus anything you swapped in and any drinks you pinned.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="no-print self-start" onClick={resetWeek}>
          Clear checks
        </Button>
      </div>

      <Progress className="mt-6 max-w-md" value={total ? (done / total) * 100 : 0} label={`${done} of ${total} in the cart`} />

      {extras.length ? (
        <section className="mt-8 rounded-2xl bg-surface p-4 shadow-border sm:p-5">
          <h2 className="font-display text-2xl tracking-tight">From your meals and drinks</h2>
          <ul className="mt-2">
            {extras.map((item) => (
              <li key={item.id} className="border-b border-rule last:border-0">
                <CheckRow checked={!!grocery[item.id]} onChange={() => toggle(item.id)}>
                  <span>
                    <span className="text-ink">{item.item}</span>
                    {item.qty ? <span className="text-muted"> · {item.qty}</span> : null}
                    <span className="mt-0.5 block text-xs text-faint">{item.for.join(", ")}</span>
                  </span>
                </CheckRow>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {groups.map((group) => (
          <section key={group.aisle} className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
            <h2 className="font-display text-2xl tracking-tight">{group.aisle}</h2>
            <ul className="mt-2">
              {group.items.map((item) => (
                <li key={item.id} className="border-b border-rule last:border-0">
                  <CheckRow checked={!!grocery[item.id]} onChange={() => toggle(item.id)}>
                    <span className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                      <span>
                        <span className="text-ink">{item.item}</span>
                        <span className="text-muted"> · {item.qty}</span>
                      </span>
                      <span className="text-xs text-faint">{item.for.join(", ")}</span>
                    </span>
                  </CheckRow>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
