"use client";

import { Droplets, Gauge, Leaf, Recycle, ShieldCheck, Waves } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Panel } from "@/components/ui/Panel";
import { PlantGlyph } from "@/components/visual/PlantGlyph";
import { SITE } from "@/lib/content/site";
import { plantById } from "@/lib/content/plants";

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Local first",
    body: "Every decision that touches water or light happens on the pod. The network is for reporting, not for permission — pull the router and the plants still get watered.",
  },
  {
    icon: Gauge,
    title: "Measured, not guessed",
    body: "Thresholds come from plant profiles calibrated against gravimetric soil samples, not from a datasheet. Sensors are re-checked after every action.",
  },
  {
    icon: Recycle,
    title: "Closed loop",
    body: "Sense, decide, act, verify, report. The verification step is what makes it a loop rather than a timer — a burst that does not move the moisture number gets logged as a fault.",
  },
];

const PROBLEM = [
  { icon: Droplets, stat: "40%", label: "of irrigation water is wasted by manual watering" },
  { icon: Waves, stat: "6 h", label: "is how long stress is invisible before damage shows" },
  { icon: Leaf, stat: "0", label: "feedback loops exist in a watering can" },
];

export function Manifesto() {
  const reference = plantById("tulsi");

  return (
    <Section id="manifesto">
      <SectionHeader
        index="01"
        eyebrow="manifesto"
        title={
          <>
            A garden that
            <br />
            <span className="serif lowercase text-chloro">keeps its own books.</span>
          </>
        }
        blurb={
          <>
            <p>
              {SITE.name} started as a frustration: a shelf of healthy-looking pots that quietly went wrong between
              waterings. Manual irrigation does not fail loudly — it fails in the gap between two visits.
            </p>
            <p className="mt-3">
              So the system was rebuilt around a single loop: measure the soil, decide locally, act, then verify that
              the action worked. Everything else on this page — the cloud, the dashboard, the model, the WhatsApp bot —
              exists to make that loop observable.
            </p>
          </>
        }
        aside={<span className="chip">est. {SITE.founded} · Delhi, India</span>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Panel label="problem statement" className="h-full">
            <ul className="divide-y divide-line">
              {PROBLEM.map((item) => (
                <li key={item.stat} className="flex items-center gap-5 py-5 first:pt-0 last:pb-0">
                  <item.icon size={18} className="shrink-0 text-chloro" aria-hidden />
                  <span className="num w-16 shrink-0 text-3xl text-bone">{item.stat}</span>
                  <span className="text-[14px] leading-snug text-sage">{item.label}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.08}>
          <Panel label="reference specimen" className="h-full">
            <div className="flex items-start gap-5">
              <PlantGlyph seed={reference.id} accent={reference.accent} size={92} veins={false} />
              <div>
                <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-bone">{reference.name}</h3>
                <p className="mt-1 font-mono text-[11px] italic text-sage">{reference.botanical}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-sage">{reference.note}</p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {[
                { k: "moisture band", v: `${reference.window[0]}–${reference.window[2]}%` },
                { k: "target", v: `${reference.window[1]}%` },
                { k: "burst length", v: `${reference.burstMs / 1000} s` },
                { k: "npk", v: reference.npk },
                { k: "temp range", v: `${reference.tempC[0]}–${reference.tempC[1]}°C` },
                { k: "photoperiod", v: `${reference.lightHours} h` },
              ].map((row) => (
                <div key={row.k} className="bg-void/85 px-3.5 py-3">
                  <dt className="label">{row.k}</dt>
                  <dd className="num mt-1 text-[15px] text-bone">{row.v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {PRINCIPLES.map((principle, index) => (
          <Reveal key={principle.title} delay={index * 0.08}>
            <Panel interactive className="h-full">
              <principle.icon size={18} className="text-chloro" aria-hidden />
              <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-[-0.02em] text-bone">
                {principle.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-sage">{principle.body}</p>
              <span className="mt-4 block font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                principle {String(index + 1).padStart(2, "0")}
              </span>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
