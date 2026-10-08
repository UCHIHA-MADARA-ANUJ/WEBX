"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Loader2, Mail, MapPin, TriangleAlert } from "lucide-react";
import { SITE, SOCIALS } from "@/lib/content/site";
import { GithubMark, LinkedinMark, XMark } from "@/components/ui/BrandIcons";
import { Panel, Chip } from "@/components/ui/Panel";
import { ParticleField } from "@/components/visual/ParticleField";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const INTENTS = ["Collaboration", "Review the system", "Deploy something like this", "Just saying hello"];

const SOCIAL_ICONS = [GithubMark, LinkedinMark, XMark];

type State = "idle" | "sending" | "sent" | "error";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", intent: INTENTS[0], message: "" });
  const [state, setState] = useState<State>("idle");
  const [feedback, setFeedback] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) throw new Error(payload.message ?? "Delivery failed");
      setState("sent");
      setFeedback(payload.message ?? "Message received.");
      setForm({ name: "", email: "", intent: INTENTS[0], message: "" });
    } catch (error) {
      setState("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <Section id="contact" top className="overflow-hidden">
      {/* drifting spores behind the closing panel */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70" aria-hidden>
        <ParticleField density={0.55} />
      </div>

      <SectionHeader
        index="14"
        eyebrow="contact"
        title={
          <>
            Open the <span className="serif lowercase text-chloro">channel.</span>
          </>
        }
        blurb={
          <>
            <p>
              Collaboration, a technical review, a school that wants to build one, or a question about a specific
              failure mode — all of it goes to the same inbox.
            </p>
            <p className="mt-3">
              Expect a reply inside 48 hours. If the form is running without a mail provider configured, it will tell you
              so instead of pretending the message went somewhere.
            </p>
          </>
        }
        aside={<Chip signal>reply &lt; 48 h</Chip>}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Panel label="transmit" right={<Mail size={12} className="text-chloro" aria-hidden />}>
            <form onSubmit={submit} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="field mt-2"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="label">email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="field mt-2"
                    placeholder="you@domain.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <fieldset>
                <legend className="label">intent</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTENTS.map((intent) => (
                    <button
                      key={intent}
                      type="button"
                      onClick={() => setForm({ ...form, intent })}
                      aria-pressed={form.intent === intent}
                      className={cn(
                        "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                        form.intent === intent
                          ? "border-chloro/50 bg-chloro/[0.09] text-chloro"
                          : "border-line text-sage hover:border-bone/30 hover:text-bone",
                      )}
                    >
                      {intent}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className="label">message</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  className="field mt-2 resize-y"
                  placeholder="What are you building, and what would help?"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
                  {state === "sending" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" aria-hidden />
                      transmitting
                    </>
                  ) : (
                    <>
                      send message
                      <ArrowUpRight size={14} aria-hidden />
                    </>
                  )}
                </button>
                <a href={`mailto:${SITE.contactEmail}`} className="btn btn-quiet text-[10px]">
                  or email directly
                </a>
              </div>

              {state === "sent" ? (
                <p className="flex items-center gap-2 rounded-lg border border-chloro/35 bg-chloro/[0.06] px-3.5 py-3 text-[13px] text-bone">
                  <Check size={14} className="text-chloro" aria-hidden />
                  {feedback}
                </p>
              ) : null}
              {state === "error" ? (
                <p className="flex items-start gap-2 rounded-lg border border-rust/40 bg-rust/[0.07] px-3.5 py-3 text-[13px] text-bone">
                  <TriangleAlert size={14} className="mt-0.5 shrink-0 text-rust" aria-hidden />
                  <span>
                    {feedback} — nothing was sent. Write to{" "}
                    <a className="text-chloro link-quiet" href={`mailto:${SITE.contactEmail}`}>
                      {SITE.contactEmail}
                    </a>{" "}
                    instead.
                  </span>
                </p>
              ) : null}
            </form>
          </Panel>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.08}>
          <div className="space-y-4">
            <Panel label="direct lines">
              <ul className="space-y-4">
                <li>
                  <span className="label">email</span>
                  <a href={`mailto:${SITE.contactEmail}`} className="link-quiet mt-1 block text-[15px] text-bone">
                    {SITE.contactEmail}
                  </a>
                </li>
                <li>
                  <span className="label">repository</span>
                  <a
                    href={SITE.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="link-quiet mt-1 block break-all text-[15px] text-bone"
                  >
                    {SITE.repo.replace("https://", "")}
                  </a>
                </li>
                <li>
                  <span className="label">location</span>
                  <p className="mt-1 flex items-center gap-2 text-[15px] text-bone">
                    <MapPin size={13} className="text-chloro" aria-hidden />
                    {SITE.location}
                    <span className="font-mono text-[11px] text-mute">
                      {SITE.coordinates.lat} {SITE.coordinates.lon}
                    </span>
                  </p>
                </li>
              </ul>

              <div className="mt-5 flex items-center gap-2 border-t border-line pt-4">
                {SOCIALS.map((social, index) => {
                  const Icon = SOCIAL_ICONS[index] ?? GithubMark;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-sage transition-colors hover:border-chloro/40 hover:text-chloro"
                    >
                      <Icon width={15} height={15} />
                    </a>
                  );
                })}
                <span className="label ml-1">github · linkedin · x</span>
              </div>
            </Panel>

            <Panel label="what happens next">
              <ol className="space-y-3">
                {[
                  "Your message lands in the project inbox and gets logged alongside the pod fault trail.",
                  "If it is technical, you get the relevant file or schematic rather than a summary.",
                  "If it is a build question, expect the failure log too — the mistakes are the useful part.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3 text-[13px] leading-relaxed text-sage">
                    <span className="font-mono text-[10px] text-chloro">0{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
