# PROJECT VERDE — Autonomous Plant OS

Portfolio / technical compendium site for **Project Verde V3.0**, an ESP32-WROOM-32 autonomous
plant operating system built for the DAV ACON 5 IoT showcase.

A rebuild of the two earlier Verde sites, merged into one: the BIOS boot sequence from the main
portfolio plus the live telemetry dashboard and shell from the Tulsi Tech build — in a single
CRT/phosphor interface.

## Features

- **BIOS boot sequence** — animated POST log with bypass, runs once per visit
- **Live telemetry** — four simulated sensor streams (soil, temp, humidity, lux) with sparklines,
  a 24-hour hydration histogram and a vitality ring
- **Subsystems grid** — the six services running on the device
- **Pinout map + spec sheet** — interactive GPIO assignment diagram
- **Verde Shell** — a real interactive terminal: `help`, `status`, `sensors`, `read 34`,
  `pump on|off`, `specs`, `crew`, `neofetch`, `reboot`, `clear`. Tab-completion and ↑/↓ history.
- **Changelog timeline**, **crew cards**, **uplink/contact**
- CRT atmosphere: scanlines, flicker, sweep, vignette — all `prefers-reduced-motion` aware

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

## Editing content

Everything textual lives in [`src/data/content.ts`](src/data/content.ts) — site meta, crew bios,
sensors, subsystems, specs, timeline and the boot log. No component edits needed for copy changes.
