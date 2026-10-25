import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarHeart, MapPin, ShoppingBasket, Timer, UtensilsCrossed, Wine } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Week", icon: UtensilsCrossed },
  { to: "/grocery", label: "Shop", icon: ShoppingBasket },
  { to: "/prep", label: "Prep", icon: Timer },
  { to: "/drinks", label: "Drinks", icon: Wine },
  { to: "/season", label: "Farms", icon: MapPin },
  { to: "/holidays", label: "Feasts", icon: CalendarHeart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="no-print border-b border-rule/80 bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl tracking-tight">Hearth</span>
            <span className="hidden text-xs uppercase tracking-kicker text-muted lg:inline">Meal prep</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-[background-color,color] duration-150",
                    active ? "bg-olive text-olive-fg" : "text-muted hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pb-12">{children}</main>

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-surface/95 backdrop-blur-sm md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-6">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium",
                    active ? "text-olive" : "text-muted",
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
