"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Streams log lines like a serial monitor. Stops when scrolled out of view and
 * dumps everything at once under prefers-reduced-motion.
 */
export function Terminal({
  lines,
  intervalMs = 850,
  className,
  title = "verde@shelf ~ serial",
  height = "16rem",
  loop = false,
}: {
  lines: string[];
  intervalMs?: number;
  className?: string;
  title?: string;
  height?: string;
  loop?: boolean;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? lines.length : 0);
  const [running, setRunning] = useState(true);
  const scroller = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setRunning(entries[0]?.isIntersecting ?? true), {
      threshold: 0.1,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) {
      setCount(lines.length);
      return;
    }
    if (!running) return;
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= lines.length) {
          return loop ? 0 : current;
        }
        return current + 1;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, lines.length, loop, reduced, running]);

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [count]);

  return (
    <div ref={rootRef} className={cn("panel-flat overflow-hidden", className)}>
      <header className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] text-sage">{title}</span>
        <span className="flex items-center gap-2">
          <span className={cn("dot", running && !reduced && "dot-live")} aria-hidden />
          <span className="label">{running ? "streaming" : "paused"}</span>
        </span>
      </header>
      <div ref={scroller} className="hide-scrollbar overflow-y-auto px-4 py-3" style={{ height }}>
        <pre className="term whitespace-pre-wrap break-words text-sage">
          {lines.slice(0, count).map((line, index) => (
            <span key={`${line}-${index}`} className="block">
              <span className="text-mute/70">{String(index + 1).padStart(2, "0")} </span>
              <span className={/err|fail|timeout/i.test(line) ? "text-rust" : /ok|nominal|complete/i.test(line) ? "text-bone" : ""}>
                {line}
              </span>
            </span>
          ))}
          {count < lines.length ? <span className="inline-block h-3.5 w-1.5 animate-blink bg-chloro align-middle" /> : null}
        </pre>
      </div>
    </div>
  );
}
