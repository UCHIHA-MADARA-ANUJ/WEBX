"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BOOT_SEQUENCE } from "@/lib/content/firmware";
import { SITE } from "@/lib/content/site";
import { useSettings } from "@/components/providers/SettingsProvider";
import { useScrollTo } from "@/components/providers/ScrollProvider";

const SESSION_KEY = "verde:booted";

/**
 * Cold-boot sequence. Shown once per browser session, never blocks the page
 * for reduced-motion users, and is skippable three different ways.
 */
export function BootOverlay() {
  const { reducedMotion, calm } = useSettings();
  const { lock } = useScrollTo();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion || calm) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      return;
    }
    setOpen(true);
    setReady(true);
  }, [calm, reducedMotion]);

  useEffect(() => {
    if (!open) return;
    if (step >= BOOT_SEQUENCE.length) {
      const id = window.setTimeout(() => setOpen(false), 520);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setStep((s) => s + 1), BOOT_SEQUENCE[step].ms);
    return () => window.clearTimeout(id);
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    lock(true);
    const skip = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") setOpen(false);
    };
    window.addEventListener("keydown", skip);
    return () => {
      lock(false);
      window.removeEventListener("keydown", skip);
    };
  }, [lock, open]);

  useEffect(() => {
    if (open || !ready) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [open, ready]);

  if (!ready) return null;

  const progress = Math.min(1, step / BOOT_SEQUENCE.length);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-void px-6"
        >
          <div className="mask-radial absolute inset-0 grid-lines opacity-60" aria-hidden />
          <div className="absolute inset-0 vignette" aria-hidden />

          <div className="relative w-full max-w-lg">
            <div className="flex items-center justify-between">
              <span className="label-signal">{SITE.name}</span>
              <span className="label">bios {SITE.version}</span>
            </div>

            <div className="rule my-4" />

            <ol className="space-y-1.5" aria-live="polite">
              {BOOT_SEQUENCE.slice(0, step).map((line, index) => (
                <li key={line.text} className="term flex items-baseline gap-3 text-sage">
                  <span className="text-mute/60">{String(index + 1).padStart(2, "0")}</span>
                  <span>{line.text}</span>
                </li>
              ))}
              {step < BOOT_SEQUENCE.length ? (
                <li className="term flex items-center gap-2 text-chloro">
                  <span className="inline-block h-3 w-1.5 animate-blink bg-chloro" aria-hidden />
                  <span className="text-mute/70">working</span>
                </li>
              ) : null}
            </ol>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-line">
                <span
                  className="block h-px bg-chloro transition-[width] duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
              <span className="num label text-bone">{Math.round(progress * 100)}%</span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="serif text-lg text-sage">{SITE.tagline}</p>
              <button type="button" className="btn btn-quiet px-3 py-2 text-[10px]" onClick={() => setOpen(false)}>
                skip boot
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
