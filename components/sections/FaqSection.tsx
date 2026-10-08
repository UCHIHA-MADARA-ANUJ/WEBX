"use client";

import { Download, HelpCircle } from "lucide-react";
import { FAQ } from "@/lib/content/site";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";
import { useScrollTo } from "@/components/providers/ScrollProvider";

export function FaqSection() {
  const { scrollTo } = useScrollTo();

  return (
    <Section id="faq">
      <SectionHeader
        index="13"
        eyebrow="engineering faq"
        title={
          <>
            The questions that <span className="serif lowercase text-chloro">actually matter.</span>
          </>
        }
        blurb={
          <>
            <p>
              These are the eight questions that came up most often — at the exhibition, in code review, and from people
              who have kept plants alive for longer than we have.
            </p>
            <p className="mt-3">
              If yours is not here, the contact form below goes to the same inbox the pod's fault alerts used to.
            </p>
          </>
        }
        aside={<Chip>{FAQ.length} entries</Chip>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <Accordion items={FAQ} defaultOpen={FAQ[0].id} />
        </Reveal>

        <Reveal className="lg:col-span-4" delay={0.08}>
          <div className="space-y-4 lg:sticky lg:top-24">
            <Panel label="take it with you">
              <p className="text-[13.5px] leading-relaxed text-sage">
                The full technical sheet — firmware structure, power tree, sensor calibration method, Firebase schema and
                the failure log — is generated on demand from the same data this page renders.
              </p>
              <a href="/api/spec" download="verde-system-spec.md" className="btn btn-primary mt-5 w-full justify-center">
                <Download size={14} aria-hidden />
                download system spec
              </a>
              <p className="label mt-3">markdown · generated server-side · no tracking</p>
            </Panel>

            <Panel label="still curious?">
              <div className="flex items-start gap-3">
                <HelpCircle size={16} className="mt-0.5 shrink-0 text-chloro" aria-hidden />
                <p className="text-[13px] leading-relaxed text-sage">
                  Ask about anything: sensor choice, the model's failure modes, why the cloud is not in the control path,
                  or how to scale this past a terrace.
                </p>
              </div>
              <button type="button" className="btn btn-ghost mt-4 w-full justify-center" onClick={() => scrollTo("contact")}>
                open the channel
              </button>
            </Panel>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
