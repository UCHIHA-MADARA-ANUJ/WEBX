"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section owns the viewport, for the nav + side rail.
 * Uses IntersectionObserver with a mid-viewport band so it never flickers
 * between two sections during a fast scroll.
 */
export function useScrollSpy(ids: string[], offset = 0.35) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length || typeof IntersectionObserver === "undefined") return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let best = "";
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });

        if (best) setActiveId(best);
      },
      {
        rootMargin: `-${Math.round(offset * 100)}% 0px -${Math.round((1 - offset - 0.15) * 100)}% 0px`,
        threshold: [0, 0.15, 0.35, 0.6, 0.9],
      },
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}
