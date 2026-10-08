"use client";

import Image from "next/image";
import { useState } from "react";
import { Compass, ImageIcon } from "lucide-react";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

type Plate = {
  id: string;
  src?: string;
  alt?: string;
  meta: string;
  caption: string;
  detail: string;
  span?: string;
};

const PLATES: Plate[] = [
  {
    id: "terrace",
    src: "/images/terrace-deployment.png",
    alt: "Concept visualisation of the grow tower on a Delhi terrace at dusk",
    meta: "concept render · 01",
    caption: "Terrace deployment",
    detail:
      "Two towers, one reservoir, a single 12 V feed. The enclosure is IP54 because the build lives outdoors through a Delhi monsoon — the blue-hour skyline behind it is the actual viewing condition.",
    span: "lg:col-span-7",
  },
  {
    id: "board",
    src: "/images/carrier-board.png",
    alt: "Concept visualisation of the custom carrier board with sensor harnesses",
    meta: "concept render · 02",
    caption: "Carrier board, v1",
    detail:
      "61 × 84 mm, two layers, hand-soldered. ESP32 in the middle, buck converter and relay at the edges, screw terminals along the bottom so a probe can be swapped without a soldering iron.",
    span: "lg:col-span-5",
  },
  {
    id: "control",
    src: "/images/field-control.png",
    alt: "Concept visualisation of a phone showing the pod status over WhatsApp",
    meta: "concept render · 03",
    caption: "Remote control in practice",
    detail:
      "Chat on the left, live gauges on the right. This is the channel that got used most during the exhibition — usually to answer “is it still alive?” from across the room.",
    span: "lg:col-span-5",
  },
  {
    id: "plan",
    meta: "measured drawing · 04",
    caption: "Sensor placement plan",
    detail:
      "Probe depth 90 mm, camera fixed at canopy height, ultrasonic sensor mounted clear of the pump's spray cone.",
    span: "lg:col-span-7",
  },
];

function PosterPlate({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="mask-radial absolute inset-0 grid-lines opacity-60" aria-hidden />
      <div className="relative text-center">
        <ImageIcon size={22} className="mx-auto text-mute" aria-hidden />
        <p className="label mt-3">{label} · image not shipped</p>
      </div>
    </div>
  );
}

function SensorPlan() {
  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" role="img" aria-label="Sensor placement plan">
      <rect x="0" y="0" width="640" height="420" fill="#070c09" />
      {Array.from({ length: 17 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="420" stroke="rgba(241,244,238,0.045)" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2="640" y2={i * 40} stroke="rgba(241,244,238,0.045)" />
      ))}

      {/* bed outline */}
      <rect x="120" y="96" width="400" height="240" rx="6" fill="rgba(63,224,140,0.05)" stroke="rgba(63,224,140,0.45)" />
      <text x="120" y="88" fill="#a3b4a8" style={{ fontSize: 10, letterSpacing: 2 }}>
        GROW BED 60 × 40 CM
      </text>

      {/* probes */}
      {[
        { x: 190, y: 160, label: "SOIL A", note: "90 mm depth", color: "#3fe08c" },
        { x: 300, y: 150, label: "SOIL B", note: "90 mm depth", color: "#3fe08c" },
        { x: 420, y: 168, label: "NPK", note: "20 cm insertion", color: "#f0b45f" },
        { x: 300, y: 268, label: "DHT22", note: "canopy height", color: "#5fe3d6" },
        { x: 470, y: 268, label: "CAM", note: "leaf frame", color: "#e8663f" },
        { x: 160, y: 268, label: "LDR", note: "clear of shading", color: "#f0b45f" },
      ].map((probe) => (
        <g key={probe.label}>
          <circle cx={probe.x} cy={probe.y} r="7" fill="none" stroke={probe.color} strokeOpacity="0.8" />
          <circle cx={probe.x} cy={probe.y} r="2.6" fill={probe.color} />
          <line x1={probe.x} y1={probe.y} x2={probe.x} y2={probe.y - 26} stroke={probe.color} strokeOpacity="0.4" strokeDasharray="3 3" />
          <text x={probe.x} y={probe.y - 32} textAnchor="middle" fill={probe.color} style={{ fontSize: 9, letterSpacing: 1.2 }}>
            {probe.label}
          </text>
          <text x={probe.x} y={probe.y + 20} textAnchor="middle" fill="rgba(163,180,168,0.75)" style={{ fontSize: 7.5 }}>
            {probe.note}
          </text>
        </g>
      ))}

      {/* reservoir + controller */}
      <rect x="34" y="150" width="66" height="130" rx="5" fill="rgba(95,227,214,0.07)" stroke="rgba(95,227,214,0.45)" />
      <text x="67" y="218" textAnchor="middle" fill="#5fe3d6" style={{ fontSize: 9, letterSpacing: 1 }}>
        TANK
      </text>
      <text x="67" y="232" textAnchor="middle" fill="rgba(163,180,168,0.7)" style={{ fontSize: 7 }}>
        HC-SR04
      </text>

      <rect x="540" y="150" width="76" height="130" rx="5" fill="rgba(63,224,140,0.06)" stroke="rgba(63,224,140,0.45)" />
      <text x="578" y="210" textAnchor="middle" fill="#3fe08c" style={{ fontSize: 9, letterSpacing: 1 }}>
        EDGE
      </text>
      <text x="578" y="224" textAnchor="middle" fill="rgba(163,180,168,0.7)" style={{ fontSize: 7 }}>
        ESP32
      </text>

      <path d="M100,215 H120 M520,215 H540" stroke="rgba(63,224,140,0.5)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="320" y="392" textAnchor="middle" fill="rgba(163,180,168,0.6)" style={{ fontSize: 9, letterSpacing: 2.4 }}>
        ALL LEVELS SHARE ONE SENSOR BUS · I²C + 1-WIRE + RS485
      </text>
    </svg>
  );
}

function PlateCard({ plate }: { plate: Plate }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={cn("panel group relative flex flex-col overflow-hidden", plate.span)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-abyss">
        {plate.src && !failed ? (
          <>
            <Image
              src={plate.src}
              alt={plate.alt ?? plate.caption}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-90 transition-all duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.035] group-hover:opacity-100"
              onError={() => setFailed(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-void/20" />
          </>
        ) : plate.id === "plan" ? (
          <SensorPlan />
        ) : (
          <PosterPlate label={plate.meta} />
        )}

        <span className="label absolute left-3 top-3 rounded-full border border-line bg-void/70 px-2.5 py-1 backdrop-blur">
          {plate.meta}
        </span>
      </div>

      <figcaption className="border-t border-line px-4 py-3.5">
        <p className="font-display text-[15px] font-bold uppercase tracking-[-0.01em] text-bone">{plate.caption}</p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-sage">{plate.detail}</p>
      </figcaption>
    </figure>
  );
}

export function BuildLogSection() {
  return (
    <Section id="buildlog">
      <SectionHeader
        index="10"
        eyebrow="build log"
        title={
          <>
            How it was <span className="serif lowercase text-chloro">assembled.</span>
          </>
        }
        blurb={
          <>
            <p>
              The repository documents the system in code, schematics and logs — it does not ship photographs of the
              bench. The three plates below are clearly-labelled concept visualisations, and the fourth is the measured
              sensor plan the build was actually wired to.
            </p>
            <p className="mt-3">
              Replace them with your own photographs by dropping files into{" "}
              <span className="font-mono text-sage">/public/images</span> under the same names.
            </p>
          </>
        }
        aside={
          <>
            <Chip>4 plates</Chip>
            <Chip signal>renders labelled</Chip>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        {PLATES.map((plate, index) => (
          <Reveal key={plate.id} delay={index * 0.06} className={plate.span}>
            <PlateCard plate={plate} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <Panel className="mt-4" label="log excerpt">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Week 6",
                d: "First brownout. Pump inrush reset the MCU mid-burst and the log lost the event. Bulk capacitance added the same evening.",
              },
              {
                t: "Week 11",
                d: "Resistive probe replaced with capacitive. The old probe had drifted 22 points in three weeks — a false negative that almost killed a tomato.",
              },
              {
                t: "Week 19",
                d: "Firmware v2.1 split the scheduler into non-blocking tasks. Loop jitter dropped from 480 ms to 3 ms and the watchdog stopped firing.",
              },
            ].map((entry) => (
              <div key={entry.t} className="border-l border-line pl-4">
                <span className="label-signal">{entry.t}</span>
                <p className="mt-2 text-[13px] leading-relaxed text-sage">{entry.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[11.5px] text-mute">
            <Compass size={12} className="text-chloro" aria-hidden />
            Honest build logs beat polished ones — these three failures shaped the final hardware.
          </p>
        </Panel>
      </Reveal>
    </Section>
  );
}
