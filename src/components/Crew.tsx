import { TEAM } from '../data/content'
import { Corners, Heading, Reveal, Section } from './ui'

export default function Crew() {
  return (
    <Section id="crew">
      <Heading
        index="[ 06 / CREW ]"
        title="Two people, one board"
        sub="Built for the DAV ACON 5 IoT showcase — firmware on one side, interface on the other, both arguing about pin assignments."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.08}>
            <article className="group relative h-full overflow-hidden border border-line bg-panel/70 p-6 transition-colors hover:border-phos/40 sm:p-8">
              <Corners />
              <div className="absolute -right-6 -top-8 font-sans text-[8rem] font-bold leading-none text-phos/[0.05] transition-colors group-hover:text-phos/[0.09]">
                {m.glyph}
              </div>

              <div className="relative flex items-center gap-4">
                <div className="relative grid h-14 w-14 shrink-0 place-items-center border border-phos/40 font-sans text-2xl font-bold text-phos">
                  {m.name[0]}
                  <span className="pulse-ring absolute inset-0 border border-phos/25" />
                </div>
                <div>
                  <h3 className="font-sans text-2xl font-bold text-[#e7fff5]">{m.name}</h3>
                  <div className="text-[11px] tracking-[0.2em] text-phos">{m.role.toUpperCase()}</div>
                </div>
              </div>

              <p className="relative mt-6 text-[12.5px] leading-relaxed text-[#80a396]">{m.bio}</p>

              <div className="relative mt-6 flex flex-wrap gap-2">
                {m.skills.map((s) => (
                  <span
                    key={s}
                    className="border border-line px-2.5 py-1 text-[9.5px] tracking-[0.15em] text-[#6d8f84] transition-colors group-hover:border-phos/30 group-hover:text-phos/80"
                  >
                    {s.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="relative mt-7 flex items-center justify-between border-t border-line pt-4 text-[10px] tracking-[0.2em] text-[#5c7a71]">
                <span>{m.handle}</span>
                <span className="text-phos/70">● ACTIVE</span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
