"use client";

import { Award, Medal, Star, Trophy } from "lucide-react";
import { AWARDS } from "@/lib/content/site";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";

const ICONS = [Trophy, Award, Medal, Star];

export function RecognitionSection() {
  return (
    <Section id="recognition">
      <SectionHeader
        index="11"
        eyebrow="recognition"
        title={
          <>
            Judges asked <span className="serif lowercase text-chloro">the right questions.</span>
          </>
        }
        blurb={
          <>
            <p>
              Four events across the second half of 2024. What made the difference in every one of them was not the
              dashboard — it was that the pod kept working after the laptop was closed.
            </p>
            <p className="mt-3">
              The most common question was about failure modes. The answer is on this page: the interlock list in the
              architecture section.
            </p>
          </>
        }
        aside={<Chip>sep → dec 2024</Chip>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {AWARDS.map((award, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <Reveal key={award.id} delay={(index % 2) * 0.07}>
              <Panel interactive className="flex h-full gap-5">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border"
                  style={{ borderColor: `${award.accent}44`, background: `${award.accent}12` }}
                >
                  <Icon size={20} style={{ color: award.accent }} aria-hidden />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-bone">{award.title}</h3>
                    <span className="label">{award.date}</span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: award.accent }}>
                    {award.body}
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-sage">{award.note}</p>
                </div>
              </Panel>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { k: "demonstrations", v: "4 events", d: "two pods running unattended" },
            { k: "longest soak test", v: "14 days", d: "99.97% firmware uptime" },
            { k: "visitors who poked it", v: "~300", d: "no resets, no lost readings" },
          ].map((item) => (
            <div key={item.k} className="panel px-4 py-3.5">
              <span className="label">{item.k}</span>
              <p className="num mt-1 text-lg text-bone">{item.v}</p>
              <p className="mt-0.5 text-[11.5px] text-mute">{item.d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
