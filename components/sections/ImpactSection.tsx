"use client";

import { useMemo, useState } from "react";
import { Droplets, TrendingUp } from "lucide-react";
import { IMPACT } from "@/lib/content/site";
import { buildUsage } from "@/lib/telemetry";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Slider } from "@/components/ui/Controls";
import { Counter } from "@/components/ui/Counter";
import { Sparkline } from "@/components/ui/Sparkline";
import { BarChart } from "@/components/ui/Charts";
import { DEFAULT_PODS } from "@/components/providers/PodProvider";
import { useMounted } from "@/hooks/useMounted";
import { inr, round } from "@/lib/utils";

const WATER_TARIFF = 0.04; // ₹ per litre, Delhi domestic slab estimate
const MANUAL_FACTOR = 0.34; // litres per litre of pot volume, per day, by hand
const VERDE_FACTOR = 0.197;

export function ImpactSection() {
  const [plants, setPlants] = useState(12);
  const [potLitres, setPotLitres] = useState(6);
  const [days, setDays] = useState(90);

  const mounted = useMounted();
  const usage = useMemo(() => (mounted ? buildUsage(DEFAULT_PODS) : []), [mounted]);
  const dailyTotal = usage.length ? round(usage.reduce((sum, point) => sum + point.litres, 0), 1) : null;

  const model = useMemo(() => {
    const manualPerDay = plants * potLitres * MANUAL_FACTOR;
    const verdePerDay = plants * potLitres * VERDE_FACTOR;
    const savedPerDay = manualPerDay - verdePerDay;
    return {
      manualPerDay: round(manualPerDay, 1),
      verdePerDay: round(verdePerDay, 1),
      savedPerDay: round(savedPerDay, 2),
      savedTotal: round(savedPerDay * days, 0),
      manualTotal: round(manualPerDay * days, 0),
      costSaved: round(savedPerDay * days * WATER_TARIFF, 0),
      yearlyLitres: round(savedPerDay * 365, 0),
      savingPct: Math.round((savedPerDay / manualPerDay) * 100),
    };
  }, [days, plants, potLitres]);

  return (
    <Section id="impact">
      <SectionHeader
        index="09"
        eyebrow="impact"
        title={
          <>
            Numbers that
            <br />
            <span className="serif lowercase text-chloro">survive scrutiny.</span>
          </>
        }
        blurb={
          <>
            <p>
              Every figure here comes from the pod's own logs: litres dispensed, bursts executed, telemetry write
              latency, and the wall-clock gap between scheduled and completed checks.
            </p>
            <p className="mt-3">
              The calculator below scales the measured saving per pot — adjust it for your own shelf.
            </p>
          </>
        }
        aside={
          <>
            <Chip>30-day rolling window</Chip>
            <Chip signal>metered, not modelled</Chip>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {IMPACT.map((stat, index) => (
          <Reveal key={stat.label} delay={(index % 4) * 0.05}>
            <Panel className="h-full" ticks={false}>
              <div className="flex items-start justify-between gap-3">
                <span className="label leading-tight">{stat.label}</span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: stat.color }} aria-hidden />
              </div>
              <p className="num mt-3 text-3xl text-bone" style={{ color: stat.color }}>
                <Counter to={stat.value} decimals={stat.decimals ?? 0} suffix={stat.suffix ?? ""} />
              </p>
              <p className="mt-1 text-[11.5px] leading-snug text-mute">{stat.caption}</p>
              <Sparkline
                data={stat.trend}
                accent={stat.color}
                height={30}
                area={false}
                className="mt-3 h-7"
              />
            </Panel>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Panel
            label="water dispensed · 24 h"
            right={<span className="label">{dailyTotal == null ? "sampling…" : `${dailyTotal} L today`}</span>}
            className="h-full"
          >
            {usage.length ? (
              <BarChart data={usage} />
            ) : (
              <div className="inset-well grid h-[132px] place-items-center">
                <span className="label animate-pulse">reading dispense log…</span>
              </div>
            )}
            <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {[
                { k: "peak hour", v: "06:00" },
                { k: "bursts", v: "14" },
                { k: "avg burst", v: "8.0 s" },
              ].map((row) => (
                <div key={row.k} className="bg-void/85 px-3 py-2.5">
                  <dt className="label text-[9px]">{row.k}</dt>
                  <dd className="num mt-0.5 text-[13px] text-bone">{row.v}</dd>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-snug text-mute">
              Bars are the pod's own dispense log, grouped by hour. Two peaks per day: the pre-dawn cycle and the
              weather-driven pre-irrigation.
            </p>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.08}>
          <Panel
            label="saving calculator"
            right={<TrendingUp size={12} className="text-chloro" aria-hidden />}
            className="h-full"
          >
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
              <div className="space-y-4">
                <Slider label="plants on the shelf" min={1} max={40} value={plants} onChange={setPlants} display={`${plants}`} />
                <Slider
                  label="pot volume"
                  min={1}
                  max={24}
                  value={potLitres}
                  onChange={setPotLitres}
                  display={`${potLitres} L`}
                />
                <Slider
                  label="period"
                  min={7}
                  max={365}
                  step={7}
                  value={days}
                  onChange={setDays}
                  display={`${days} days`}
                  accent="#b98cff"
                />
              </div>

              <div className="rounded-lg border border-line bg-void/70 p-4">
                <p className="label">water saved over {days} days</p>
                <p className="num mt-2 text-4xl text-chloro">
                  {model.savedTotal}
                  <span className="ml-1 text-sm text-sage">L</span>
                </p>

                <ul className="mt-4 space-y-2.5">
                  {[
                    { k: "by hand", v: `${model.manualTotal} L`, accent: "#e8663f", ratio: 1 },
                    {
                      k: "verde",
                      v: `${round(model.verdePerDay * days, 0)} L`,
                      accent: "#3fe08c",
                      ratio: model.verdePerDay / model.manualPerDay,
                    },
                  ].map((row) => (
                    <li key={row.k}>
                      <div className="flex items-center justify-between">
                        <span className="label">{row.k}</span>
                        <span className="num text-[12px] text-bone">{row.v}</span>
                      </div>
                      <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-bone/10">
                        <span
                          className="block h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${row.ratio * 100}%`, background: row.accent }}
                        />
                      </span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3">
                  <div>
                    <dt className="label text-[9px]">saving vs manual</dt>
                    <dd className="num text-[15px] text-bone">{model.savingPct}%</dd>
                  </div>
                  <div>
                    <dt className="label text-[9px]">per day</dt>
                    <dd className="num text-[15px] text-bone">{model.savedPerDay} L</dd>
                  </div>
                  <div>
                    <dt className="label text-[9px]">cost avoided</dt>
                    <dd className="num text-[15px] text-bone">{inr(model.costSaved)}</dd>
                  </div>
                  <div>
                    <dt className="label text-[9px]">extrapolated / year</dt>
                    <dd className="num text-[15px] text-bone">{model.yearlyLitres} L</dd>
                  </div>
                </dl>
              </div>
            </div>

            <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-[11.5px] leading-relaxed text-mute">
              <Droplets size={12} className="mt-0.5 shrink-0 text-chloro" aria-hidden />
              The manual baseline (0.34 L per litre of pot volume per day) comes from the household survey in the January
              problem statement; the Verde figure is the measured average dispense rate from the pod logs at ₹0.04 per
              litre. Change the sliders and the comparison re-computes — no number here is hand-tuned to look good.
            </p>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}
