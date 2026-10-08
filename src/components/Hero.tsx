import { motion } from 'framer-motion'
import { METRICS, SITE } from '../data/content'
import { useSeries, useWalk } from '../lib/useTelemetry'
import { Corners, Sparkline } from './ui'

const TICKER = [
  'SOIL 52%',
  'DHT11 OK',
  'LUX 720',
  'PUMP IDLE',
  'MQTT QoS1',
  'HEAP 214KB',
  'RSSI -51dBm',
  'WDT ARMED',
  'OTA SLOT A',
  'UPTIME 41d',
]

export default function Hero() {
  const soil = useWalk(52, 6, 20, 90)
  const series = useSeries(soil)

  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24">
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="absolute left-1/2 top-[-10%] h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-phos/10 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-wrap items-center gap-3 text-[10px] tracking-[0.3em] text-phos-dim sm:text-[11px]"
        >
          <span className="flex items-center gap-2 border border-phos/30 px-3 py-1.5 text-phos">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-phos" /> SYSTEM ONLINE
          </span>
          <span>BUILD {SITE.build}</span>
          <span className="hidden sm:inline">HASH {SITE.hash}</span>
          <span>{SITE.event}</span>
        </motion.div>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="font-sans text-[15vw] leading-[0.82] font-bold tracking-tighter text-[#e7fff5] sm:text-[11rem] lg:text-[13rem]"
            >
              VER
              <span className="text-phos text-glow">DE</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 max-w-xl text-sm leading-relaxed text-[#8fb3a6] sm:text-base"
            >
              <span className="text-phos">{SITE.tagline}.</span> {SITE.blurb}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <a
                href="#telemetry"
                className="group relative overflow-hidden border border-phos bg-phos px-7 py-3.5 text-[11px] font-bold tracking-[0.25em] text-void transition hover:bg-transparent hover:text-phos"
              >
                ▸ LIVE TELEMETRY
              </a>
              <a
                href="#shell"
                className="border border-line px-7 py-3.5 text-[11px] tracking-[0.25em] text-[#9fc6b6] transition hover:border-phos/50 hover:text-phos"
              >
                OPEN SHELL
              </a>
            </motion.div>

            <div className="mt-12 grid max-w-xl grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {METRICS.map((m) => (
                <div key={m.label} className="bg-void px-4 py-4">
                  <div className="font-sans text-2xl font-bold text-phos">{m.value}</div>
                  <div className="mt-1 text-[9px] tracking-[0.18em] text-[#6d8f84]">
                    {m.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="drift relative border border-line bg-panel/70 p-5 backdrop-blur-sm box-glow"
          >
            <Corners />
            <div className="flex items-center justify-between text-[10px] tracking-[0.28em] text-phos-dim">
              <span>LIVE · SOIL HYDRATION</span>
              <span className="text-phos">GPIO 34</span>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <span className="font-sans text-6xl font-bold tabular-nums text-[#e7fff5]">
                {soil.toFixed(1)}
              </span>
              <span className="mb-2 text-xl text-phos">%</span>
              <span className="mb-3 ml-auto text-[10px] tracking-[0.2em] text-phos">
                ▲ WITHIN BAND
              </span>
            </div>
            <div className="mt-4">
              <Sparkline data={series} min={20} max={90} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px border border-line bg-line text-center">
              {[
                ['PUMP', 'IDLE'],
                ['BAND', '38–58'],
                ['CYCLES', '1,284'],
              ].map(([k, v]) => (
                <div key={k} className="bg-void px-2 py-3">
                  <div className="text-[9px] tracking-[0.2em] text-[#6d8f84]">{k}</div>
                  <div className="mt-1 text-xs text-phos">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden border-y border-line bg-panel/50 py-2.5">
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-[10px] tracking-[0.3em] text-phos-dim">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-phos/40">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
