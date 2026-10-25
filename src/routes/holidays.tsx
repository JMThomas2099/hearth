import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui";
import { upcomingHolidays } from "@/lib/meals/holidays";
import type { HolidayMenu } from "@/lib/meals/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/holidays")({ component: HolidaysPage });

function Card({ holiday, featured }: { holiday: HolidayMenu; featured?: boolean }) {
  return (
    <Link
      to="/holidays/$slug"
      params={{ slug: holiday.id }}
      className={cn(
        "group flex flex-col rounded-2xl bg-surface p-5 shadow-border transition-[box-shadow] duration-150 hover:shadow-border-hover sm:p-6",
        featured && "bg-olive text-olive-fg hover:shadow-none sm:col-span-2",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-xs uppercase tracking-kicker", featured ? "text-olive-fg/70" : "text-muted")}>
          {holiday.season} · {holiday.guests}
        </p>
        {holiday.kicker ? <Badge tone={featured ? "ink" : "olive"}>{holiday.kicker}</Badge> : null}
      </div>
      <h2 className="mt-3 font-display text-3xl tracking-tight">{holiday.name}</h2>
      <p className={cn("mt-1 text-sm", featured ? "text-olive-fg/80" : "text-muted")}>{holiday.date}</p>
      <p className={cn("mt-3 flex-1 text-sm leading-relaxed", featured ? "text-olive-fg/85" : "text-muted")}>
        {holiday.description}
      </p>
      <p className={cn("mt-4 text-sm", featured ? "text-olive-fg/80" : "text-muted")}>
        {holiday.dishes
          .slice(0, 3)
          .map((d) => d.name)
          .join(" · ")}
      </p>
      <span
        className={cn(
          "mt-5 inline-flex h-11 items-center gap-2 self-start text-sm font-medium",
          featured ? "text-olive-fg" : "text-olive",
        )}
      >
        Open the menu
        <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function HolidaysPage() {
  const { upcoming, past } = upcomingHolidays();
  const [next, ...restUpcoming] = upcoming;

  return (
    <AppShell>
      <p className="text-xs uppercase tracking-kicker text-muted">Holiday table</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">Menus for the days that aren't Tuesdays</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Full courses, a make-ahead timeline, and a shopping list for each one. Start with whatever is next on the calendar.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {next ? <Card holiday={next} featured /> : null}
        {restUpcoming.map((h) => (
          <Card key={h.id} holiday={h} />
        ))}
      </div>

      {past.length ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl tracking-tight">Earlier this year</h2>
          <p className="mt-1 text-sm text-muted">Keep them — next year you'll want the same ham glaze.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {past.map((h) => (
              <Card key={h.id} holiday={h} />
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
