import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { WeekBoard } from "@/components/meal-views";
import { upcomingHolidays } from "@/lib/meals/holidays";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { upcoming } = upcomingHolidays();
  const next = upcoming[0];

  return (
    <AppShell>
      <WeekBoard />
      {next ? (
        <aside className="no-print mt-10 rounded-2xl bg-surface p-5 shadow-border sm:p-6">
          <p className="text-xs uppercase tracking-kicker text-muted">Next holiday</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl tracking-tight">{next.name}</h2>
              <p className="text-sm text-muted">
                {next.date} · {next.guests} · {next.vibe}
              </p>
            </div>
            <Link
              to="/holidays/$slug"
              params={{ slug: next.id }}
              className="inline-flex h-11 items-center gap-2 self-start rounded-md bg-olive px-4 text-sm font-medium text-olive-fg transition-[background-color,scale] duration-150 hover:bg-ink active:scale-[0.96]"
            >
              Open menu
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </aside>
      ) : null}
    </AppShell>
  );
}
