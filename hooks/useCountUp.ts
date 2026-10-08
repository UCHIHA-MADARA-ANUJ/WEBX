"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { round } from "@/lib/utils";

/** Counts up to `target` once the element scrolls into view. */
export function useCountUp(target: number, decimals = 0, duration = 1.6) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(round(target, decimals).toFixed(decimals));
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(round(v, decimals).toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, target, decimals, duration, reduced]);

  return { ref, display };
}

/** Re-renders on an interval — used by clocks and simulated feeds. */
export function useClock(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
