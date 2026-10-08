"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePerformanceTier, type PerfTier } from "@/hooks/usePerformanceTier";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type SettingsValue = {
  /** User-controlled intensity reduction. */
  calm: boolean;
  toggleCalm: () => void;
  setCalm: (value: boolean) => void;
  reducedMotion: boolean;
  tier: PerfTier;
  /** True when heavy ambient effects (WebGL, canvas, scanlines) should run. */
  ambient: boolean;
};

const fallback: SettingsValue = {
  calm: false,
  toggleCalm: () => {},
  setCalm: () => {},
  reducedMotion: false,
  tier: "medium",
  ambient: true,
};

const SettingsContext = createContext<SettingsValue>(fallback);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const tier = usePerformanceTier();
  const [calm, setCalmState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("verde:calm") === "true") setCalmState(true);
    } catch {
      /* private mode — stay default */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.calm = calm ? "true" : "false";
    if (hydrated) {
      try {
        window.localStorage.setItem("verde:calm", String(calm));
      } catch {
        /* ignore */
      }
    }
  }, [calm, hydrated]);

  const setCalm = useCallback((value: boolean) => setCalmState(value), []);
  const toggleCalm = useCallback(() => setCalmState((c) => !c), []);

  const value = useMemo<SettingsValue>(
    () => ({
      calm,
      toggleCalm,
      setCalm,
      reducedMotion,
      tier,
      ambient: !calm && !reducedMotion && tier !== "low",
    }),
    [calm, toggleCalm, setCalm, reducedMotion, tier],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
