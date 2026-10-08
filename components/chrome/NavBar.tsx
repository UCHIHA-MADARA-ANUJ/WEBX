"use client";

import { AnimatePresence, motion } from "motion/react";
import { Command, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/content/site";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useScrollTo } from "@/components/providers/ScrollProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { cn } from "@/lib/utils";

const PRIMARY = ["manifesto", "system", "telemetry", "hardware", "intelligence", "specimens", "team"];

export function NavBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(NAV.map((item) => item.id));
  const { scrollTo, lock } = useScrollTo();
  const { calm, toggleCalm } = useSettings();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 700 && y > last + 4);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lock(open);
    return () => lock(false);
  }, [lock, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(id);
  };

  const items = NAV.filter((item) => PRIMARY.includes(item.id));

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "border-b transition-colors duration-500",
            scrolled || open ? "border-line bg-void/80 backdrop-blur-xl" : "border-transparent",
          )}
        >
          <div className="mx-auto flex h-14 w-full max-w-[1320px] items-center justify-between gap-4 px-5 sm:px-7 lg:px-12">
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="group flex shrink-0 items-center gap-2.5"
              aria-label="Back to top"
            >
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inset-0 rounded-md border border-chloro/40 bg-chloro/10 transition-colors group-hover:bg-chloro/20" />
                <span className="relative block h-3 w-3 rounded-full border border-chloro" />
                <span className="absolute block h-1 w-1 rounded-full bg-chloro" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[13px] font-bold tracking-[0.08em] text-bone">VERDE</span>
                <span className="label mt-0.5 text-[8px] tracking-[0.28em]">{SITE.version} · {SITE.edition}</span>
              </span>
            </button>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={cn(
                    "relative rounded-md px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors",
                    active === item.id ? "text-chloro" : "text-sage hover:text-bone",
                  )}
                >
                  {item.label}
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-px h-px bg-chloro"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenPalette}
                className="hidden items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-mute transition-colors hover:border-chloro/40 hover:text-bone sm:flex"
                aria-label="Open command palette"
              >
                <Command size={12} aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em]">K</span>
              </button>

              <button
                type="button"
                onClick={toggleCalm}
                aria-pressed={calm}
                className={cn(
                  "hidden items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors sm:flex",
                  calm ? "border-chloro/45 bg-chloro/[0.08] text-chloro" : "border-line text-sage hover:text-bone",
                )}
                title="Reduces ambient motion and disables smooth scrolling"
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", calm ? "bg-chloro" : "bg-mute")} aria-hidden />
                calm
              </button>

              <button type="button" className="btn btn-ghost hidden px-3.5 py-2 text-[10px] md:inline-flex" onClick={() => go("contact")}>
                contact
              </button>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line text-bone lg:hidden"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Section index"
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-void/97 pt-16 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto max-w-2xl px-6 pb-16">
              <p className="label mt-6">section index · {NAV.length} entries</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {NAV.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      className="flex w-full items-baseline gap-4 py-3.5 text-left"
                    >
                      <span className={cn("font-mono text-[10px]", active === item.id ? "text-chloro" : "text-mute")}>
                        {item.index}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block font-display text-lg font-medium tracking-[-0.02em]",
                            active === item.id ? "text-chloro" : "text-bone",
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-mute">{item.blurb}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" className="btn btn-ghost flex-1" onClick={toggleCalm} aria-pressed={calm}>
                  {calm ? "calm mode: on" : "calm mode: off"}
                </button>
                <button type="button" className="btn btn-primary flex-1" onClick={() => go("contact")}>
                  open channel
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
