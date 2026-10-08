"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = { id: string; q: string; a: string; tag?: string };

export function Accordion({
  items,
  defaultOpen,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const reduced = useReducedMotion();

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-bone/[0.015] sm:gap-6"
              >
                <span className="mt-2 flex shrink-0 items-center gap-2">
                  <Plus
                    size={13}
                    aria-hidden
                    className={cn(
                      "text-chloro transition-transform duration-500",
                      isOpen ? "rotate-45" : "rotate-0 group-hover:rotate-90",
                    )}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block font-display text-[17px] font-medium tracking-[-0.02em] transition-colors sm:text-[19px]",
                      isOpen ? "text-bone" : "text-sage group-hover:text-bone",
                    )}
                  >
                    {item.q}
                  </span>
                </span>
                {item.tag ? <span className="chip mt-1 hidden shrink-0 sm:inline-flex">{item.tag}</span> : null}
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`${item.id}-panel`}
                  role="region"
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 pl-7 pr-2 text-[14.5px] leading-relaxed text-sage sm:pl-9">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
