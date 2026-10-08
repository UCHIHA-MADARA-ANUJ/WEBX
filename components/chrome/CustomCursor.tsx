"use client";

import { useEffect, useRef, useState } from "react";
import { useHasHover } from "@/hooks/useMediaQuery";
import { useSettings } from "@/components/providers/SettingsProvider";

/**
 * Instrument crosshair. Pointer devices only, disabled under calm mode and
 * reduced motion, and it never swallows a click.
 */
export function CustomCursor() {
  const hasHover = useHasHover();
  const { ambient } = useSettings();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const enabled = hasHover && ambient;

  useEffect(() => {
    if (!enabled) return;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let tx = rx;
    let ty = ry;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      setVisible(true);
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a, button, input, textarea, select, [role=tab], label")));
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    const onLeave = () => setVisible(false);
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-chloro transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, boxShadow: "0 0 12px rgba(63,224,140,0.8)" }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border transition-[width,height,opacity,border-color] duration-300"
        style={{
          width: active ? 42 : 24,
          height: active ? 42 : 24,
          opacity: visible ? (active ? 0.9 : 0.4) : 0,
          borderColor: active ? "rgba(63,224,140,0.8)" : "rgba(241,244,238,0.35)",
        }}
      />
    </div>
  );
}
