"use client";

import { useId, useMemo, useState } from "react";
import { cn, clamp, round } from "@/lib/utils";
import type { HistoryPoint } from "@/lib/telemetry";

export type SeriesKey = "moisture" | "temp" | "tank";

export type SeriesConfig = { key: SeriesKey; label: string; accent: string; unit: string };

/** Scrollable instrument trace with a hover crosshair and readout. */
export function LineChart({
  points,
  series,
  band,
  height = 260,
  className,
}: {
  points: HistoryPoint[];
  series: SeriesConfig[];
  band?: [number, number];
  height?: number;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const id = useId().replace(/:/g, "");

  const { yMin, yMax } = useMemo(() => {
    const values = points.flatMap((p) => series.map((s) => p[s.key]));
    if (band) values.push(band[0], band[1]);
    const lo = Math.min(...values, 0);
    const hi = Math.max(...values, 10);
    const pad = (hi - lo) * 0.12 || 4;
    return { yMin: Math.max(0, lo - pad), yMax: hi + pad };
  }, [points, series, band]);

  const W = 1000;
  const H = 300;
  const span = yMax - yMin || 1;
  const xOf = (i: number) => (points.length <= 1 ? 0 : (i / (points.length - 1)) * W);
  const yOf = (value: number) => H - ((value - yMin) / span) * H;

  const paths = series.map((s) => ({
    ...s,
    d: points.map((p, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(2)},${yOf(p[s.key]).toFixed(2)}`).join(" "),
  }));

  const active = hover != null ? points[hover] : null;

  return (
    <div className={cn("relative", className)} onMouseLeave={() => setHover(null)}>
      {/* readout strip */}
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.accent }} aria-hidden />
            <span className="label">{s.label}</span>
            <span className="num text-xs text-bone">
              {active ? `${round(active[s.key], 1)}${s.unit}` : "—"}
            </span>
          </span>
        ))}
        {active ? <span className="label ml-auto hidden sm:block">t {active.label}</span> : null}
      </div>

      <div className="inset-well relative overflow-hidden" style={{ height }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
            setHover(Math.round(ratio * (points.length - 1)));
          }}
          role="img"
          aria-label={`History chart: ${series.map((s) => s.label).join(", ")}`}
        >
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.accent} stopOpacity="0.22" />
                <stop offset="100%" stopColor={s.accent} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* horizontal grid */}
          {[0.2, 0.4, 0.6, 0.8].map((g) => (
            <line
              key={g}
              x1={0}
              x2={W}
              y1={H * g}
              y2={H * g}
              stroke="rgba(241,244,238,0.07)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {band ? (
            <rect
              x={0}
              y={yOf(band[1])}
              width={W}
              height={Math.max(1, yOf(band[0]) - yOf(band[1]))}
              fill="#3fe08c"
              opacity={0.07}
            />
          ) : null}

          {paths.map((s) => (
            <g key={s.key}>
              <path
                d={`${s.d} L${W},${H} L0,${H} Z`}
                fill={`url(#grad-${id}-${s.key})`}
                stroke="none"
                opacity={0.7}
              />
              <path
                d={s.d}
                fill="none"
                stroke={s.accent}
                strokeWidth={1.6}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>

        {hover != null ? (
          <>
            <div
              className="pointer-events-none absolute top-0 h-full w-px bg-bone/25"
              style={{ left: `${(hover / Math.max(1, points.length - 1)) * 100}%` }}
              aria-hidden
            />
            {series.map((s) => (
              <span
                key={s.key}
                className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-void"
                style={{
                  left: `${(hover / Math.max(1, points.length - 1)) * 100}%`,
                  top: `${((points[hover][s.key] - yMin) / span) * 100}%`,
                  background: s.accent,
                }}
                aria-hidden
              />
            ))}
          </>
        ) : null}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-0.5">
          <span className="label">y {round(yMax, 1)}</span>
          <span className="label opacity-60">y {round(yMin, 1)}</span>
        </div>
      </div>

      <div className="mt-2 flex justify-between">
        <span className="label">{points[0]?.label}</span>
        <span className="label">{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/** Water-usage bars — HTML for crisp type and easy hit targets. */
export function BarChart({
  data,
  accent = "#3fe08c",
  unit = "L",
  className,
  height = 132,
}: {
  data: { label: string; litres: number }[];
  accent?: string;
  unit?: string;
  className?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.litres), 0.1);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-end gap-[3px]" style={{ height }} onMouseLeave={() => setHover(null)}>
        {data.map((d, i) => (
          <button
            key={d.label}
            type="button"
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            className="group relative flex h-full flex-1 cursor-pointer items-end"
            aria-label={`${d.label}:00 — ${d.litres} litres`}
          >
            <span
              className="w-full rounded-sm transition-[height,background] duration-500"
              style={{
                height: `${(d.litres / max) * 100}%`,
                background: hover === i ? accent : `${accent}66`,
                boxShadow: hover === i ? `0 0 14px ${accent}55` : "none",
              }}
            />
          </button>
        ))}
      </div>

      <div className="mt-2 flex justify-between">
        <span className="label">00:00</span>
        <span className="label">{hover != null ? `${String(hover).padStart(2, "0")}:00 · ${data[hover].litres}${unit}` : "12:00"}</span>
        <span className="label">23:00</span>
      </div>
    </div>
  );
}
