import { useEffect, useState } from 'react'
import { SITE } from '../data/content'
import { pad, useClock } from '../lib/useTelemetry'

const LINKS = [
  { id: 'telemetry', label: 'TELEMETRY' },
  { id: 'systems', label: 'SYSTEMS' },
  { id: 'hardware', label: 'HARDWARE' },
  { id: 'shell', label: 'SHELL' },
  { id: 'log', label: 'CHANGELOG' },
  { id: 'crew', label: 'CREW' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('telemetry')
  const now = useClock()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'border-b border-line bg-void/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <a href="#top" className="group flex items-center gap-3">
          <span className="relative grid h-8 w-8 place-items-center border border-phos/50 text-phos">
            <span className="pulse-ring absolute inset-0 border border-phos/40" />
            <span className="text-sm font-bold">V</span>
          </span>
          <span className="hidden text-xs tracking-[0.3em] text-[#cfe6dd] sm:block">
            {SITE.codename}
            <span className="ml-2 text-phos-dim">{SITE.version}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`px-3 py-2 text-[11px] tracking-[0.22em] transition-colors ${
                active === l.id ? 'text-phos text-glow' : 'text-[#71968a] hover:text-[#cfe6dd]'
              }`}
            >
              {active === l.id ? '▸ ' : ''}
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-[10px] tracking-[0.2em] text-phos-dim xl:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-phos" />
            {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())} UTC
          </span>
          <a
            href="#contact"
            className="hidden border border-phos/40 px-4 py-2 text-[11px] tracking-[0.2em] text-phos transition hover:bg-phos hover:text-void sm:block"
          >
            UPLINK
          </a>
          <button
            aria-label="menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center border border-line text-phos lg:hidden"
          >
            {open ? '✕' : '≡'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid grid-cols-2 gap-px border-t border-line bg-line lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="bg-void px-5 py-4 text-[11px] tracking-[0.22em] text-[#9fc6b6]"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
