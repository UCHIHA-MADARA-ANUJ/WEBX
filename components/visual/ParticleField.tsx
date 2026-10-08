"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/components/providers/SettingsProvider";
import { cn } from "@/lib/utils";

type Spore = { x: number; y: number; r: number; vx: number; vy: number; a: number };

/**
 * Drifting spore field — canvas 2D, capped particle count, paused whenever the
 * element leaves the viewport or the tab is hidden.
 */
export function ParticleField({ className, density = 1 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ambient, tier } = useSettings();

  useEffect(() => {
    if (!ambient) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let spores: Spore[] = [];
    let raf = 0;
    let visible = true;
    let pointer = { x: 0, y: 0 };

    const count = () => {
      const base = tier === "high" ? 74 : tier === "medium" ? 44 : 20;
      return Math.round(base * density);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spores = Array.from({ length: count() }, () => spawn(true));
    };

    const spawn = (initial = false): Spore => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 12,
      r: 0.6 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -0.14 - Math.random() * 0.4,
      a: 0.08 + Math.random() * 0.32,
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const s of spores) {
        s.x += s.vx + (pointer.x - width / 2) * 0.00004;
        s.y += s.vy;
        if (s.y < -14 || s.x < -20 || s.x > width + 20) Object.assign(s, spawn());
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7);
        grad.addColorStop(0, `rgba(63,224,140,${s.a})`);
        grad.addColorStop(1, "rgba(63,224,140,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);

    const onResize = () => resize();
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onVisibility = () => {
      visible = !document.hidden;
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0 });

    observer.observe(canvas);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ambient, density, tier]);

  if (!ambient) return null;

  return <canvas ref={canvasRef} className={cn("pointer-events-none h-full w-full", className)} aria-hidden />;
}
