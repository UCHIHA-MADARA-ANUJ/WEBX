"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { TIMELINE } from "@/lib/content/site";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<(typeof TIMELINE)[number]["status"], { text: string; accent: string }> = {
  done: { text: "shipped", accent: "#3fe08c" },
  active: { text: "in progress", accent: "#f0b45f" },
  planned: { text: "roadmap", accent: "#b98cff" },
};

export function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="journey">
      <SectionHeader
        index="08"
        eyebrow="journey"
        title={
          <>
            Six months, <span className="serif lowercase text-chloro">one shelf.</span>
          </>
        }
        blurb={
          <>
            <p>
              The build ran from a January problem statement to a June exhibition, with the hardware and the firmware
              leapfrogging each other the whole way.
            </p>
            <p className="mt-3">Everything below is a checkpoint that exists in the repository history.</p>
          </>
        }
        aside={<Chip>jan 2024 → now</Chip>}
      />

      <div ref={ref} className="relative pl-6 sm:pl-10">
        {/* axis */}
        <div className="absolute left-[7px] top-1 h-full w-px bg-line sm:left-[15px]" aria-hidden>
          <motion.span className="absolute inset-x-0 top-0 h-full origin-top bg-chloro/70" style={{ scaleY }} />
          <motion.span
            className="absolute left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-chloro/10 blur-xl"
            style={{ top: glowY }}
          />
        </div>

        <ol className="space-y-8">
          {TIMELINE.map((milestone, index) => {
            const status = STATUS_LABEL[milestone.status];
            return (
              <li key={milestone.id} className="relative">
                <span
                  className="absolute -left-6 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-void sm:-left-10"
                  style={{ background: status.accent, boxShadow: `0 0 12px ${status.accent}80` }}
                  aria-hidden
                />
                <Reveal delay={index * 0.04}>
                  <Panel interactive className="grid gap-4 md:grid-cols-[150px_minmax(0,1fr)] md:gap-6">
                    <div>
                      <span className="label-signal">{milestone.date}</span>
                      <span className="label mt-2 block" style={{ color: status.accent }}>
                        {status.text}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-bone sm:text-2xl">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-sage">{milestone.body}</p>
                      <p
                        className={cn(
                          "mt-3 inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5",
                          "font-mono text-[10.5px] text-mute",
                        )}
                      >
                        {milestone.detail}
                      </p>
                    </div>
                  </Panel>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
