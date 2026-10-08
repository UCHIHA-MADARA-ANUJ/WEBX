"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\·—+*";

/**
 * Decodes text glyph-by-glyph. Default trigger is "view" (plays once as it
 * scrolls in). Reduced motion always renders the plain string.
 */
export function Scramble({
  text,
  className,
  trigger = "view",
  speed = 24,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  trigger?: "view" | "hover" | "always";
  speed?: number;
  as?: "span" | "h2" | "h3" | "div";
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef(0);
  const [output, setOutput] = useState(reduced ? text : trigger === "view" ? "" : text);

  const play = useCallback(() => {
    if (reduced) return;
    window.cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const revealed = Math.floor(elapsed / speed);
      setOutput(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealed) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (revealed <= text.length) {
        frameRef.current = window.requestAnimationFrame(step);
      } else {
        setOutput(text);
      }
    };
    frameRef.current = window.requestAnimationFrame(step);
  }, [reduced, speed, text]);

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }
    if (trigger === "always") {
      play();
      return () => window.cancelAnimationFrame(frameRef.current);
    }
    if (trigger !== "view") return;

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setOutput(text);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          play();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameRef.current);
    };
  }, [play, reduced, text, trigger]);

  return (
    <Tag
      ref={ref as never}
      className={className}
      onMouseEnter={trigger === "hover" ? play : undefined}
      onFocus={trigger === "hover" ? play : undefined}
    >
      {output || text}
    </Tag>
  );
}
