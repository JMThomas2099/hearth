import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button, CheckRow, Progress } from "@/components/ui";
import { FRIDGE_MAP, PREP_TASKS } from "@/lib/meals/prep";
import { usePlan } from "@/lib/store";

export const Route = createFileRoute("/prep")({ component: PrepPage });

function PrepPage() {
  const prep = usePlan((s) => s.prep);
  const toggle = usePlan((s) => s.togglePrep);
  const done = PREP_TASKS.filter((t) => prep[t.id]).length;
  const swapped = usePlan((s) => Object.keys(s.overrides).length);
  const totalMin = PREP_TASKS.reduce((s, t) => s + t.minutes, 0);

  return (
    <AppShell>
      <p className="text-xs uppercase tracking-kicker text-muted">Sunday cook-down</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight">The board</h1>
      <p className="mt-2 max-w-xl text-muted">
        About {totalMin} minutes of overlapping work — oven, chili, grains, sauces. Check them off as you go. The week lives in the fridge by 3 p.m.
      </p>
      {swapped ? (
        <p className="mt-2 max-w-xl text-sm text-muted">
          You changed {swapped} {swapped === 1 ? "plate" : "plates"}. This board is still the original Sunday draft — cook the swaps on their own time.
        </p>
      ) : null}

      <Progress className="mt-6 max-w-md" value={(done / PREP_TASKS.length) * 100} label={`${done} of ${PREP_TASKS.length} tasks`} />

      <ol className="mt-8 space-y-3">
        {PREP_TASKS.map((task) => (
          <li key={task.id} className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
            <div className="flex items-start gap-3">
              <span className="w-12 shrink-0 font-display text-xl tabular-nums text-olive">{task.clock}</span>
              <div className="min-w-0 flex-1">
                <CheckRow checked={!!prep[task.id]} onChange={() => toggle(task.id)} className="py-0">
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-ink">{task.title}</span>
                    <span className="text-sm text-muted no-underline">{task.detail}</span>
                    <span className="text-xs uppercase tracking-kicker text-faint">{task.minutes} min</span>
                  </span>
                </CheckRow>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-10 rounded-2xl bg-olive p-5 text-olive-fg sm:p-6">
        <h2 className="font-display text-2xl tracking-tight">Fridge map</h2>
        <ul className="mt-4 space-y-3">
          {FRIDGE_MAP.map((row) => (
            <li key={row.shelf} className="grid gap-1 border-b border-olive-fg/15 pb-3 last:border-0 sm:grid-cols-4">
              <span className="text-xs uppercase tracking-kicker text-olive-fg/70">{row.shelf}</span>
              <span className="sm:col-span-3">{row.holds}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="no-print mt-8 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/">Open the week</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/grocery">Shopping list</Link>
        </Button>
      </div>
    </AppShell>
  );
}
