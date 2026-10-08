import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BOOT_LINES, SITE } from '../data/content'

export default function Boot({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  const finish = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(onDone, 620)
  }

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setLines(BOOT_LINES.slice(0, i))
      setPct(Math.min(100, Math.round((i / BOOT_LINES.length) * 100)))
      if (i >= BOOT_LINES.length) {
        clearInterval(id)
        setTimeout(finish, 650)
      }
    }, 190)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [lines])

  useEffect(() => {
    const onKey = () => finish()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1, filter: leaving ? 'brightness(3)' : 'brightness(1)' }}
      transition={{ duration: 0.55, ease: 'easeIn' }}
      className="fixed inset-0 z-[60] flex flex-col bg-void px-5 py-6 sm:px-10 sm:py-10"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />

      <header className="relative flex flex-wrap items-baseline justify-between gap-2 text-[10px] tracking-[0.3em] text-phos-dim sm:text-xs">
        <span className="text-phos text-glow">{SITE.codename} OS {SITE.version}</span>
        <span>WROOM-32 HARDWARE DIAGNOSTIC LOADER</span>
      </header>

      <div
        ref={scroller}
        className="relative mt-8 flex-1 overflow-hidden text-[11px] leading-6 sm:text-sm"
      >
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-phos-dim/60 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <span className={l.includes('ONLINE') ? 'text-phos text-glow' : 'text-[#9fc6b6]'}>
              {l}
              {l.endsWith('OK') && <span className="ml-2 text-phos">[ ✓ ]</span>}
            </span>
          </div>
        ))}
        <span className="caret ml-7 inline-block h-4 w-2 bg-phos align-middle" />
      </div>

      <footer className="relative mt-6 space-y-3">
        <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-phos-dim sm:text-xs">
          <span>MOUNTING FLASH PREFERENCES…</span>
          <span className="text-phos tabular-nums">{pct}%</span>
        </div>
        <div className="h-[6px] w-full overflow-hidden rounded-full bg-line/70">
          <motion.div
            className="h-full bg-gradient-to-r from-phos-dim via-phos to-cyan"
            animate={{ width: `${pct}%` }}
            transition={{ ease: 'linear', duration: 0.18 }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-phos-dim/80 sm:text-xs">
          <span>{SITE.event}</span>
          <button
            onClick={finish}
            className="cursor-pointer border border-phos/40 px-4 py-2 tracking-[0.2em] text-phos transition hover:bg-phos hover:text-void"
          >
            BYPASS DIAGNOSTICS ▸
          </button>
        </div>
      </footer>
    </motion.div>
  )
}
