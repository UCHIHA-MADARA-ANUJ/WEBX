import { SPECS } from '../data/content'
import { Corners, Heading, Reveal, Section } from './ui'

const PINS_LEFT = [
  ['3V3', 'rail'],
  ['GND', 'rail'],
  ['GPIO 34', 'soil adc'],
  ['GPIO 35', 'ldr adc'],
  ['GPIO 4', 'dht11'],
  ['GPIO 26', 'pump relay'],
]

const PINS_RIGHT = [
  ['VIN', '5V in'],
  ['GPIO 2', 'status led'],
  ['GPIO 16', 'uart rx'],
  ['GPIO 17', 'uart tx'],
  ['GPIO 21', 'i2c sda'],
  ['GPIO 22', 'i2c scl'],
]

export default function Hardware() {
  return (
    <Section id="hardware">
      <Heading
        index="[ 03 / HARDWARE ]"
        title="The board, pin by pin"
        sub="One ESP32-WROOM-32, three sensors, one relay-driven pump. No cloud dependency — the device is fully autonomous if the network disappears."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <div className="relative h-full border border-line bg-panel/70 p-6">
            <Corners />
            <div className="text-[10px] tracking-[0.3em] text-phos-dim">PINOUT MAP</div>

            <div className="mt-8 flex items-stretch justify-center gap-3 sm:gap-6">
              <ul className="flex flex-1 flex-col justify-between gap-2 text-right">
                {PINS_LEFT.map(([p, d]) => (
                  <li key={p} className="group flex items-center justify-end gap-2">
                    <span className="text-[10px] text-[#5c7a71] group-hover:text-phos/70">{d}</span>
                    <span className="text-[11px] text-[#cfe6dd] group-hover:text-phos">{p}</span>
                    <span className="h-px w-5 bg-line group-hover:bg-phos" />
                    <span className="h-2 w-2 rounded-full border border-phos/50 group-hover:bg-phos" />
                  </li>
                ))}
              </ul>

              <div className="relative grid w-28 shrink-0 place-items-center border border-phos/30 bg-void sm:w-36">
                <div className="absolute inset-x-3 top-3 h-10 border border-line bg-ink" />
                <div className="rotate-90 whitespace-nowrap text-[10px] tracking-[0.3em] text-phos/80">
                  WROOM-32
                </div>
                <div className="absolute bottom-3 left-1/2 h-6 w-10 -translate-x-1/2 border border-line" />
                <span className="pulse-ring absolute inset-0 border border-phos/25" />
              </div>

              <ul className="flex flex-1 flex-col justify-between gap-2">
                {PINS_RIGHT.map(([p, d]) => (
                  <li key={p} className="group flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full border border-phos/50 group-hover:bg-phos" />
                    <span className="h-px w-5 bg-line group-hover:bg-phos" />
                    <span className="text-[11px] text-[#cfe6dd] group-hover:text-phos">{p}</span>
                    <span className="text-[10px] text-[#5c7a71] group-hover:text-phos/70">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-8 text-[11px] leading-relaxed text-[#6d8f84]">
              Sensor rails are isolated from the pump rail; the relay is opto-coupled so motor
              kickback never reaches the ADC inputs.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative h-full border border-line bg-panel/70">
            <Corners />
            <div className="border-b border-line px-6 py-3 text-[10px] tracking-[0.3em] text-phos-dim">
              SYSTEM SPECIFICATION
            </div>
            <dl className="divide-y divide-line">
              {SPECS.map((s) => (
                <div
                  key={s.k}
                  className="group flex items-center justify-between gap-4 px-6 py-[13px] transition-colors hover:bg-ink"
                >
                  <dt className="text-[11px] tracking-[0.18em] text-[#6d8f84]">{s.k.toUpperCase()}</dt>
                  <dd className="text-right text-[12px] text-[#cfe6dd] group-hover:text-phos">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
