import { dietById, DIETS, type DietId } from "@/lib/meals/diets";
import { usePlan } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DietPills() {
  const diet = usePlan((s) => s.diet);
  const setDiet = usePlan((s) => s.setDiet);
  const filtersOn = usePlan((s) => s.dietFilters);
  const setDietFilters = usePlan((s) => s.setDietFilters);

  return (
    <div className="space-y-3">
      <div className="no-print flex items-center justify-between gap-4 rounded-2xl bg-surface px-4 py-2 shadow-border">
        <div>
          <p className="text-sm font-medium">Diet filters</p>
          <p className="text-sm text-muted">
            {filtersOn ? dietById(diet).blurb : "Off. Every meal and drink stays on the table."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={filtersOn}
          aria-label="Diet filters"
          onClick={() => setDietFilters(!filtersOn)}
          className={cn(
            "relative h-11 w-16 shrink-0 rounded-full p-1 transition-[background-color] duration-150",
            filtersOn ? "bg-olive" : "bg-surface-2 shadow-border",
          )}
        >
          <span
            className={cn(
              "block size-8 rounded-full shadow-border transition-transform duration-150",
              filtersOn ? "translate-x-6 bg-olive-fg" : "translate-x-0 bg-surface",
            )}
          />
        </button>
      </div>
      {filtersOn ? (
        <div className="no-print -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex min-w-max gap-2" role="group" aria-label="Diet">
            {DIETS.map((item) => {
              const on = diet === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setDiet(item.id as DietId)}
                  className={cn(
                    "h-11 rounded-full px-4 text-sm font-medium transition-[background-color,color] duration-150",
                    on ? "bg-olive text-olive-fg" : "bg-surface text-muted shadow-border hover:text-ink",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
