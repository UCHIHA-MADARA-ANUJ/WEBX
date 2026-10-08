"use client";

import { ArrowUp } from "lucide-react";
import { GithubMark, LinkedinMark, XMark } from "@/components/ui/BrandIcons";
import { NAV, SITE, SOCIALS } from "@/lib/content/site";
import { useScrollTo } from "@/components/providers/ScrollProvider";
import { useTelemetry } from "@/hooks/useTelemetry";
import { DEFAULT_PODS } from "@/components/providers/PodProvider";

const SOCIAL_ICONS = [GithubMark, LinkedinMark, XMark];

export function Footer() {
  const { scrollTo } = useScrollTo();
  const snapshot = useTelemetry(DEFAULT_PODS, 45000);

  return (
    <footer className="relative border-t border-line bg-abyss/60 pt-16">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-7 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <p className="label">status</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
              {[
                { label: "fleet uptime", value: `${snapshot?.fleet.uptime ?? 99.9}%` },
                { label: "nodes", value: `${snapshot?.fleet.nodes ?? 8}` },
                { label: "tank", value: `${snapshot?.fleet.tankPct ?? 78}%` },
                { label: "feed", value: "simulated" },
              ].map((item) => (
                <div key={item.label}>
                  <span className="num block text-lg text-bone">{item.value}</span>
                  <span className="label mt-0.5 block">{item.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-md text-[13.5px] leading-relaxed text-sage">
              {SITE.summary}
            </p>

            <div className="mt-6 flex items-center gap-2">
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
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="label">index</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
                {NAV.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className="link-quiet flex items-baseline gap-2 text-[13px] text-sage hover:text-bone"
                    >
                      <span className="font-mono text-[9.5px] text-mute">{item.index}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <p className="label">spec sheet</p>
                <a
                  href="/api/spec"
                  download="verde-system-spec.md"
                  className="btn btn-ghost mt-4 w-full justify-center text-[10px]"
                >
                  download .md
                </a>
              </div>
              <div>
                <p className="label">coordinates</p>
                <ul className="mt-3 space-y-1.5 font-mono text-[11.5px] text-mute">
                  <li>{SITE.coordinates.lat}</li>
                  <li>{SITE.coordinates.lon}</li>
                  <li>{SITE.coordinates.zone}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 select-none">
          <span
            className="block font-display font-bold uppercase leading-[0.8] tracking-[-0.05em] text-transparent"
            style={{
              fontSize: "clamp(3.5rem, 18vw, 15rem)",
              WebkitTextStroke: "1px rgba(241,244,238,0.09)",
            }}
            aria-hidden
          >
            VERDE
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6">
          <p className="label">
            © {SITE.founded}–{new Date().getFullYear()} {SITE.name} · built in {SITE.location}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <p className="label hidden sm:block">press ⌘K for the command palette</p>
            <button type="button" onClick={() => scrollTo(0)} className="btn btn-quiet flex items-center gap-2 px-3 py-2 text-[10px]">
              back to top
              <ArrowUp size={12} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
