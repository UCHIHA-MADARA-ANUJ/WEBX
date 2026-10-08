"use client";

import { useState } from "react";
import { ChevronRight, Cpu, Terminal as TerminalIcon } from "lucide-react";
import { CODE_FILES, RUNTIME_LOG } from "@/lib/content/firmware";
import { CYCLE } from "@/lib/content/system";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Terminal } from "@/components/ui/Terminal";
import { cn } from "@/lib/utils";

export function FirmwareSection() {
  const [fileId, setFileId] = useState(CODE_FILES[0].id);
  const [stepId, setStepId] = useState(CYCLE[0].id);

  const file = CODE_FILES.find((item) => item.id === fileId) ?? CODE_FILES[0];
  const step = CYCLE.find((item) => item.id === stepId) ?? CYCLE[0];

  return (
    <Section id="firmware">
      <SectionHeader
        index="06"
        eyebrow="software"
        title={
          <>
            The loop, <span className="serif lowercase text-chloro">in C++.</span>
          </>
        }
        blurb={
          <>
            <p>
              Firmware short enough to read in one sitting, and structured so that nothing in the path of a watering
              decision is allowed to wait on the network.
            </p>
            <p className="mt-3">
              Three files, all real: the control loop, the read-path API route, and one tile from the telemetry grid.
            </p>
          </>
        }
        aside={
          <>
            <Chip>1,200+ lines total</Chip>
            <Chip signal>dual target build</Chip>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {CODE_FILES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFileId(item.id)}
                aria-pressed={fileId === item.id}
                className={cn(
                  "rounded-lg border px-3 py-2 font-mono text-[11px] transition-colors",
                  fileId === item.id
                    ? "border-chloro/45 bg-chloro/[0.08] text-chloro"
                    : "border-line text-sage hover:border-bone/25 hover:text-bone",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>

          <CodeBlock file={file} maxHeight="34rem" />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <Reveal>
            <Panel label={file.name} right={<Cpu size={12} className="text-chloro" aria-hidden />}>
              <p className="text-[13.5px] leading-relaxed text-sage">{file.blurb}</p>
              <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
                {[
                  { k: "target", v: "ESP32 / ESP8266" },
                  { k: "language", v: file.lang === "cpp" ? "C++ 17" : file.lang === "tsx" ? "TSX" : "TypeScript" },
                  { k: "build", v: "platformio" },
                  { k: "watchdog", v: "30 s" },
                ].map((row) => (
                  <div key={row.k} className="bg-void/85 px-3 py-2.5">
                    <dt className="label text-[9px]">{row.k}</dt>
                    <dd className="num mt-0.5 text-[12.5px] text-bone">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </Reveal>

          <Reveal delay={0.08}>
            <Terminal
              lines={RUNTIME_LOG}
              intervalMs={900}
              height="14rem"
              title="serial monitor · 115200 baud"
            />
          </Reveal>
        </div>
      </div>

      {/* day in the life */}
      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3 pb-4">
          <h3 className="display text-[clamp(1.4rem,3vw,2.2rem)] text-bone">
            One day, <span className="serif lowercase text-chloro">hands free</span>
          </h3>
          <span className="label flex items-center gap-2">
            <TerminalIcon size={12} className="text-chloro" aria-hidden />
            eight checkpoints · click to read the log
          </span>
        </div>
        <div className="rule" aria-hidden />

        <div className="mt-5 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ol className="relative space-y-1">
              {CYCLE.map((item) => {
                const active = item.id === stepId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setStepId(item.id)}
                      aria-pressed={active}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all duration-300",
                        active ? "border-chloro/40 bg-chloro/[0.07]" : "border-transparent hover:bg-bone/[0.03]",
                      )}
                    >
                      <span className="num w-[70px] shrink-0 font-mono text-[11px]" style={{ color: item.accent }}>
                        {item.time}
                      </span>
                      <span className={cn("flex-1 text-[13.5px]", active ? "text-bone" : "text-sage")}>{item.title}</span>
                      <ChevronRight
                        size={13}
                        className={cn("shrink-0 transition-transform", active ? "text-chloro" : "text-mute group-hover:translate-x-0.5")}
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-7">
            <Panel label={`checkpoint · ${step.time}`} right={<span className="label">trace</span>} className="h-full">
              <p className="text-[14px] leading-relaxed text-sage">{step.body}</p>
              <pre className="term inset-well mt-4 overflow-x-auto p-4 text-[11.5px] leading-relaxed text-bone">
                {step.log.join("\n")}
              </pre>
            </Panel>
          </div>
        </div>
      </div>
    </Section>
  );
}
