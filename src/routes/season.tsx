import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui";
import {
  MONTHS,
  REGIONS,
  cropsFor,
  farmNote,
  locateRegion,
  type RegionId,
} from "@/lib/meals/season";
import { usePlan } from "@/lib/store";

export const Route = createFileRoute("/season")({ component: SeasonPage });

function SeasonPage() {
  const regionId = usePlan((s) => s.regionId);
  const setRegion = usePlan((s) => s.setRegion);
  const now = new Date().getMonth();
  const [month, setMonth] = useState(now);
  const [status, setStatus] = useState<"idle" | "locating" | "miss">("idle");
  const region = REGIONS.find((r) => r.id === regionId) ?? null;
  const crops = region ? cropsFor(region.id, month) : [];

  return (
    <AppShell>
      <p className="text-xs uppercase tracking-kicker text-muted">Farmers market</p>
      <h1 className="mt-1 font-display text-4xl tracking-tight sm:text-5xl">In season</h1>
      <p className="mt-2 max-w-xl text-muted">
        What growers actually have, by region. This page opens on {MONTHS[now]} and rolls forward on the first. Pick where you shop, or use your location.
      </p>

      <div className="no-print mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm">
          <span className="mb-1 block text-xs uppercase tracking-kicker text-muted">Region</span>
          <select
            className="h-11 w-full rounded-lg bg-surface px-3 text-sm shadow-border outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
            value={regionId ?? ""}
            onChange={(e) => setRegion((e.target.value || null) as RegionId | null)}
          >
            <option value="">Choose a region</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="outline"
          onClick={() => {
            setStatus("locating");
            void locateRegion().then((id) => {
              if (id) {
                setRegion(id);
                setStatus("idle");
              } else {
                setStatus("miss");
              }
            });
          }}
        >
          <MapPin className="size-4" />
          {status === "locating" ? "Finding you" : "Use my location"}
        </Button>
      </div>
      {status === "miss" ? (
        <p className="mt-2 text-sm text-muted">Location stayed off, or it isn’t in a region we cover. Pick the market you actually shop.</p>
      ) : null}
      {region ? <p className="mt-2 text-sm text-muted">{region.places}</p> : null}

      <div className="no-print mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2">
          {MONTHS.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={i === month}
              onClick={() => setMonth(i)}
              className={
                i === month
                  ? "h-11 rounded-full bg-olive px-4 text-sm font-medium text-olive-fg"
                  : "h-11 rounded-full bg-surface px-4 text-sm font-medium text-muted shadow-border"
              }
            >
              {label.slice(0, 3)}
              {i === now ? " · now" : ""}
            </button>
          ))}
        </div>
      </div>

      {region ? (
        <section className="mt-8">
          <h2 className="font-display text-3xl tracking-tight">
            {MONTHS[month]} · {region.label}
          </h2>
          <p className="mt-2 max-w-2xl text-muted">{farmNote(region.id, month)}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {crops.map((crop) => (
              <li key={crop} className="rounded-2xl bg-surface px-4 py-4 shadow-border">
                <p className="font-display text-xl tracking-tight">{crop}</p>
                <p className="mt-1 text-sm text-muted">Ask whose farm it came from. A wholesaler sticker is not the same thing.</p>
              </li>
            ))}
          </ul>
          {month !== now ? (
            <Button className="no-print mt-6" variant="ghost" onClick={() => setMonth(now)}>
              Back to {MONTHS[now]}
            </Button>
          ) : null}
        </section>
      ) : (
        <p className="mt-8 max-w-lg text-muted">
          Choose a region to see the month. The list is the same one a farm stand would tape to the table — storage crops in winter, the glut in August, citrus where it grows.
        </p>
      )}
    </AppShell>
  );
}
