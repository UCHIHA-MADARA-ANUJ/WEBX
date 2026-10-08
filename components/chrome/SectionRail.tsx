"use client";

import { NAV } from "@/lib/content/site";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useScrollTo } from "@/components/providers/ScrollProvider";
import { cn } from "@/lib/utils";

/** Vertical section index — desktop only, hidden under 1280px. */
export function SectionRail() {
  const active = useScrollSpy(NAV.map((item) => item.id));
  const { scrollTo } = useScrollTo();

  return (
    <nav
      aria-label="Section index"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col items-end gap-1.5">
        {NAV.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                className="group flex items-center gap-2 py-0.5"
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-[0.18em] transition-all duration-300",
                    isActive ? "text-chloro opacity-100" : "text-mute opacity-0 group-hover:opacity-100",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "block h-px transition-all duration-400",
                    isActive ? "w-7 bg-chloro" : "w-3.5 bg-bone/25 group-hover:w-5 group-hover:bg-bone/50",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
