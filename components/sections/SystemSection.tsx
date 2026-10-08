"use client";

import { useState } from "react";
import {
  ArrowRight,
  Brain,
  ChartLine,
  CloudRain,
  Droplet,
  Eye,
  FlaskConical,
  Hand,
  MessageSquare,
  Sprout,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { ARCH_EDGES, ARCH_NODES, CAPABILITIES, MODES } from "@/lib/content/system";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Panel, Chip } from "@/components/ui/Panel";
import { Segmented } from "@/components/ui/Controls";
import { SystemMap } from "@/components/visual/SystemMap";
import { Sparkline } from "@/components/ui/Sparkline";
import { cn } from "@/lib/utils";

const ICONS = {
  eye: Eye,
  "cloud-sun": Sun,
  message: MessageSquare,
  flask: FlaskConical,
  droplet: Droplet,
  "cloud-rain": CloudRain,
  sprout: Sprout,
  sun: Sun,
  chart: ChartLine,
  brain: Brain,
  hand: Hand,
} as const;

export function SystemSection() {
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const active = MODES.find((m) => m.id === mode) ?? MODES[0];
  const ICONS_LOOKUP = ICONS as Record<string, LucideIcon>;
  const ModeIcon = ICONS_LOOKUP[active.icon] ?? Brain;

  return (
    <Section id="system">
      <SectionHeader
        index="02"
        eyebrow="architecture"
        title={
          <>
            Sense. Decide.
            <br />
            <span className="serif lowercase text-chloro">water, then prove it.</span>
          </>
        }
        blurb={
          <>
            <p>
              Sixteen blocks, seventeen links. Sensors enter on the left, the edge controller decides in the middle,
              and the cloud sits on the right as an observer — never in the path of a watering decision.
            </p>
            <p className="mt-3">
              Toggle the legend to trace a single signal class, or click any block for its specification.
            </p>
          </>
        }
        aside={
          <>
            <Chip>{ARCH_NODES.length} blocks</Chip>
            <Chip signal>local control</Chip>
          </>
        }
      />

      <Reveal>
        <SystemMap />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <Reveal>
          <Panel
            label="control philosophy"
            right={<span className="label">the claim this design rests on</span>}
            className="h-full"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <span className="chip-signal chip">inside the loop</span>
                <ul className="mt-4 space-y-3">
                  {[
                    "Soil threshold check and fuzzy deficit decision",
                    "Relay control, burst timing and cooldown enforcement",
                    "Photoperiod switching from the light sensor",
                    "Tank floor and rain interlocks",
                    "Watchdog, fault latching and local annunciation",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-sage">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chloro" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="chip">outside the loop</span>
                <ul className="mt-4 space-y-3">
                  {[
                    "Telemetry history and charting",
                    "Forecast lookups and schedule planning",
                    "WhatsApp commands and status reports",
                    "Model updates and profile edits",
                    "This dashboard, entirely",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-mute">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-plasma/70" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-sage">
              Consequence: a dropped Wi-Fi link degrades reporting, not watering. The pod keeps its own books and
              reconciles with the cloud when the socket returns.
            </p>
          </Panel>
        </Reveal>

        <Reveal delay={0.08}>
          <Panel
            label="operating mode"
            right={
              <Segmented
                ariaLabel="Operating mode"
                size="sm"
                items={MODES.map((m) => ({ id: m.id, label: m.label }))}
                value={mode}
                onChange={setMode}
              />
            }
            className="h-full"
          >
            <div className="flex items-center gap-3">
              <ModeIcon size={18} className="text-chloro" aria-hidden />
              <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-bone">{active.headline}</h3>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-sage">{active.body}</p>

            <ul className="mt-4 space-y-2">
              {active.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[12.5px] text-sage">
                  <ArrowRight size={11} className="shrink-0 text-chloro/60" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>

            <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {active.metrics.map((metric) => (
                <div key={metric.label} className="bg-void/85 px-3 py-3">
                  <dt className="label text-[9px] leading-tight">{metric.label}</dt>
                  <dd className="num mt-1 text-[13px] text-bone">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </Reveal>
      </div>

      {/* capabilities */}
      <div className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-3 pb-4">
          <h3 className="display text-[clamp(1.5rem,3.4vw,2.4rem)] text-bone">
            Nine behaviours, <span className="serif lowercase text-chloro">one brain</span>
          </h3>
          <span className="label">04 // intelligence layer · measured on the bench</span>
        </div>
        <div className="rule" aria-hidden />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability, index) => {
            const Icon = ICONS_LOOKUP[capability.icon] ?? Eye;
            return (
              <Reveal key={capability.id} delay={(index % 3) * 0.06}>
                <Panel interactive className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <Icon size={18} style={{ color: capability.accent }} aria-hidden />
                    <span className="num text-right text-2xl leading-none text-bone" style={{ color: capability.accent }}>
                      {capability.metric}
                      <span className="ml-1 block text-[9.5px] font-normal tracking-[0.14em] text-mute">
                        {capability.unit}
                      </span>
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-[17px] font-bold uppercase tracking-[-0.02em] text-bone">
                    {capability.title}
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-sage">{capability.body}</p>
                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-3">
                    <span className="font-mono text-[10px] leading-snug text-mute">{capability.detail}</span>
                    <Sparkline
                      data={capability.trend}
                      accent={capability.accent}
                      width={84}
                      height={26}
                      area={false}
                      className={cn("h-6 w-20 shrink-0")}
                    />
                  </div>
                </Panel>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
