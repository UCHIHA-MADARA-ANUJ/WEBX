"use client";

import { useEffect, useState } from "react";
import { snapshotForPods, type Snapshot } from "@/lib/telemetry";

/**
 * Reads the telemetry feed. Renders a locally generated snapshot immediately
 * (so a panel is never empty or layout-shifting), then swaps in the payload
 * from /api/telemetry and keeps polling.
 */
export function useTelemetry(plantIds: string[], intervalMs = 20000) {
  const key = plantIds.join(",");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    let cancelled = false;

    const tick = async () => {
      if (!cancelled) {
        setSnapshot((prev) => prev ?? snapshotForPods(ids, new Date()));
      }
      try {
        const res = await fetch(`/api/telemetry?pods=${encodeURIComponent(key)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`telemetry ${res.status}`);
        const data = (await res.json()) as Snapshot;
        if (!cancelled) setSnapshot(data);
      } catch {
        if (!cancelled) setSnapshot(snapshotForPods(ids, new Date()));
      }
    };

    void tick();
    const id = window.setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [key, intervalMs]);

  return snapshot;
}
