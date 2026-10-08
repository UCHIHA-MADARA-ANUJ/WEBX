import { SITE } from '../data/content'
import { Corners, Reveal, Section } from './ui'

export default function Contact() {
  return (
    <>
      <Section id="contact" className="pb-10!">
        <Reveal>
          <div className="relative overflow-hidden border border-line bg-panel/60 px-6 py-16 text-center sm:px-10 sm:py-24">
            <Corners />
            <div className="grid-bg absolute inset-0 opacity-50" />
            <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-phos/10 blur-[120px]" />

            <div className="relative">
              <div className="text-[10px] tracking-[0.35em] text-phos/70">[ 07 / UPLINK ]</div>
              <h2 className="mx-auto mt-6 max-w-3xl font-sans text-4xl font-bold leading-[1.05] tracking-tight text-[#e7fff5] sm:text-6xl">
                Want the board, the firmware,
                <br />
                or a <span className="text-phos text-glow">demo</span>?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#80a396]">
                Schematics, source and the full build log are open. Send a message and we'll ship
                the repo plus a wiring diagram you can reproduce in an afternoon.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${SITE.email}`}
                  className="border border-phos bg-phos px-8 py-4 text-[11px] font-bold tracking-[0.25em] text-void transition hover:bg-transparent hover:text-phos"
                >
                  ▸ SEND TRANSMISSION
                </a>
                <a
                  href={SITE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-line px-8 py-4 text-[11px] tracking-[0.25em] text-[#9fc6b6] transition hover:border-phos/50 hover:text-phos"
                >
                  VIEW SOURCE
                </a>
              </div>

              <div className="mt-10 font-mono text-[11px] tracking-[0.2em] text-[#5c7a71]">
                {SITE.email}
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-[10px] tracking-[0.2em] text-[#5c7a71] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>
            {SITE.codename} {SITE.version} · BUILD {SITE.build} · HASH {SITE.hash}
          </span>
          <span className="flex items-center gap-2 text-phos-dim">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-phos" />
            ALL SYSTEMS NOMINAL · {SITE.event}
          </span>
        </div>
      </footer>
    </>
  )
}
