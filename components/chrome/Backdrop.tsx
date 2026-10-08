"use client";

import { useSettings } from "@/components/providers/SettingsProvider";

/** Fixed atmospheric layer: grid, vignette, grain film, scan sweep, edge rulers. */
export function Backdrop() {
  const { ambient } = useSettings();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-void" />
      <div className="mask-radial absolute inset-0 grid-lines opacity-70" />
      <div className="absolute inset-0 vignette" />

      {/* edge datum rulers */}
      <div className="absolute inset-y-0 left-0 hidden w-10 border-r border-line/60 lg:block">
        <div className="relative h-full">
          {Array.from({ length: 26 }, (_, i) => (
            <span
              key={i}
              className="absolute left-0 h-px bg-bone/10"
              style={{ top: `${(i / 26) * 100}%`, width: i % 5 === 0 ? 14 : 7 }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-10 border-l border-line/60 lg:block">
        <div className="relative h-full">
          {Array.from({ length: 26 }, (_, i) => (
            <span
              key={i}
              className="absolute right-0 h-px bg-bone/10"
              style={{ top: `${(i / 26) * 100}%`, width: i % 5 === 0 ? 14 : 7 }}
            />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-10 right-10 hidden overflow-hidden lg:block">
        <div className="h-full w-px bg-line/45" style={{ marginLeft: "calc(50% - 660px)" }} />
        <div className="absolute inset-y-0 right-0 w-px bg-line/45" style={{ marginRight: "calc(50% - 660px)" }} />
      </div>

      {ambient ? (
        <>
          <div className="ambient-only absolute inset-0 grain opacity-[0.045] mix-blend-soft-light" />
          <div className="scanline" />
        </>
      ) : null}
    </div>
  );
}
