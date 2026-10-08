"use client";

import { useState } from "react";
import { PCB_LAYERS } from "@/lib/content/hardware";
import { cn } from "@/lib/utils";

const SPACING = 46;

function LayerArt({ index }: { index: number }) {
  if (index === 0) {
    // component side
    return (
      <g>
        <rect x="70" y="30" width="104" height="66" rx="4" fill="rgba(63,224,140,0.14)" stroke="rgba(63,224,140,0.6)" />
        <text x="122" y="66" textAnchor="middle" fill="#3fe08c" style={{ fontSize: 9, letterSpacing: 1.4 }}>
          ESP32
        </text>
        <rect x="188" y="30" width="46" height="34" rx="3" fill="none" stroke="rgba(185,140,255,0.6)" />
        <text x="211" y="52" textAnchor="middle" fill="#b98cff" style={{ fontSize: 7, letterSpacing: 1 }}>
          RELAY
        </text>
        <rect x="26" y="26" width="34" height="46" rx="3" fill="none" stroke="rgba(240,180,95,0.6)" />
        <text x="43" y="52" textAnchor="middle" fill="#f0b45f" style={{ fontSize: 7, letterSpacing: 1 }}>
          BUCK
        </text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={40 + i * 62} y="112" width="48" height="16" rx="2" fill="none" stroke="rgba(241,244,238,0.35)" />
        ))}
        <text x="122" y="152" textAnchor="middle" fill="rgba(241,244,238,0.4)" style={{ fontSize: 8, letterSpacing: 1.6 }}>
          SENSOR HEADERS J1–J4
        </text>
      </g>
    );
  }
  if (index === 1) {
    // top copper
    const traces = [
      "M20,40 H120 V90 H220",
      "M20,70 H90 V130 H230",
      "M30,120 H80 V30 H200",
      "M60,150 H240 V110",
      "M120,20 V150 H250",
    ];
    return (
      <g>
        {traces.map((d) => (
          <path key={d} d={d} fill="none" stroke="#f0b45f" strokeOpacity={0.72} strokeWidth={1.4} />
        ))}
        {[
          [120, 90],
          [90, 130],
          [200, 30],
          [240, 110],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3.4} fill="#f0b45f" fillOpacity={0.8} />
        ))}
        <rect x="14" y="14" width="252" height="148" rx="6" fill="none" stroke="#f0b45f" strokeOpacity={0.28} strokeDasharray="4 4" />
      </g>
    );
  }
  if (index === 2) {
    // bottom copper — ground pour
    return (
      <g>
        <rect x="10" y="10" width="260" height="156" rx="8" fill="rgba(95,227,214,0.09)" stroke="rgba(95,227,214,0.45)" />
        <path
          d="M20,150 L20,30 L120,30 M40,150 V50 H160 M70,150 V70 H240 M100,150 V100 H260 M140,150 V120 H200"
          fill="none"
          stroke="rgba(95,227,214,0.5)"
          strokeWidth={1.1}
        />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={20 + i * 28} y1={154} x2={20 + i * 28} y2={166} stroke="rgba(95,227,214,0.35)" strokeWidth={1} />
        ))}
      </g>
    );
  }
  if (index === 3) {
    // silkscreen
    return (
      <g fill="rgba(241,244,238,0.62)" style={{ fontSize: 8, letterSpacing: 1.4 }}>
        <text x="18" y="24">VERDE v1.0 · rev A</text>
        <text x="18" y="176">61 × 84 mm · 2 LAYER</text>
        <rect x="68" y="28" width="108" height="70" rx="4" fill="none" stroke="rgba(241,244,238,0.5)" strokeDasharray="3 3" />
        <text x="122" y="110" textAnchor="middle">U1</text>
        <text x="211" y="24" textAnchor="middle">K1</text>
        <text x="43" y="88" textAnchor="middle">U2</text>
      </g>
    );
  }
  // substrate
  return (
    <g>
      <rect x="6" y="6" width="268" height="164" rx="8" fill="rgba(15,22,17,0.95)" stroke="rgba(241,244,238,0.12)" />
      {[
        [18, 18],
        [262, 18],
        [18, 158],
        [262, 158],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5} fill="none" stroke="rgba(241,244,238,0.28)" />
      ))}
    </g>
  );
}

export function PCBStack({ className }: { className?: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]", className)}>
      <div className="panel relative overflow-hidden">
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="label">stack-up · click a layer</span>
          <span className="label">exploded view</span>
        </header>

        <div
          className="relative flex items-center justify-center py-14"
          style={{ perspective: "1400px", minHeight: 340 }}
        >
          <div
            className="relative"
            style={{
              width: 260,
              height: 180,
              transformStyle: "preserve-3d",
              transform: "rotateX(58deg) rotateZ(-36deg)",
            }}
          >
            {PCB_LAYERS.map((layer, index) => {
              const isActive = active === index;
              const offset = (index - (PCB_LAYERS.length - 1) / 2) * SPACING;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={isActive}
                  className="absolute inset-0 cursor-pointer transition-all duration-500"
                  style={{
                    transform: `translateZ(${offset}px) scale(${isActive ? 1.035 : 1})`,
                    opacity: isActive ? 1 : 0.62,
                    filter: isActive ? "none" : "saturate(0.7)",
                  }}
                >
                  <svg viewBox="0 0 280 176" className="h-full w-full overflow-visible">
                    <LayerArt index={index} />
                    {isActive ? (
                      <rect
                        x="4"
                        y="4"
                        width="272"
                        height="168"
                        rx="9"
                        fill="none"
                        stroke={layer.accent}
                        strokeOpacity={0.75}
                        strokeWidth={1.4}
                      />
                    ) : null}
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
          <span className="label">1.6 mm FR-4 · 2 layer · 61 × 84 mm</span>
          <span className="label">hand assembled</span>
        </div>
      </div>

      <div className="panel h-fit p-4">
        <ul className="space-y-1.5">
          {PCB_LAYERS.map((layer, index) => {
            const isActive = active === index;
            return (
              <li key={layer.id}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-left transition-all duration-300",
                    isActive ? "border-chloro/40 bg-chloro/[0.07]" : "border-transparent hover:border-line hover:bg-bone/[0.02]",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: layer.accent }} aria-hidden />
                    <span className={cn("font-mono text-[11px] uppercase tracking-[0.14em]", isActive ? "text-bone" : "text-sage")}>
                      {layer.name}
                    </span>
                  </span>
                  {isActive ? <span className="mt-1.5 block text-[12px] leading-snug text-mute">{layer.note}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
