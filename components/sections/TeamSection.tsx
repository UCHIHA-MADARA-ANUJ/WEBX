"use client";

import { Mail, MapPin } from "lucide-react";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandIcons";
import { SITE, TEAM } from "@/lib/content/site";
import { Panel, Chip } from "@/components/ui/Panel";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PlantGlyph } from "@/components/visual/PlantGlyph";

export function TeamSection() {
  return (
    <Section id="team">
      <SectionHeader
        index="12"
        eyebrow="team"
        title={
          <>
            Two people, <span className="serif lowercase text-chloro">one system.</span>
          </>
        }
        blurb={
          <>
            <p>
              Software and hardware ran as two halves of the same loop, which is why the firmware knows what the board
              can survive and the board was laid out around what the firmware needs.
            </p>
          </>
        }
        aside={<Chip signal>{SITE.location}</Chip>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {TEAM.map((member, index) => (
          <Reveal key={member.id} delay={index * 0.08}>
            <Panel
              className="h-full"
              label={member.node}
              right={
                <span className="flex items-center gap-2">
                  <span className="dot dot-live" style={{ background: member.accent }} aria-hidden />
                  <span className="label">{member.status}</span>
                </span>
              }
            >
              <div className="flex items-start gap-4">
                <div
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border font-display text-xl font-bold tracking-[-0.04em]"
                  style={{ borderColor: `${member.accent}44`, background: `${member.accent}12`, color: member.accent }}
                >
                  {member.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-bone">{member.name}</h3>
                  <p className="mt-0.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-sage">{member.role}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-mute">
                    <MapPin size={11} aria-hidden />
                    {member.location}
                  </p>
                </div>
                <PlantGlyph seed={member.id} accent={member.accent} size={54} className="ml-auto hidden shrink-0 sm:block" />
              </div>

              <p className="mt-5 text-[13.5px] leading-relaxed text-sage">{member.focus}</p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <span className="label">contributions</span>
                  <ul className="mt-3 space-y-2">
                    {member.contributions.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[12.5px] leading-snug text-sage">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: member.accent }} aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="label">stack</span>
                  <ul className="mt-3 space-y-2.5">
                    {member.stack.map((skill) => (
                      <li key={skill.label}>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-sage">{skill.label}</span>
                          <span className="num text-[10px] text-mute">{Math.round(skill.value * 100)}</span>
                        </div>
                        <span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-bone/10">
                          <span
                            className="block h-full rounded-full"
                            style={{ width: `${skill.value * 100}%`, background: member.accent }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <blockquote className="mt-5 border-l-2 pl-4" style={{ borderColor: `${member.accent}66` }}>
                <p className="serif text-[17px] leading-snug text-bone">“{member.quote}”</p>
              </blockquote>

              <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
                {member.links.github ? (
                  <a
                    href={member.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-sage transition-colors hover:border-chloro/40 hover:text-chloro"
                    aria-label={`${member.name} on GitHub`}
                  >
                    <GithubMark width={14} height={14} />
                  </a>
                ) : null}
                {member.links.linkedin ? (
                  <a
                    href={member.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-sage transition-colors hover:border-chloro/40 hover:text-chloro"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <LinkedinMark width={14} height={14} />
                  </a>
                ) : null}
                <a
                  href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent(`Project Verde — for ${member.name}`)}`}
                  className="ml-auto inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-sage transition-colors hover:text-chloro"
                >
                  <Mail size={12} aria-hidden />
                  write directly
                </a>
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
