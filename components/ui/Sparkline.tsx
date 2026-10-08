import { useId } from "react";
import { cn } from "@/lib/utils";

function toPath(values: number[], width: number, height: number, min: number, max: number) {
  const span = max - min || 1;
  return values
    .map((value, i) => {
      const x = (i / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/** Compact trend line. `band` draws the acceptable operating window behind it. */
export function Sparkline({
  data,
  width = 240,
  height = 56,
  accent = "#3fe08c",
  band,
  min,
  max,
  area = true,
  strokeWidth = 1.5,
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  accent?: string;
  band?: [number, number];
  min?: number;
  max?: number;
  area?: boolean;
  strokeWidth?: number;
  className?: string;
}) {
  const id = useId().replace(/[:]/g, "");
  if (!data.length) return null;

  const lo = min ?? Math.min(...data);
  const hi = max ?? Math.max(...data);
  const span = hi - lo || 1;
  const path = toPath(data, width, height, lo, hi);
  const last = data[data.length - 1];
  const lastY = height - ((last - lo) / span) * height;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-14 w-full overflow-visible", className)}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {band ? (
        <rect
          x={0}
          y={height - ((band[1] - lo) / span) * height}
          width={width}
          height={Math.max(2, ((band[1] - band[0]) / span) * height)}
          fill={accent}
          opacity={0.08}
        />
      ) : null}

      {area ? <path d={`${path} L${width},${height} L0,${height} Z`} fill={`url(#fill-${id})`} /> : null}
      <path d={path} fill="none" stroke={accent} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={width} cy={lastY} r={2.4} fill={accent} />
    </svg>
  );
}

/** 270° instrument gauge — no path math, just dash offsets. */
export function Gauge({
  value,
  min = 0,
  max = 100,
  unit = "",
  label,
  accent = "#3fe08c",
  size = 116,
  band,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  label?: string;
  accent?: string;
  size?: number;
  band?: [number, number];
  className?: string;
}) {
  const frac = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
  const r = 42;
  const c = 2 * Math.PI * r;
  const arc = 0.75; // 270 degrees
  const bandStart = band ? Math.min(1, Math.max(0, (band[0] - min) / (max - min || 1))) : 0;
  const bandEnd = band ? Math.min(1, Math.max(0, (band[1] - min) / (max - min || 1))) : 0;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)} style={{ width: size }}>
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }} aria-hidden="true">
        <g transform="rotate(135 50 50)">
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(241,244,238,0.1)"
            strokeWidth="3"
            strokeDasharray={`${arc * c} ${c}`}
            strokeLinecap="round"
          />
          {band ? (
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={accent}
              strokeOpacity="0.22"
              strokeWidth="3"
              strokeDasharray={`${Math.max(0.002, bandEnd - bandStart) * c} ${c}`}
              strokeDashoffset={-bandStart * c}
            />
          ) : null}
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${frac * arc * c} ${c}`}
            style={{ transition: "stroke-dasharray 700ms cubic-bezier(.16,1,.3,1)" }}
          />
        </g>
        <text x="50" y="49" textAnchor="middle" className="fill-bone" style={{ fontSize: 20, fontWeight: 700 }}>
          {value.toFixed(value < 10 && !Number.isInteger(value) ? 2 : value % 1 === 0 ? 0 : 1)}
        </text>
        <text x="50" y="63" textAnchor="middle" className="fill-mute" style={{ fontSize: 8, letterSpacing: 1.5 }}>
          {unit.toUpperCase()}
        </text>
      </svg>
      {label ? <span className="label mt-2 text-center">{label}</span> : null}
    </div>
  );
}
