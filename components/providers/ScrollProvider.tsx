"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { useSettings } from "./SettingsProvider";

type ScrollValue = {
  scrollTo: (target: string | number) => void;
  /** Pause / resume smooth scrolling (used by the boot overlay and the mobile menu). */
  lock: (locked: boolean) => void;
  smooth: boolean;
};

const ScrollContext = createContext<ScrollValue>({ scrollTo: () => {}, lock: () => {}, smooth: false });

const NAV_OFFSET = -88;

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const { reducedMotion, calm } = useSettings();
  const lenisRef = useRef<Lenis | null>(null);
  const smooth = !reducedMotion && !calm;

  useEffect(() => {
    if (!smooth) return;
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [smooth]);

  const scrollTo = useCallback((target: string | number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.1 });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const lock = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const value = useMemo<ScrollValue>(() => ({ scrollTo, lock, smooth }), [lock, scrollTo, smooth]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export const useScrollTo = () => useContext(ScrollContext);
