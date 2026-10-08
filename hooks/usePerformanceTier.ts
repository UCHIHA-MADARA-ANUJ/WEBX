"use client";

import { useEffect, useState } from "react";

export type PerfTier = "high" | "medium" | "low";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

/**
 * Coarse device capability probe. Starts conservative ("medium") so we never
 * mount a WebGL canvas on a device that will choke on it, then upgrades.
 */
export function usePerformanceTier(): PerfTier {
  const [tier, setTier] = useState<PerfTier>("medium");

  useEffect(() => {
    const nav = navigator as NavigatorWithHints;
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const saveData = nav.connection?.saveData ?? false;
    const slowNetwork = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
    const narrow = window.matchMedia("(max-width: 640px)").matches;

    let next: PerfTier = "high";
    if (saveData || slowNetwork || cores <= 2 || memory <= 2) next = "low";
    else if (cores <= 4 || memory <= 4 || narrow) next = "medium";

    setTier(next);
  }, []);

  return tier;
}
