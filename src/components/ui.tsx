import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Section({
  id,
  children,
  className = '',
}: {
  id?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 ${className}`}>
      {children}
    </section>
  )
}

export function Heading({
  index,
  title,
  sub,
}: {
  index: string
  title: string
  sub?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="mb-4 flex items-center gap-4">
        <span className="text-[11px] tracking-[0.35em] text-phos/70">{index}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-phos/45 to-transparent" />
      </div>
      <h2 className="font-sans text-3xl font-bold tracking-tight text-[#e7fff5] sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#80a396] sm:text-base">{sub}</p>}
    </motion.div>
  )
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Panel({
  children,
  className = '',
  label,
}: {
  children: ReactNode
  className?: string
  label?: string
}) {
  return (
    <div
      className={`relative border border-line bg-panel/80 backdrop-blur-sm transition-colors duration-300 hover:border-phos/40 ${className}`}
    >
      <Corners />
      {label && (
        <div className="border-b border-line/80 px-4 py-2 text-[10px] tracking-[0.3em] text-phos-dim">
          {label}
        </div>
      )}
      {children}
    </div>
  )
}

export function Corners() {
  const c = 'absolute h-2.5 w-2.5 border-phos/55'
  return (
    <>
      <span className={`${c} left-[-1px] top-[-1px] border-l border-t`} />
      <span className={`${c} right-[-1px] top-[-1px] border-r border-t`} />
      <span className={`${c} bottom-[-1px] left-[-1px] border-b border-l`} />
      <span className={`${c} bottom-[-1px] right-[-1px] border-b border-r`} />
    </>
  )
}

export function Sparkline({
  data,
  min,
  max,
  stroke = 'var(--color-phos)',
  height = 44,
}: {
  data: number[]
  min: number
  max: number
  stroke?: string
  height?: number
}) {
  const w = 100
  const span = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = height - ((v - min) / span) * height
    return [x, Math.max(2, Math.min(height - 2, y))] as const
  })
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const area = `${d} L${w},${height} L0,${height} Z`
  const id = `g-${stroke.replace(/[^a-z]/gi, '')}`

  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="h-11 w-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      {pts.length > 0 && (
        <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.6" fill={stroke} />
      )}
    </svg>
  )
}
