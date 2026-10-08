import { useEffect, useMemo, useRef, useState } from 'react'
import { SITE, SPECS, TEAM } from '../data/content'
import { Corners, Heading, Reveal, Section } from './ui'

type Line = { kind: 'in' | 'out' | 'err' | 'ok'; text: string }

const BANNER: Line[] = [
  { kind: 'ok', text: 'VERDE SHELL V3.0 ONLINE — SECURE THREAD ACTIVE' },
  { kind: 'out', text: "Type `help` for the command list. Tab completes, ↑/↓ recalls history." },
]

const HELP = [
  ['help', 'list available commands'],
  ['status', 'full system health report'],
  ['sensors', 'dump current sensor readings'],
  ['read <gpio>', 'raw read of a single pin'],
  ['pump <on|off>', 'manually drive the irrigation relay'],
  ['specs', 'hardware specification table'],
  ['crew', 'who built this'],
  ['uptime', 'time since last boot'],
  ['neofetch', 'system summary, with flair'],
  ['contact', 'how to reach the team'],
  ['reboot', 'soft-restart the device'],
  ['clear', 'wipe the terminal buffer'],
]

const rnd = (b: number, r: number) => (b + (Math.random() - 0.5) * r).toFixed(1)

export default function Shell() {
  const [lines, setLines] = useState<Line[]>(BANNER)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const [pump, setPump] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo(() => HELP.map(([c]) => c.split(' ')[0]), [])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const push = (...l: Line[]) => setLines((p) => [...p, ...l])

  function run(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return
    push({ kind: 'in', text: cmd })
    setHistory((h) => [cmd, ...h])
    setHIdx(-1)

    const [name, ...args] = cmd.toLowerCase().split(/\s+/)

    switch (name) {
      case 'help':
        push(
          { kind: 'ok', text: 'AVAILABLE COMMANDS' },
          ...HELP.map<Line>(([c, d]) => ({ kind: 'out', text: `  ${c.padEnd(16)}${d}` })),
        )
        break
      case 'status':
        push(
          { kind: 'ok', text: 'VERDE OS V3.0.0 — ALL SUBSYSTEMS NOMINAL' },
          { kind: 'out', text: `  wifi      connected · VERDE_MESH · rssi -51 dBm` },
          { kind: 'out', text: `  mqtt      broker ok · qos 1 · 0 dropped` },
          { kind: 'out', text: `  heap      214 KB free / 520 KB` },
          { kind: 'out', text: `  pump      ${pump ? 'RUNNING' : 'idle'} · band 38–58%` },
          { kind: 'out', text: `  wdt       armed · 0 resets` },
          { kind: 'out', text: `  ota       slot A · rollback ready` },
        )
        break
      case 'sensors':
        push(
          { kind: 'ok', text: 'SENSOR DUMP @ ' + new Date().toLocaleTimeString() },
          { kind: 'out', text: `  soil   GPIO34   ${rnd(52, 5)} %   [optimal]` },
          { kind: 'out', text: `  temp   GPIO4    ${rnd(24.5, 1)} C   [dht11 ok]` },
          { kind: 'out', text: `  hum    GPIO4    ${rnd(65, 4)} %   [nominal]` },
          { kind: 'out', text: `  lux    GPIO35   ${rnd(720, 90)} Lx  [daylight]` },
        )
        break
      case 'read': {
        const pin = args[0]?.replace(/\D/g, '')
        if (!pin) {
          push({ kind: 'err', text: 'usage: read <gpio>   e.g. read 34' })
          break
        }
        const known: Record<string, string> = {
          '34': `adc raw 2148 → 52.4 % soil`,
          '35': `adc raw 2975 → 718 Lx`,
          '4': `dht11 → 24.6 C / 65.1 %RH`,
          '26': `relay ${pump ? 'HIGH' : 'LOW'}`,
          '2': `status led ${pump ? 'BLINK' : 'HIGH'}`,
        }
        push(
          known[pin]
            ? { kind: 'out', text: `GPIO${pin}: ${known[pin]}` }
            : { kind: 'err', text: `GPIO${pin}: floating — no driver bound` },
        )
        break
      }
      case 'pump': {
        const a = args[0]
        if (a === 'on') {
          setPump(true)
          push(
            { kind: 'ok', text: 'relay HIGH → pump engaged' },
            { kind: 'out', text: 'safety: duty ceiling 12 s, auto-cut on overshoot' },
          )
        } else if (a === 'off') {
          setPump(false)
          push({ kind: 'ok', text: 'relay LOW → pump stopped' })
        } else {
          push({ kind: 'err', text: 'usage: pump <on|off>' })
        }
        break
      }
      case 'specs':
        push(...SPECS.map<Line>((s) => ({ kind: 'out', text: `  ${s.k.padEnd(10)}${s.v}` })))
        break
      case 'crew':
        push(
          ...TEAM.flatMap<Line>((t) => [
            { kind: 'ok', text: `${t.name} — ${t.role}` },
            { kind: 'out', text: `  ${t.bio}` },
            { kind: 'out', text: `  stack: ${t.skills.join(', ')}` },
          ]),
        )
        break
      case 'uptime':
        push({ kind: 'out', text: 'up 41 days, 06:14:33 · 0 panics · load avg 0.21' })
        break
      case 'neofetch':
        push(
          { kind: 'ok', text: '    ,@@@.      verde@wroom-32' },
          { kind: 'out', text: "   @@@@@@@     ---------------" },
          { kind: 'out', text: `  '@@@@@@@'    os      Verde OS ${SITE.version}` },
          { kind: 'out', text: '    \\|/        kernel  FreeRTOS 10.4.3' },
          { kind: 'out', text: '     |         mcu     ESP32-WROOM-32 @160MHz' },
          { kind: 'out', text: '   __|__       memory  306K / 520K' },
          { kind: 'out', text: '  \\_____/      shell   verde-sh 3.0' },
        )
        break
      case 'contact':
        push(
          { kind: 'ok', text: 'UPLINK CHANNELS' },
          { kind: 'out', text: `  mail    ${SITE.email}` },
          { kind: 'out', text: `  repo    ${SITE.github}` },
        )
        break
      case 'reboot':
        push({ kind: 'err', text: 'rebooting…' })
        setTimeout(() => setLines(BANNER), 900)
        break
      case 'clear':
        setLines([])
        break
      case 'sudo':
        push({ kind: 'err', text: 'verde: nice try. this plant answers to no one.' })
        break
      default:
        push({ kind: 'err', text: `verde: command not found: ${name} — try \`help\`` })
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.min(history.length - 1, hIdx + 1)
      if (n >= 0) {
        setHIdx(n)
        setInput(history[n])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = hIdx - 1
      setHIdx(n)
      setInput(n >= 0 ? history[n] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const m = commands.find((c) => c.startsWith(input.trim().toLowerCase()))
      if (m) setInput(m)
    }
  }

  const color = (k: Line['kind']) =>
    k === 'in' ? 'text-[#e7fff5]' : k === 'err' ? 'text-rose' : k === 'ok' ? 'text-phos' : 'text-[#8fb3a6]'

  return (
    <Section id="shell">
      <Heading
        index="[ 04 / SHELL ]"
        title="Talk to the device"
        sub="This is the same command interpreter that runs over UART on the board, reimplemented in the browser. Drive the pump, read a pin, dump the config — it all responds."
      />

      <Reveal>
        <div className="relative border border-line bg-[#05090b] box-glow" onClick={() => inputRef.current?.focus()}>
          <Corners />
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-phos/80" />
              <span className="ml-3 text-[10px] tracking-[0.25em] text-[#6d8f84]">
                verde@wroom-32: ~/sys
              </span>
            </div>
            <span
              className={`text-[10px] tracking-[0.2em] ${pump ? 'text-amber' : 'text-phos-dim'}`}
            >
              {pump ? '◉ PUMP RUNNING' : '◎ PUMP IDLE'}
            </span>
          </div>

          <div
            ref={bodyRef}
            className="h-[380px] overflow-y-auto px-4 py-4 text-[11.5px] leading-[1.75] sm:text-[12.5px]"
          >
            {lines.map((l, i) => (
              <div key={i} className={`whitespace-pre-wrap ${color(l.kind)}`}>
                {l.kind === 'in' ? <span className="text-phos">verde ▸ </span> : null}
                {l.text}
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-phos">verde ▸</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoComplete="off"
                aria-label="terminal input"
                className="flex-1 bg-transparent text-[#e7fff5] caret-transparent outline-none"
              />
              <span className="caret -ml-2 inline-block h-4 w-2 bg-phos" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
            {['status', 'sensors', 'pump on', 'read 34', 'neofetch', 'crew', 'clear'].map((c) => (
              <button
                key={c}
                onClick={() => run(c)}
                className="cursor-pointer border border-line px-3 py-1.5 text-[10px] tracking-[0.15em] text-[#8fb3a6] transition hover:border-phos/50 hover:text-phos"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
