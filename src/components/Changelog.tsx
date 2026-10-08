import { TIMELINE } from '../data/content'
import { Heading, Reveal, Section } from './ui'

export default function Changelog() {
  return (
    <Section id="log">
      <Heading
        index="[ 05 / CHANGELOG ]"
        title="From breadboard to OS"
        sub="Five revisions, a lot of soldering, and one plant that never had to be watered by hand again."
      />

      <div className="relative">
        <span className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-phos/60 via-line to-transparent sm:left-[15px]" />
        <ol className="space-y-7">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.stamp} delay={i * 0.06}>
              <li className="group relative flex gap-5 pl-10 sm:pl-14">
                <span className="absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full border border-phos/45 bg-void text-[9px] text-phos sm:h-8 sm:w-8 sm:text-[10px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 border-b border-line pb-6 transition-colors group-hover:border-phos/30">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="border border-phos/30 px-2 py-0.5 text-[10px] tracking-[0.2em] text-phos">
                      {t.stamp}
                    </span>
                    <h3 className="font-sans text-xl font-semibold text-[#e7fff5]">{t.title}</h3>
                  </div>
                  <p className="mt-2.5 max-w-2xl text-[12.5px] leading-relaxed text-[#80a396]">
                    {t.body}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
