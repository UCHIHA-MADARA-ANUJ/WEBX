import { useEffect, useRef, useState } from 'react'

/** Smooth pseudo-random walk — looks like a live sensor, never jumps. */
export function useWalk(base: number, range: number, min: number, max: number, ms = 1600) {
  const [value, setValue] = useState(base)
  const phase = useRef(Math.random() * Math.PI * 2)

  useEffect(() => {
    const id = setInterval(() => {
      phase.current += 0.35 + Math.random() * 0.25
      const wave = Math.sin(phase.current) * 0.6 + (Math.random() - 0.5) * 0.8
      const next = base + wave * range
      setValue(Math.min(max, Math.max(min, next)))
    }, ms)
    return () => clearInterval(id)
  }, [base, range, min, max, ms])

  return value
}

/** Rolling history series for sparklines. */
export function useSeries(value: number, length = 48) {
  const [series, setSeries] = useState<number[]>(() => Array.from({ length }, () => value))
  const latest = useRef(value)
  latest.current = value

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => [...prev.slice(1), latest.current])
    }, 900)
    return () => clearInterval(id)
  }, [])

  return series
}

/** Monotonic clock string, updated every second. */
export function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function pad(n: number, size = 2) {
  return String(Math.floor(n)).padStart(size, '0')
}
