"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { NAV } from "@/lib/content/site";

/** Hairline progress bar pinned under the nav, with the live section index. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.4 });
  const active = useScrollSpy(NAV.map((item) => item.id));
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => setPercent(Math.round(value * 100)));
    return () => unsubscribe();
  }, [scrollYProgress]);

  const current = NAV.find((item) => item.id === active) ?? NAV[0];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[57px] z-40 h-px">
      <motion.div className="h-full origin-left bg-chloro/70" style={{ scaleX }} />
      <div className="absolute right-4 top-2 hidden items-center gap-2 md:flex">
        <span className="label">
          {current.index} / {NAV.length} · {current.label}
        </span>
        <span className="num label text-bone">{String(percent).padStart(2, "0")}%</span>
      </div>
    </div>
  );
}
