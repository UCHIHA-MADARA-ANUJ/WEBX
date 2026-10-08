"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export const MAX_PODS = 4;
export const DEFAULT_PODS = ["tulsi", "tomato", "mint"];

type PodValue = {
  /** Plant ids currently assigned to a physical pod. */
  pods: string[];
  activePlant: string;
  focusedPod: number;
  setFocusedPod: (index: number) => void;
  togglePod: (plantId: string) => void;
  isActive: (plantId: string) => boolean;
  full: boolean;
  reset: () => void;
};

const fallback: PodValue = {
  pods: DEFAULT_PODS,
  activePlant: DEFAULT_PODS[0],
  focusedPod: 0,
  setFocusedPod: () => {},
  togglePod: () => {},
  isActive: () => false,
  full: false,
  reset: () => {},
};

const PodContext = createContext<PodValue>(fallback);

/**
 * Pod assignment state. The specimen library writes it and the telemetry
 * console reads it — pick a plant below and it shows up as a live pod above.
 */
export function PodProvider({ children }: { children: React.ReactNode }) {
  const [pods, setPods] = useState<string[]>(DEFAULT_PODS);
  const [focusedPod, setFocusedPod] = useState(0);

  const togglePod = useCallback((plantId: string) => {
    setPods((current) => {
      if (current.includes(plantId)) {
        return current.length > 1 ? current.filter((id) => id !== plantId) : current;
      }
      if (current.length >= MAX_PODS) {
        return [...current.slice(1), plantId];
      }
      return [...current, plantId];
    });
  }, []);

  const reset = useCallback(() => {
    setPods(DEFAULT_PODS);
    setFocusedPod(0);
  }, []);

  const value = useMemo<PodValue>(
    () => ({
      pods,
      activePlant: pods[Math.min(focusedPod, pods.length - 1)] ?? pods[0] ?? DEFAULT_PODS[0],
      focusedPod: Math.min(focusedPod, Math.max(0, pods.length - 1)),
      setFocusedPod,
      togglePod,
      isActive: (plantId: string) => pods.includes(plantId),
      full: pods.length >= MAX_PODS,
      reset,
    }),
    [pods, focusedPod, togglePod, reset],
  );

  return <PodContext.Provider value={value}>{children}</PodContext.Provider>;
}

export const usePods = () => useContext(PodContext);
