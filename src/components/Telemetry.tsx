import { SENSORS } from '../data/content'
import { useSeries, useWalk } from '../lib/useTelemetry'
import { Corners, Heading, Reveal, Section, Sparkline } from './ui'

const ACCENT: Record<string, string> = {
  phos: 'var(--color-phos)',
  cyan: 'var(--color-cyan)',
  amber: 'var(--color-amber)',
}

function SensorCard({ s, i }: { s: (typeof SENSORS)[number]; i: number }) {
  const value = useWalk(s.base, s.range, s.min, s.max)
  const series = useSeries(value)
  const color = ACCENT[s.accent] ?? ACCENT.phos
  const fill = ((value - s.min) / (s.max - s.min)) * 100

  return (
    <Reveal delay={i * 0.08}>
      <div className="group relative h-full border border-line bg-panel/70 p-5 transition-colors hover:border-phos/40">
        <Corners />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs tracking-[0.2em] text-[#cfe6dd]">{s.label.toUpperCase()}</div>
            <div className="mt-1 text-[10px] text-[#6d8f84]">{s.detail}</div>
          </div>
          <span
            className="border px-2 py-1 text-[9px] tracking-[0.18em]"
            style={{ color, borderColor: `${color}55` }}
          >
            {s.status}
          </span>
        </div>

        <div className="mt-6 flex items-end gap-2">
          <span className="font-sans text-5xl font-bold tabular-nums" style={{ color }}>
            {s.id === 'lux' ? value.toFixed(0) : value.toFixed(1)}
          </span>
          <span className="mb-2 text-sm text-[#6d8f84]">{s.unit}</span>
        </div>

        <div className="mt-3">
          <Sparkline data={series} min={s.min} max={s.max} stroke={color} />
        </div>

        <div className="mt-4 h-[3px] w-full bg-line">
          <div
            className="h-full transition-[width] duration-700 ease-out"
            style={{ width: `${fill}%`, background: color, boxShadow: `0 0 12px ${color}` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] tracking-[0.18em] text-[#6d8f84]">
          <span>{s.pin}</span>
          <span className="text-phos/70">◉ STREAMING</span>
        </div>
      </div>
    </Reveal>
  )
}

function Histogram() {
  const bars = Array.from({ length: 24 }, (_, h) => {
    const base = 48 + Math.sin((h / 24) * Math.PI * 2) * 14
    const dip = h >= 13 && h <= 15 ? -12 : 0
    return { h, v: Math.max(22, Math.min(78, base + dip + (h % 3) * 2)) }
  })

  return (
    <Reveal delay={0.1}>
      <div className="relative border border-line bg-panel/70 p-5">
        <Corners />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs tracking-[0.2em] text-[#cfe6dd]">24-HOUR HYDRATION ANALYTICS</div>
          <div className="flex gap-4 text-[10px] tracking-[0.15em] text-[#6d8f84]">
            <span><span className="text-phos">▬</span> SOIL %</span>
            <span><span className="text-amber">▬</span> PUMP EVENT</span>
          </div>
        </div>

        <div className="mt-7 flex h-48 items-end gap-[3px]">
          {bars.map(({ h, v }) => {
            const pump = v < 40
            return (
              <div key={h} className="group/b relative flex-1">
                <div
                  className="w-full rounded-t-[2px] transition-all duration-500"
                  style={{
                    height: `${v * 1.9}px`,
                    background: pump
                      ? 'linear-gradient(to top, rgba(255,182,72,0.15), var(--color-amber))'
                      : 'linear-gradient(to top, rgba(52,245,160,0.1), rgba(52,245,160,0.75))',
                  }}
                />
                <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border border-line bg-void px-2 py-1 text-[9px] text-phos group-hover/b:block">
                  {String(h).padStart(2, '0')}:00 · {v.toFixed(0)}%
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-3 flex justify-between text-[9px] tracking-[0.2em] text-[#5c7a71]">
          {['00:00', '06:00', '12:00', '18:00', '23:59'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

export default function Telemetry() {
  return (
    <Section id="telemetry">
      <Heading
        index="[ 01 / TELEMETRY ]"
        title="Sensory telemetry overview"
        sub="Every value below is a live read from the WROOM-32 sampling loop — soil capacitance, atmosphere, and ambient lux, pushed over MQTT every five seconds."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SENSORS.map((s, i) => (
          <SensorCard key={s.id} s={s} i={i} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Histogram />
        <Reveal delay={0.15}>
          <div className="relative flex h-full flex-col justify-between border border-line bg-panel/70 p-5">
            <Corners />
            <div>
              <div className="text-xs tracking-[0.2em] text-[#cfe6dd]">PLANT VITALITY INDEX</div>
              <p className="mt-3 text-[11px] leading-relaxed text-[#6d8f84]">
                Composite score across moisture stability, light hours, and temperature variance
                over a rolling 7-day window.
              </p>
            </div>

            <div className="my-8 grid place-items-center">
              <div className="relative grid h-44 w-44 place-items-center rounded-full">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#15262a" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="var(--color-phos)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 44}`}
                    strokeDashoffset={`${2 * Math.PI * 44 * (1 - 0.984)}`}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(52,245,160,0.6))' }}
                  />
                </svg>
                <div className="text-center">
                  <div className="font-sans text-4xl font-bold text-phos">98.4</div>
                  <div className="text-[9px] tracking-[0.25em] text-[#6d8f84]">PERCENT</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px bg-line text-center">
              {[
                ['WATER', '99%'],
                ['LIGHT', '97%'],
                ['THERM', '99%'],
              ].map(([k, v]) => (
                <div key={k} className="bg-void px-2 py-3">
                  <div className="text-[9px] tracking-[0.18em] text-[#6d8f84]">{k}</div>
                  <div className="mt-1 text-sm text-phos">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
