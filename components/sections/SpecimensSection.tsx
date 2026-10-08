"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { CATEGORY_META, PLANTS, type PlantCategory } from "@/lib/content/plants";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Segmented } from "@/components/ui/Controls";
import { PlantGlyph } from "@/components/visual/PlantGlyph";
import { MAX_PODS, usePods } from "@/components/providers/PodProvider";
import { cn } from "@/lib/utils";

const FILTERS: { id: PlantCategory | "all"; label: string }[] = [
  { id: "all", label: "all" },
  { id: "herb", label: "herb" },
  { id: "vegetable", label: "vegetable" },
  { id: "flower", label: "flower" },
  { id: "succulent", label: "succulent" },
];

function Difficulty({ level, accent }: { level: number; accent: string }) {
  return (
    <span className="flex items-center gap-1" title={`Difficulty ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          className="h-1 w-2.5 rounded-full"
          style={{ background: step <= level ? accent : "rgba(241,244,238,0.14)" }}
          aria-hidden
        />
      ))}
      <span className="label ml-1 text-[9px]">d{level}</span>
    </span>
  );
}

export function SpecimensSection() {
  const { pods, togglePod, isActive, full } = usePods();
  const [category, setCategory] = useState<PlantCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>("tulsi");

  const plants = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLANTS.filter((plant) => {
      const matchCategory = category === "all" || plant.category === category;
      const matchQuery = !q || `${plant.name} ${plant.botanical} ${plant.note}`.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [category, query]);

  const detail = PLANTS.find((plant) => plant.id === selected) ?? null;

  return (
    <Section id="specimens">
      <SectionHeader
        index="07"
        eyebrow="specimen database"
        title={
          <>
            Twelve profiles,
            <br />
            <span className="serif lowercase text-chloro">every threshold earned.</span>
          </>
        }
        blurb={
          <>
            <p>
              Each specimen carries its own moisture band, burst length, temperature range, photoperiod and NPK ratio.
              The firmware ships more than twenty; these are the ones with real bench time behind them.
            </p>
            <p className="mt-3">
              Assign a specimen to a pod and it appears immediately in the telemetry console above — up to {MAX_PODS} at
              a time.
            </p>
          </>
        }
        aside={
          <>
            <Chip>{pods.length}/{MAX_PODS} pods assigned</Chip>
            <Chip signal>C++ profiles</Chip>
          </>
        }
      />

      <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <Segmented
          ariaLabel="Filter specimens by category"
          size="sm"
          items={FILTERS}
          value={category}
          onChange={setCategory}
        />
        <label className="relative flex max-w-xs items-center gap-2">
          <Search size={13} className="absolute left-3 text-mute" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search specimens…"
            className="field pl-9"
            aria-label="Search specimens"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
          {plants.map((plant, index) => {
            const assigned = isActive(plant.id);
            return (
              <Reveal key={plant.id} delay={(index % 3) * 0.05}>
                <Panel
                  interactive
                  className={cn("h-full", selected === plant.id && "border-chloro/40")}
                  ticks={false}
                >
                  <button type="button" className="w-full text-left" onClick={() => setSelected(plant.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <PlantGlyph seed={plant.id} accent={plant.accent} size={62} />
                      <span className="chip">{CATEGORY_META[plant.category].label}</span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-[-0.02em] text-bone">
                      {plant.name}
                    </h3>
                    <p className="font-mono text-[10.5px] italic text-mute">{plant.botanical}</p>
                  </button>

                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-3">
                    <div>
                      <dt className="label text-[9px]">moisture</dt>
                      <dd className="num text-[12.5px] text-bone">
                        {plant.window[0]}–{plant.window[2]}%
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-[9px]">burst</dt>
                      <dd className="num text-[12.5px] text-bone">{plant.burstMs / 1000}s</dd>
                    </div>
                    <div>
                      <dt className="label text-[9px]">temp</dt>
                      <dd className="num text-[12.5px] text-bone">
                        {plant.tempC[0]}–{plant.tempC[1]}°C
                      </dd>
                    </div>
                    <div>
                      <dt className="label text-[9px]">cycle</dt>
                      <dd className="num text-[12.5px] text-bone">{plant.cycleWeeks} w</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                    <Difficulty level={plant.difficulty} accent={plant.accent} />
                    <button
                      type="button"
                      onClick={() => togglePod(plant.id)}
                      disabled={!assigned && full}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] transition-colors",
                        assigned
                          ? "border-chloro/45 bg-chloro/[0.08] text-chloro"
                          : full
                            ? "border-line text-mute"
                            : "border-line text-sage hover:border-chloro/40 hover:text-bone",
                      )}
                    >
                      {assigned ? <Check size={11} aria-hidden /> : <Plus size={11} aria-hidden />}
                      {assigned ? "in pod" : full ? "pods full" : "assign"}
                    </button>
                  </div>
                </Panel>
              </Reveal>
            );
          })}
          {!plants.length ? (
            <p className="col-span-full py-10 text-center text-sm text-mute">No specimen matches that search.</p>
          ) : null}
        </div>

        {/* detail drawer */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            {detail ? (
              <Panel
                label="specimen dossier"
                right={
                  <button type="button" onClick={() => setSelected(null)} className="text-mute hover:text-bone" aria-label="Close dossier">
                    <X size={13} />
                  </button>
                }
              >
                <div className="flex items-center gap-4">
                  <PlantGlyph seed={detail.id} accent={detail.accent} size={80} />
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-bone">{detail.name}</h3>
                    <p className="font-mono text-[11px] italic text-sage">{detail.botanical}</p>
                    <p className="label mt-1.5">{CATEGORY_META[detail.category].label} · difficulty {detail.difficulty}/5</p>
                  </div>
                </div>

                <p className="mt-4 text-[13.5px] leading-relaxed text-sage">{detail.note}</p>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="label">moisture window</span>
                      <span className="num text-[11px] text-bone">
                        floor {detail.window[0]} · target {detail.window[1]} · ceiling {detail.window[2]}
                      </span>
                    </div>
                    <span className="relative mt-2 block h-1.5 w-full rounded-full bg-bone/10">
                      <span
                        className="absolute inset-y-0 rounded-full"
                        style={{
                          left: `${detail.window[0]}%`,
                          width: `${detail.window[2] - detail.window[0]}%`,
                          background: `${detail.accent}55`,
                        }}
                      />
                      <span
                        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-void"
                        style={{ left: `${detail.window[1]}%`, background: detail.accent }}
                      />
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
                    {[
                      { k: "npk ratio", v: detail.npk },
                      { k: "photoperiod", v: `${detail.lightHours} h/day` },
                      { k: "burst length", v: `${detail.burstMs / 1000} s` },
                      { k: "cycle", v: `${detail.cycleWeeks} weeks` },
                      { k: "air temp", v: `${detail.tempC[0]}–${detail.tempC[1]}°C` },
                      { k: "cooldown", v: "4 h minimum" },
                    ].map((row) => (
                      <div key={row.k} className="bg-void/85 px-3 py-2.5">
                        <dt className="label text-[9px]">{row.k}</dt>
                        <dd className="num mt-0.5 text-[13px] text-bone">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => togglePod(detail.id)}
                  disabled={!isActive(detail.id) && full}
                  className={cn("btn mt-5 w-full", isActive(detail.id) ? "btn-ghost" : "btn-primary")}
                >
                  {isActive(detail.id) ? "remove from pod" : full ? "pods full — remove one first" : "assign to a pod"}
                </button>
              </Panel>
            ) : (
              <Panel label="specimen dossier">
                <p className="text-sm text-sage">Select a specimen card to open its dossier.</p>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
