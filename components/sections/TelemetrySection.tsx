"use client";

import { useMemo, useState } from "react";
import { Activity, RefreshCw, Wifi } from "lucide-react";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Segmented } from "@/components/ui/Controls";
import { Sparkline } from "@/components/ui/Sparkline";
import { LineChart } from "@/components/ui/Charts";
import { Terminal } from "@/components/ui/Terminal";
import { usePods } from "@/components/providers/PodProvider";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useClock } from "@/hooks/useCountUp";
import { useMounted } from "@/hooks/useMounted";
import { buildHistory, RANGE_META, type Range, type Vital } from "@/lib/telemetry";
import { plantById } from "@/lib/content/plants";
import { cn, round } from "@/lib/utils";

const RANGES: { id: Range; label: string }[] = [
  { id: "1H", label: "1 h" },
  { id: "24H", label: "24 h" },
  { id: "7D", label: "7 d" },
];

const SERIES = [
  { key: "moisture" as const, label: "moisture", accent: "#3fe08c", unit: "%" },
  { key: "temp" as const, label: "air temp", accent: "#5fe3d6", unit: "°C" },
  { key: "tank" as const, label: "reservoir", accent: "#b98cff", unit: "%" },
];

function BandMeter({ vital }: { vital: Vital }) {
  const span = vital.max - vital.min || 1;
  const left = ((vital.band[0] - vital.min) / span) * 100;
  const right = ((vital.band[1] - vital.min) / span) * 100;
  const marker = ((vital.value - vital.min) / span) * 100;
  const out = vital.value < vital.band[0] || vital.value > vital.band[1];

  return (
    <span className="relative mt-3 block h-1 w-full rounded-full bg-bone/10">
      <span
        className="absolute inset-y-0 rounded-full bg-chloro/25"
        style={{ left: `${left}%`, width: `${Math.max(1, right - left)}%` }}
      />
      <span
        className={cn(
          "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-void transition-all duration-700",
          out ? "bg-amber" : "bg-chloro",
        )}
        style={{ left: `${Math.max(0, Math.min(100, marker))}%` }}
      />
    </span>
  );
}

export function TelemetrySection() {
  const { pods, focusedPod, setFocusedPod } = usePods();
  const snapshot = useTelemetry(pods, 20000);
  const clock = useClock(1000);
  const mounted = useMounted();
  const [range, setRange] = useState<Range>("24H");

  const pod = snapshot?.pods[Math.min(focusedPod, (snapshot?.pods.length ?? 1) - 1)];
  const plant = plantById(pod?.plantId ?? pods[0]);
  // History is clock-derived: render it only after mount so the prerendered
  // HTML and the hydrated tree agree.
  const history = useMemo(() => (mounted ? buildHistory(plant.id, range) : []), [mounted, plant.id, range]);

  return (
    <Section id="telemetry">
      <SectionHeader
        index="03"
        eyebrow="telemetry"
        title={
          <>
            The pod, <span className="serif lowercase text-chloro">on the record.</span>
          </>
        }
        blurb={
          <>
            <p>
              Every reading below is generated from the same schema the hardware writes to Firebase — band limits, units
              and update intervals included. Point it at real credentials and nothing above this line changes.
            </p>
            <p className="mt-3">
              Values evolve as you read, because the feed is regenerated on a rolling window rather than randomised per
              render.
            </p>
          </>
        }
        aside={
          <>
            <Chip live signal>
              simulated feed
            </Chip>
            <Chip>{RANGE_META[range].label}</Chip>
          </>
        }
      />

      {/* fleet strip */}
      <Reveal>
        <div className="panel grid grid-cols-2 gap-px overflow-hidden bg-line sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "fleet uptime", value: `${snapshot?.fleet.uptime ?? 99.9}%`, sub: "30 d window" },
            { label: "firmware", value: `${snapshot?.fleet.firmwareUptime ?? 99.97}%`, sub: "soak test" },
            { label: "water today", value: `${snapshot?.fleet.waterTodayL ?? 4.1} L`, sub: "metered" },
            { label: "current draw", value: `${snapshot?.fleet.currentMa ?? 280} mA`, sub: "duty averaged" },
            { label: "nodes", value: `${snapshot?.fleet.nodes ?? 8}`, sub: "on the bus" },
            { label: "link", value: `${snapshot?.fleet.rssi ?? -42} dBm`, sub: "2.4 GHz" },
          ].map((item) => (
            <div key={item.label} className="bg-panel px-4 py-3.5">
              <span className="label">{item.label}</span>
              <p className="num mt-1 text-lg text-bone">{item.value}</p>
              <span className="label mt-0.5 block text-[9px] text-mute">{item.sub}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* pod selector */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="label mr-1">pod focus</span>
        {(snapshot?.pods ?? []).map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFocusedPod(index)}
            aria-pressed={index === focusedPod}
            className={cn(
              "flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-300",
              index === focusedPod ? "border-chloro/45 bg-chloro/[0.07]" : "border-line hover:border-bone/25",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                item.status === "nominal" ? "bg-chloro" : item.status === "attention" ? "bg-amber" : "bg-rust",
              )}
              aria-hidden
            />
            <span className="text-left">
              <span className="block text-[12.5px] text-bone">{item.name}</span>
              <span className="label block text-[9px] text-mute">
                {item.code} · {item.health}% health
              </span>
            </span>
          </button>
        ))}
        <span className="ml-auto flex items-center gap-2">
          <RefreshCw size={12} className={cn("text-chloro", !snapshot && "animate-spin-slow")} aria-hidden />
          <span className="label">
            sync {clock ? clock.toLocaleTimeString("en-GB", { hour12: false }) : "--:--:--"} IST
          </span>
        </span>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-12">
        {/* vitals */}
        <Reveal className="lg:col-span-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(pod?.vitals ?? []).map((vital) => (
              <Panel key={vital.key} padded={false} className="p-4" ticks={false}>
                <div className="flex items-start justify-between gap-2">
                  <span className="label leading-tight">{vital.label}</span>
                  <span className="label text-[9px]" style={{ color: vital.accent }}>
                    {vital.bandLabel}
                  </span>
                </div>
                <p className="num mt-2 text-2xl text-bone">
                  {round(vital.value, vital.precision).toFixed(vital.precision)}
                  <span className="ml-1 text-[11px] text-sage">{vital.unit}</span>
                </p>
                <BandMeter vital={vital} />
                <Sparkline
                  data={vital.trend}
                  accent={vital.accent}
                  band={vital.band}
                  min={vital.min}
                  max={vital.max}
                  height={34}
                  className="mt-3 h-8"
                />
              </Panel>
            ))}
            {!pod ? (
              <div className="col-span-full grid h-40 place-items-center">
                <span className="label animate-pulse">opening channel…</span>
              </div>
            ) : null}
          </div>
        </Reveal>

        {/* history + events */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <Reveal delay={0.08}>
            <Panel
              label={`${plant.name} · history`}
              right={
                <Segmented ariaLabel="History range" size="sm" items={RANGES} value={range} onChange={setRange} />
              }
            >
              {history.length ? (
                <LineChart points={history} series={SERIES} band={[plant.window[0], plant.window[2]]} height={190} />
              ) : (
                <div className="inset-well grid h-[190px] place-items-center">
                  <span className="label animate-pulse">sampling {RANGE_META[range].label}…</span>
                </div>
              )}
              <p className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[11.5px] text-mute">
                <Activity size={11} className="text-chloro" aria-hidden />
                Shaded band is the calibrated moisture window for this specimen.
              </p>
            </Panel>
          </Reveal>

          <Reveal delay={0.14}>
            <Terminal
              lines={(snapshot?.events ?? []).map((event) => `${event.at}  ${event.text}`)}
              intervalMs={1400}
              height="13rem"
              title="firebase stream · /pods/*/events"
            />
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-panel/60 px-4 py-3">
          <p className="max-w-2xl text-[12.5px] leading-relaxed text-mute">
            <span className="label mr-2 text-sage">honesty note</span>
            This dashboard is a simulation — plausible, deterministic and shaped exactly like the live payload, but not
            your hardware. The real pods stream to Firebase Realtime Database under
            <span className="font-mono text-sage"> /pods/&#123;id&#125;/telemetry</span>.
          </p>
          <span className="flex items-center gap-2">
            <Wifi size={12} className="text-chloro" aria-hidden />
            <span className="label">schema v4 · 25 ms target rtt</span>
          </span>
        </div>
      </Reveal>
    </Section>
  );
}
