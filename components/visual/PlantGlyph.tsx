import { hashString, mulberry32 } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Deterministic botanical specimen mark — the same plant always draws the
 * same leaf. Lobes, width and vein count all come from the name hash.
 */
export function PlantGlyph({
  seed,
  accent = "#3fe08c",
  className,
  size = 64,
  strokeWidth = 1,
  veins = true,
}: {
  seed: string;
  accent?: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
  veins?: boolean;
}) {
  const rand = mulberry32(hashString(seed));
  const steps = 26;
  const lobes = 3 + Math.floor(rand() * 3);
  const fatness = 0.42 + rand() * 0.22;
  const tipLength = 0.82 + rand() * 0.16;
  const veinCount = 4 + Math.floor(rand() * 4);

  const right: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const y = -tipLength + 2 * tipLength * t;
    const envelope = Math.pow(Math.sin(Math.PI * t), 0.72);
    const ripple = 1 + 0.11 * Math.sin(t * Math.PI * lobes + rand() * 0.4);
    const width = envelope * ripple * fatness;
    right.push([width, y]);
  }

  const path = [
    `M0,${-tipLength}`,
    ...right.map(([x, y]) => `L${x.toFixed(3)},${y.toFixed(3)}`),
    ...[...right].reverse().map(([x, y]) => `L${(-x).toFixed(3)},${y.toFixed(3)}`),
    "Z",
  ].join(" ");

  const veinPaths = Array.from({ length: veinCount }, (_, i) => {
    const t = 0.16 + (i / veinCount) * 0.76;
    const y = -tipLength + 2 * tipLength * t;
    const width = Math.pow(Math.sin(Math.PI * t), 0.72) * fatness * 0.86;
    return `M0,${y.toFixed(3)} Q${(width * 0.55).toFixed(3)},${(y - 0.06).toFixed(3)} ${width.toFixed(3)},${(y + 0.05).toFixed(3)}`;
  });

  return (
    <svg
      viewBox="-1.2 -1.2 2.4 2.5"
      width={size}
      height={size}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
      fill="none"
      stroke={accent}
      strokeWidth={strokeWidth * 0.014}
      strokeLinecap="round"
    >
      <path d={path} fill={`${accent}14`} stroke={accent} strokeOpacity={0.85} />
      <path d={`M0,${-tipLength} L0,${tipLength}`} stroke={accent} strokeOpacity={0.7} />
      {veins
        ? veinPaths.map((d, i) => (
            <g key={i}>
              <path d={d} stroke={accent} strokeOpacity={0.45} />
              <path d={d} stroke={accent} strokeOpacity={0.45} transform="scale(-1,1)" />
            </g>
          ))
        : null}
      <circle cx={0} cy={tipLength} r={0.045} fill={accent} stroke="none" />
    </svg>
  );
}
