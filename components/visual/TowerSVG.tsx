import { cn } from "@/lib/utils";

const LEVELS = 7;

/**
 * The grow tower drawn as a specimen schematic. Doubles as the poster frame
 * behind the WebGL scene and as the whole visual on low-power devices.
 */
export function TowerSVG({ className, animated = true }: { className?: string; animated?: boolean }) {
  const cx = 220;
  const baseY = 494;
  const spacing = 57;
  const rings = Array.from({ length: LEVELS }, (_, i) => {
    const rx = 130 - i * 8.4;
    return { level: LEVELS - i, y: baseY - i * spacing, rx, ry: rx * 0.3 };
  });

  return (
    <svg viewBox="0 0 440 660" className={cn("h-full w-full", className)} aria-hidden="true" role="img">
      <defs>
        <linearGradient id="tower-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#3fe08c" stopOpacity="0.34" />
          <stop offset="60%" stopColor="#3fe08c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3fe08c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tower-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fe08c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3fe08c" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* light column */}
      <rect x={cx - 26} y={70} width={52} height={baseY - 70} fill="url(#tower-beam)" />

      {/* rings, tapered, with trays */}
      {rings.map((ring, index) => (
        <g key={ring.level} opacity={0.92}>
          <ellipse cx={cx} cy={ring.y} rx={ring.rx} ry={ring.ry} fill="none" stroke="#3fe08c" strokeOpacity={0.34} strokeWidth={1} />
          <ellipse
            cx={cx}
            cy={ring.y + 5}
            rx={ring.rx - 9}
            ry={ring.ry - 2.6}
            fill="none"
            stroke="#3fe08c"
            strokeOpacity={0.14}
            strokeWidth={1}
            strokeDasharray="3 5"
          />
          {Array.from({ length: 7 }, (_, tray) => {
            const angle = (tray / 7) * Math.PI * 2 + index * 0.42;
            const x = cx + Math.cos(angle) * (ring.rx - 12);
            const y = ring.y + Math.sin(angle) * (ring.ry - 3);
            return <circle key={tray} cx={x} cy={y} r={2.1} fill="#3fe08c" fillOpacity={0.72} />;
          })}
          <text x={cx - ring.rx - 16} y={ring.y + 3.5} className="fill-mute" style={{ fontSize: 9, letterSpacing: 1.6 }}>
            {`L${ring.level}`}
          </text>
          <line
            x1={cx - ring.rx - 12}
            x2={cx - ring.rx - 2}
            y1={ring.y}
            y2={ring.y}
            stroke="#3fe08c"
            strokeOpacity={0.26}
            strokeWidth={1}
          />
        </g>
      ))}

      {/* travelling scan ring */}
      {animated ? (
        <g className="ambient-only">
          <ellipse cx={cx} cy={140} rx={82} ry={25} fill="none" stroke="#5fe3d6" strokeOpacity={0.6} strokeWidth={1.2}>
            <animate
              attributeName="cy"
              values="140;494;140"
              dur="9s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
            />
            <animate attributeName="opacity" values="0;0.9;0" dur="9s" repeatCount="indefinite" />
          </ellipse>
        </g>
      ) : null}

      {/* base */}
      <ellipse cx={cx} cy={baseY + 30} rx={140} ry={34} fill="url(#tower-base)" />
      <ellipse cx={cx} cy={baseY + 30} rx={140} ry={34} fill="none" stroke="#3fe08c" strokeOpacity={0.32} strokeWidth={1} />
      <rect x={cx - 96} y={baseY + 30} width={192} height={26} rx={4} fill="#3fe08c" fillOpacity={0.05} stroke="#3fe08c" strokeOpacity={0.2} />
      <text x={cx} y={baseY + 47} textAnchor="middle" className="fill-sage" style={{ fontSize: 9, letterSpacing: 3 }}>
        RESERVOIR · 18 L
      </text>

      {/* mast */}
      <line x1={cx} y1={70} x2={cx} y2={34} stroke="#3fe08c" strokeOpacity={0.4} strokeWidth={1} />
      <circle cx={cx} cy={30} r={2.6} fill="#3fe08c">
        {animated ? (
          <animate attributeName="opacity" values="0.25;1;0.25" dur="2.6s" repeatCount="indefinite" />
        ) : null}
      </circle>

      {/* measure */}
      <g stroke="#a3b4a8" strokeOpacity={0.3} strokeWidth={1}>
        <line x1={392} y1={140} x2={392} y2={baseY + 30} strokeDasharray="4 5" />
        <line x1={386} y1={140} x2={398} y2={140} />
        <line x1={386} y1={baseY + 30} x2={398} y2={baseY + 30} />
      </g>
      <text x={384} y={320} className="fill-mute" transform="rotate(-90 384 320)" style={{ fontSize: 9, letterSpacing: 2.4 }}>
        1.82 M ACTIVE COLUMN
      </text>

      {/* footprint */}
      <line x1={40} y1={618} x2={400} y2={618} stroke="#a3b4a8" strokeOpacity={0.22} strokeDasharray="6 6" />
      <text x={40} y={638} className="fill-mute" style={{ fontSize: 9, letterSpacing: 2.2 }}>
        FOOTPRINT 0.42 m²
      </text>
      <text x={400} y={638} textAnchor="end" className="fill-mute" style={{ fontSize: 9, letterSpacing: 2.2 }}>
        7 LEVELS · 21 SITES
      </text>
    </svg>
  );
}
