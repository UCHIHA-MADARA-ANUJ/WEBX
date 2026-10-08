"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Download, MapPin } from "lucide-react";
import { SITE, SPEC_TICKER } from "@/lib/content/site";
import { Marquee } from "@/components/ui/Marquee";
import { Magnetic } from "@/components/ui/Buttons";
import { Scramble } from "@/components/ui/Scramble";
import { TowerSVG } from "@/components/visual/TowerSVG";
import { usePods } from "@/components/providers/PodProvider";
import { useScrollTo } from "@/components/providers/ScrollProvider";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useSettings } from "@/components/providers/SettingsProvider";
import { plantById } from "@/lib/content/plants";

const GrowTower = dynamic(() => import("@/components/visual/GrowTower").then((mod) => mod.GrowTower), {
  ssr: false,
});

export function Hero() {
  const { scrollTo } = useScrollTo();
  const { pods } = usePods();
  const snapshot = useTelemetry(pods, 30000);
  const { ambient } = useSettings();

  const pod = snapshot?.pods[0];
  const plant = plantById(pod?.plantId ?? pods[0]);
  const vitals = pod?.vitals ?? [];

  const readouts = [
    { label: "soil moisture", value: vitals.find((v) => v.key === "moisture")?.value, unit: "%", accent: "#3fe08c" },
    { label: "air temp", value: vitals.find((v) => v.key === "airTemp")?.value, unit: "°C", accent: "#5fe3d6" },
    { label: "reservoir", value: vitals.find((v) => v.key === "tank")?.value, unit: "%", accent: "#3fe08c" },
    { label: "fleet uptime", value: snapshot?.fleet.uptime ?? 99.9, unit: "%", accent: "#b98cff" },
  ];

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-10">
      <div className="mx-auto grid w-full max-w-[1320px] flex-1 items-center gap-10 px-5 sm:px-7 lg:grid-cols-12 lg:gap-8 lg:px-12">
        {/* ── copy ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="chip chip-signal">
              <span className="dot dot-live" aria-hidden />
              {SITE.status}
            </span>
            <span className="chip">
              <MapPin size={11} aria-hidden />
              {SITE.location}
            </span>
          </motion.div>

          <h1 className="mt-6">
            <span className="block font-mono text-[11px] uppercase tracking-[0.32em] text-sage">
              {SITE.edition} · {SITE.version}
            </span>
            <span className="display mt-3 block text-[clamp(3.4rem,12vw,9.5rem)] text-bone">
              <Scramble text="PROJECT" trigger="always" speed={34} />
              <br />
              <span className="text-chloro glow">
                <Scramble text="VERDE" trigger="always" speed={34} />
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-sage"
          >
            <span className="serif text-xl text-bone">Chlorophyll meets silicon.</span> {SITE.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.62 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <button type="button" className="btn btn-primary" onClick={() => scrollTo("system")}>
                open the system
                <ArrowUpRight size={14} aria-hidden />
              </button>
            </Magnetic>
            <a className="btn btn-ghost" href="/api/spec" download="verde-system-spec.md">
              <Download size={14} aria-hidden />
              system spec
            </a>
            <button type="button" className="btn btn-quiet" onClick={() => scrollTo("telemetry")}>
              live telemetry
            </button>
          </motion.div>

          {/* live readouts */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4"
          >
            {readouts.map((item) => (
              <div key={item.label} className="bg-void/85 px-3.5 py-3">
                <dt className="label">{item.label}</dt>
                <dd className="num mt-1 text-lg text-bone" style={{ color: item.value == null ? undefined : item.accent }}>
                  {item.value == null ? "—" : item.value}
                  <span className="ml-0.5 text-[11px] text-sage">{item.unit}</span>
                </dd>
              </div>
            ))}
          </motion.dl>

          <p className="mt-3 flex items-center gap-2">
            <span className="dot animate-breathe" aria-hidden />
            <span className="label">
              active profile · {plant.name} · band {plant.window[0]}–{plant.window[2]}% · feed simulated
            </span>
          </p>
        </div>

        {/* ── tower ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="relative lg:col-span-5"
        >
          <div className="relative mx-auto aspect-[440/660] w-full max-w-[440px]">
            <div className="absolute inset-0">
              <TowerSVG />
            </div>
            {ambient ? <GrowTower className="absolute inset-0" /> : null}

            <span className="label absolute -left-1 top-6 hidden sm:block">grow tower · live render</span>
            <span className="label absolute -right-1 top-6 hidden text-right sm:block">
              7 levels
              <br />
              21 sites
            </span>
            <span className="label absolute -left-1 bottom-10 hidden sm:block">
              sense → decide
              <br />
              → water → report
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── footer strip ───────────────────────────────────────────────────── */}
      <div className="mt-10">
        <div className="rule" aria-hidden />
        <Marquee duration={60} className="py-3">
          {SPEC_TICKER.map((spec) => (
            <span key={spec} className="flex items-center gap-4 pr-8">
              <span className="h-1 w-1 shrink-0 rounded-full bg-chloro/70" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage">{spec}</span>
            </span>
          ))}
        </Marquee>
        <div className="rule" aria-hidden />

        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-5 py-4 sm:px-7 lg:px-12">
          <span className="label">scroll to begin · {SITE.coordinates.lat} {SITE.coordinates.lon}</span>
          <button
            type="button"
            onClick={() => scrollTo("manifesto")}
            className="group flex items-center gap-2 text-sage transition-colors hover:text-chloro"
            aria-label="Scroll to manifesto"
          >
            <span className="label">manifesto</span>
            <ArrowDown size={13} className="transition-transform duration-500 group-hover:translate-y-1" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
