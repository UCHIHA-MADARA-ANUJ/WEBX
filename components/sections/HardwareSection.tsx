"use client";

import { useMemo, useState } from "react";
import { CircuitBoard, Search, Zap } from "lucide-react";
import { BOM, HARDWARE_QUICKSTATS, POWER_BUDGET } from "@/lib/content/hardware";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Segmented, Slider, Switch } from "@/components/ui/Controls";
import { PCBStack } from "@/components/visual/PCBStack";
import { inr, round } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "all" },
  { id: "compute", label: "compute" },
  { id: "sensing", label: "sensing" },
  { id: "actuation", label: "actuation" },
  { id: "power", label: "power" },
  { id: "comms", label: "comms" },
  { id: "mechanical", label: "mechanical" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

export function HardwareSection() {
  const [category, setCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>("mcu");

  const [enabled, setEnabled] = useState<Set<string>>(
    () => new Set(["logic", "radio", "sensors", "pump", "lights"]),
  );
  const [battery, setBattery] = useState(10000);
  const [tariff, setTariff] = useState(9);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOM.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchQuery = !q || `${item.name} ${item.part} ${item.role} ${item.iface}`.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [category, query]);

  const totalCost = items.reduce((sum, item) => sum + item.costInr * item.qty, 0);
  const totalParts = items.reduce((sum, item) => sum + item.qty, 0);

  const budget = useMemo(() => {
    const active = POWER_BUDGET.filter((item) => enabled.has(item.id));
    const mA = active.reduce((sum, item) => sum + item.currentMa * item.duty, 0);
    const watts = (mA / 1000) * 5;
    const dailyKwh = (watts * 24) / 1000;
    const runtime = mA > 0 ? battery / mA : 0;
    return {
      mA: round(mA, 1),
      watts: round(watts, 2),
      dailyKwh: round(dailyKwh, 3),
      dailyCost: round(dailyKwh * tariff, 2),
      runtime: round(runtime, 1),
      monthlyWater: round(dailyKwh * 30 * tariff, 0),
      active,
    };
  }, [battery, enabled, tariff]);

  const toggle = (id: string) => {
    setEnabled((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Section id="hardware">
      <SectionHeader
        index="04"
        eyebrow="hardware"
        title={
          <>
            Breadcrumbs to <span className="serif lowercase text-chloro">a real board.</span>
          </>
        }
        blurb={
          <>
            <p>
              The first prototype lived on jumper wires and reset itself every time the pump kicked in. The fix was a
              proper power tree: a buck front end, opto-isolated relay switching, and a ground pour that respects the
              inrush.
            </p>
            <p className="mt-3">
              The calculator below is live — switch subsystems on and off and watch the current, runtime and running cost
              move.
            </p>
          </>
        }
        aside={
          <>
            <Chip>19 line items</Chip>
            <Chip signal>{inr(BOM.reduce((s, i) => s + i.costInr * i.qty, 0))} build cost</Chip>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HARDWARE_QUICKSTATS.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.05}>
            <div className="panel flex items-baseline justify-between px-4 py-3.5">
              <div>
                <span className="label">{stat.label}</span>
                <p className="num mt-1 text-xl text-bone">{stat.value}</p>
              </div>
              <span className="label text-mute">{stat.sub}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* BOM */}
        <Reveal className="lg:col-span-7">
          <Panel
            label={`bill of materials · ${items.length} shown`}
            right={<span className="label">{inr(totalCost)} · {totalParts} parts</span>}
            className="h-full"
          >
            <div className="flex flex-col gap-3 pb-4">
              <label className="relative flex items-center gap-2">
                <Search size={13} className="absolute left-3 text-mute" aria-hidden />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search part, interface or role…"
                  className="field pl-9"
                  aria-label="Search bill of materials"
                />
              </label>
              <div className="hide-scrollbar overflow-x-auto">
                <Segmented
                  ariaLabel="Filter by category"
                  size="sm"
                  items={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
                  value={category}
                  onChange={setCategory}
                />
              </div>
            </div>

            <div className="divide-y divide-line border-t border-line">
              {items.map((item) => {
                const open = expanded === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : item.id)}
                      className="flex w-full items-center gap-3 py-3 text-left"
                      aria-expanded={open}
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: item.accent }} aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] text-bone">{item.name}</span>
                        <span className="block truncate font-mono text-[10.5px] text-mute">
                          {item.part} · {item.iface}
                        </span>
                      </span>
                      <span className="num shrink-0 text-right text-[12px] text-sage">
                        {item.qty}× {inr(item.costInr)}
                      </span>
                    </button>
                    {open ? (
                      <p className="pb-4 pl-[18px] pr-2 text-[12.5px] leading-relaxed text-sage">{item.role}</p>
                    ) : null}
                  </div>
                );
              })}
              {!items.length ? <p className="py-6 text-center text-sm text-mute">No parts match that filter.</p> : null}
            </div>
          </Panel>
        </Reveal>

        {/* power budget */}
        <Reveal className="lg:col-span-5" delay={0.08}>
          <Panel
            label="power budget calculator"
            right={<Zap size={12} className="text-amber" aria-hidden />}
            className="h-full"
          >
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
              <div className="bg-void/85 px-3.5 py-3">
                <span className="label">duty-averaged draw</span>
                <p className="num mt-1 text-xl text-chloro">{budget.mA} mA</p>
              </div>
              <div className="bg-void/85 px-3.5 py-3">
                <span className="label">average power</span>
                <p className="num mt-1 text-xl text-bone">{budget.watts} W</p>
              </div>
              <div className="bg-void/85 px-3.5 py-3">
                <span className="label">daily energy</span>
                <p className="num mt-1 text-xl text-bone">{budget.dailyKwh} kWh</p>
              </div>
              <div className="bg-void/85 px-3.5 py-3">
                <span className="label">daily cost · {inr(tariff, 0)}/kWh</span>
                <p className="num mt-1 text-xl text-amber">{inr(budget.dailyCost, 2)}</p>
              </div>
            </div>

            <ul className="mt-5 space-y-3">
              {POWER_BUDGET.map((item) => (
                <li key={item.id}>
                  <Switch
                    checked={enabled.has(item.id)}
                    onChange={() => toggle(item.id)}
                    label={item.label}
                    hint={`${item.currentMa} mA · ${Math.round(item.duty * 1000) / 10}% duty — ${item.note}`}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-4 border-t border-line pt-4">
              <Slider
                label="battery pack"
                min={2000}
                max={30000}
                step={500}
                value={battery}
                onChange={setBattery}
                display={`${battery} mAh`}
              />
              <Slider
                label="tariff"
                min={5}
                max={16}
                step={0.5}
                value={tariff}
                onChange={setTariff}
                display={`${inr(tariff, 1)}/kWh`}
                accent="#f0b45f"
              />
            </div>

            <div className="mt-4 rounded-lg border border-line bg-void/60 px-3.5 py-3">
              <p className="text-[12.5px] leading-relaxed text-sage">
                On a {battery.toLocaleString("en-IN")} mAh pack the active set would run{" "}
                <span className="num text-bone">{budget.runtime} h</span> unattended — about{" "}
                <span className="num text-bone">{round(budget.runtime / 24, 1)} days</span>.
              </p>
              <p className="mt-2 text-[11px] leading-snug text-mute">
                Pump and lighting dominate the budget. That is why the camera and the model are never active while the
                pump is running.
              </p>
            </div>
          </Panel>
        </Reveal>
      </div>

      <Reveal className="mt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h3 className="display text-[clamp(1.4rem,3vw,2.2rem)] text-bone">
            The <span className="serif lowercase text-chloro">carrier board</span>
          </h3>
          <span className="label flex items-center gap-2">
            <CircuitBoard size={12} className="text-chloro" aria-hidden />
            kicad v1 · two layer · hand assembled
          </span>
        </div>
        <PCBStack />
      </Reveal>
    </Section>
  );
}
