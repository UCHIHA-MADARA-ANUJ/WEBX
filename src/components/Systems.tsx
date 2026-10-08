import { SUBSYSTEMS } from '../data/content'
import { Corners, Heading, Reveal, Section } from './ui'

export default function Systems() {
  return (
    <Section id="systems">
      <Heading
        index="[ 02 / SUBSYSTEMS ]"
        title="What's running inside"
        sub="Verde OS is six cooperating subsystems on one dual-core MCU. Each one owns its failure mode so the plant survives any single fault."
      />

      <div className="grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
        {SUBSYSTEMS.map((s, i) => (
          <Reveal key={s.code} delay={(i % 3) * 0.07}>
            <article className="group relative h-full bg-void p-6 transition-colors duration-300 hover:bg-panel">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.3em] text-phos/70">{s.code}</span>
                <span className="text-[10px] text-[#3c5d54] transition-colors group-hover:text-phos">
                  ◢
                </span>
              </div>
              <h3 className="mt-5 font-sans text-xl font-semibold text-[#e7fff5]">{s.title}</h3>
              <p className="mt-3 text-[12.5px] leading-relaxed text-[#80a396]">{s.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-line px-2.5 py-1 text-[9.5px] tracking-[0.15em] text-[#6d8f84] transition-colors group-hover:border-phos/30 group-hover:text-phos/80"
                  >
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>
              <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-phos/0 via-phos to-phos/0 transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="relative mt-5 overflow-hidden border border-line bg-panel/60 p-6 sm:p-8">
          <Corners />
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-phos/70">CONTROL LOOP</div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#80a396]">
                Sample → filter → evaluate hysteresis band → actuate relay → log → publish. The
                whole cycle completes in under 40 ms, which means the pump can be cut the instant a
                reading goes out of range.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em]">
              {['SAMPLE', 'FILTER', 'DECIDE', 'ACTUATE', 'PUBLISH'].map((s, i, a) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="border border-phos/35 bg-void px-3 py-2 text-phos">{s}</span>
                  {i < a.length - 1 && <span className="text-phos/40">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
