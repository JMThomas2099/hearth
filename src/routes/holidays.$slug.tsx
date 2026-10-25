import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Printer, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge, Button, CheckRow } from "@/components/ui";
import { holidayById } from "@/lib/meals/holidays";
import { usePlan } from "@/lib/store";

export const Route = createFileRoute("/holidays/$slug")({ component: HolidayDetail });

function HolidayDetail() {
  const { slug } = Route.useParams();
  const holiday = holidayById(slug);
  const shop = usePlan((s) => s.holidayShop);
  const prep = usePlan((s) => s.holidayPrep);
  const toggleShop = usePlan((s) => s.toggleHolidayShop);
  const togglePrep = usePlan((s) => s.toggleHolidayPrep);

  if (!holiday) {
    return (
      <AppShell>
        <h1 className="font-display text-3xl">Menu not found</h1>
        <p className="mt-2 text-muted">That holiday isn't in this draft.</p>
        <Button asChild className="mt-6">
          <Link to="/holidays">Back to holidays</Link>
        </Button>
      </AppShell>
    );
  }

  const courses = [...new Set(holiday.dishes.map((d) => d.course))];

  return (
    <AppShell>
      <Link
        to="/holidays"
        className="no-print inline-flex h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        All holidays
      </Link>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-kicker text-muted">
            {holiday.season} · {holiday.date}
          </p>
          <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">{holiday.name}</h1>
          <p className="mt-3 max-w-2xl text-muted">{holiday.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="olive">{holiday.guests}</Badge>
            <Badge>{holiday.vibe}</Badge>
          </div>
        </div>
        <Button variant="outline" className="no-print self-start" onClick={() => window.print()}>
          <Printer className="size-4" />
          Print menu
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-4" /> {holiday.guests}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" /> {holiday.dishes.length} dishes
        </span>
        <span>{holiday.drinks.join(" · ")}</span>
      </div>

      {courses.map((course) => (
        <section key={course} className="mt-10">
          <h2 className="font-display text-2xl tracking-tight">{course}</h2>
          <div className="mt-4 grid gap-4">
            {holiday.dishes
              .filter((d) => d.course === course)
              .map((dish) => (
                <article key={dish.id} className="rounded-2xl bg-surface p-5 shadow-border sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl tracking-tight">{dish.name}</h3>
                    <p className="text-sm text-muted">
                      {dish.minutes} min · serves {dish.serves}
                    </p>
                  </div>
                  <p className="mt-2 text-muted">{dish.blurb}</p>
                  <div className="mt-5 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-xs uppercase tracking-kicker text-muted">Ingredients</h4>
                      <ul className="mt-2 divide-y divide-rule">
                        {dish.ingredients.map((ing) => (
                          <li key={ing.item} className="flex justify-between gap-3 py-2 text-sm">
                            <span>{ing.item}</span>
                            <span className="shrink-0 text-muted">{ing.qty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-kicker text-muted">Method</h4>
                      <ol className="mt-2 space-y-2">
                        {dish.steps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs tabular-nums">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      {dish.makeAhead ? (
                        <p className="mt-4 rounded-md bg-surface-2 px-3 py-2 text-sm text-muted">
                          Make-ahead: {dish.makeAhead}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      ))}

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface p-5 shadow-border sm:p-6">
          <h2 className="font-display text-2xl tracking-tight">Make-ahead timeline</h2>
          <ul className="mt-3">
            {holiday.timeline.map((row, i) => {
              const id = `${holiday.id}-t-${i}`;
              return (
                <li key={id} className="border-b border-rule last:border-0">
                  <CheckRow checked={!!prep[id]} onChange={() => togglePrep(id)}>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-xs uppercase tracking-kicker text-muted">{row.when}</span>
                      <span>{row.task}</span>
                    </span>
                  </CheckRow>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-border sm:p-6">
          <h2 className="font-display text-2xl tracking-tight">Shopping list</h2>
          <div className="mt-3 space-y-4">
            {holiday.shopping.map((group) => (
              <div key={group.aisle}>
                <h3 className="text-xs uppercase tracking-kicker text-muted">{group.aisle}</h3>
                <ul>
                  {group.items.map((item) => {
                    const id = `${holiday.id}-s-${group.aisle}-${item}`;
                    return (
                      <li key={id}>
                        <CheckRow checked={!!shop[id]} onChange={() => toggleShop(id)}>
                          {item}
                        </CheckRow>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
