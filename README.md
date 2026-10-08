# 🌿 Project Verde — Technical Compendium

> **Chlorophyll meets silicon.**
> An interactive engineering document for an autonomous, cloud-integrated vertical-farming ecosystem — sensing, deciding, watering, diagnosing and reporting without a human in the loop.

This repository is the **v4 rebuild** of the Project Verde site: same system, same numbers, entirely re-architected interface. It is the successor to [`verde-main-portfolio`](https://github.com/UCHIHA-MADARA-ANUJ/verde-main-portfolio).

---

## What this is

| | |
| --- | --- |
| **Type** | Single-page technical compendium · dark "instrument" aesthetic |
| **Stack** | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion · Three.js |
| **Deploy** | Vercel-ready — zero configuration required |
| **Data** | Deterministic telemetry simulation, labelled as such everywhere it appears |

### The system it documents

A closed-loop pod that measures soil moisture, air temperature and humidity, reservoir level, ambient light, rainfall, NPK and leaf imagery — then decides locally whether to water, when to run the grow light array, and when to raise an alarm.

- **ESP32-WROOM-32 / ESP8266** dual-target firmware, 1,200+ lines of hand-written C++
- **Firebase Realtime Database** for state, with an offline write queue
- **TensorFlow Lite** int8 disease classifier — 14 classes, ~340 ms on-device inference
- **Twilio WhatsApp** control channel, Hindi + English intents
- **OpenWeatherMap** 48-hour predictive irrigation
- **Custom KiCad PCB** — LM2596 buck front end, opto-isolated relay, star ground

**The load-bearing architectural claim:** the cloud is *outside* the control path. Actuation is local, observability is remote. Pull the router and the plants still get watered — you just stop seeing it.

---

## Highlights of this build

### Ten interactive pieces, all real

| # | Piece | What it actually does |
| --- | --- | --- |
| 01 | **Architecture map** | 16 blocks / 17 links in SVG. Signal-class legend toggles, live `animateMotion` packet flow, routed cable dressing (no intersecting diagonals), click any block for its spec. |
| 02 | **Telemetry console** | Multi-pod grid with band meters, sparklines, a crosshair history chart (1 h / 24 h / 7 d) and a streaming event log. Severity-aware terminal colouring. |
| 03 | **Power budget calculator** | Duty-cycled current maths. Switch subsystems on and off, set battery capacity and tariff — current, runtime, energy and ₹/day recompute live. |
| 04 | **PCB stack explorer** | Five CSS-3D layers (component side, top copper, ground pour, silkscreen, FR-4) with real per-layer artwork. |
| 05 | **Leaf diagnostics lab** | Canvas-drawn specimen plates **or your own photo**, analysed in-browser: chlorophyll index, chlorosis load, necrotic area, surface texture and edge density → four-class verdict with treatment advice. |
| 06 | **Code viewer** | Hand-written C++/TS/TSX tokeniser (no highlighting dependency), sticky line numbers, copy-to-clipboard. |
| 07 | **Specimen database** | Twelve calibrated plant profiles with search, category filters and per-specimen dossiers. Assign a specimen to a pod and it appears as a live pod in the telemetry console above. |
| 08 | **Water-saving calculator** | Baseline from the household survey, Verde figure from the pod's own dispense log — adjust plants, pot volume and period and the comparison recomputes. |
| 09 | **3D grow tower** | React Three Fiber scene (instanced trays, additive light column, travelling scan ring) layered over a hand-built SVG schematic. Falls back to the SVG alone below the high tier. |
| 10 | **Command palette** | `⌘K` / `Ctrl-K` navigation, spec download, calm-mode toggle, contact actions. Full arrow-key/enter/escape support. |

### Engineering decisions worth reading

- **Perf-tiered rendering.** A capability probe (cores, device memory, `saveData`, network type, viewport) drives a `high | medium | low` tier. WebGL never mounts below `high`; particle counts scale; the SVG poster always remains.
- **Calm mode.** A user-controlled, persisted switch that disables smooth scrolling, particles, scanlines, grain and all ambient animation — independent of `prefers-reduced-motion`, which is respected separately throughout.
- **Deterministic simulation.** Every chart, sparkline and readout is generated from a seeded PRNG (`mulberry32`) keyed to the data's identity, so nothing flickers between renders, and values move on a rolling window rather than randomising per paint.
- **Hydration safety.** Anything derived from `new Date()` is gated behind a `useMounted()` hook, because the HTML is prerendered at build time and a clock-dependent value would hydrate differently in the browser.
- **Live scroll-spy.** IntersectionObserver with a mid-viewport band drives the nav indicator, the side rail and the progress readout without scroll listeners.
- **Self-hosted type.** Space Grotesk, Instrument Serif, Geist Sans and Geist Mono load from `node_modules` — the build never contacts Google Fonts.
- **Honest copy.** The three concept renders in the build log are labelled as renders; the telemetry is labelled as simulated and says why. Nothing on the page claims to be a measurement it isn't.

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server on `0.0.0.0:3000` |
| `npm run dev:turbo` | Same, with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |

Requires **Node 20+**.

---

## Project structure

```
app/
├── api/
│   ├── telemetry/route.ts     # pod snapshot feed (schema-compatible with Firebase)
│   ├── spec/route.ts          # generates the full markdown technical sheet
│   ├── contact/route.ts       # validated contact handler + optional Resend delivery
│   └── health/route.ts        # liveness probe
├── layout.tsx                 # fonts, metadata, viewport
├── page.tsx                   # composition root + ambient effects + ⌘K wiring
├── not-found.tsx
└── globals.css                # the entire design system (tokens → components)

components/
├── chrome/                    # Backdrop, NavBar, BootOverlay, CommandPalette,
│                              # ScrollProgress, SectionRail, CustomCursor, Footer
├── sections/                  # 14 page sections, one file each
├── ui/                        # Panel, Section, Reveal, Charts, Sparkline, Gauge,
│                              # Segmented, Switch, Slider, Accordion, CodeBlock,
│                              # Terminal, Marquee, Scramble, Counter, Buttons
└── visual/                    # SystemMap, GrowTower (R3F), TowerSVG, PCBStack,
                               # LeafLab, PlantGlyph, ParticleField

lib/
├── content/                   # site, system, hardware, plants, firmware (all typed)
├── telemetry.ts               # simulation model + history builders
├── fonts.ts                   # self-hosted font wiring
└── utils.ts                   # PRNG, formatting, helpers

hooks/                         # performance tier, media queries, scroll spy,
                               # telemetry feed, count-up, mounted gate
```

---

## API

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/telemetry?pods=tulsi,tomato,mint` | `GET` | Pod snapshots, fleet summary and event feed (max 4 pods) |
| `/api/spec` | `GET` | Downloads the generated markdown technical sheet (~20 KB) |
| `/api/contact` | `POST` | Validated `{ name, email, intent, message }` |
| `/api/health` | `GET` | Liveness + version |

### Going live with real hardware

The read path is deliberately shaped like the Firebase subtree. To serve real data:

1. Set `VERDE_FIREBASE_URL` (and credentials) in the environment.
2. Replace the `snapshotForPods()` call in `app/api/telemetry/route.ts` with a database read.
3. Nothing in `components/` changes — the payload contract is identical.

Contact delivery uses Resend when configured:

```
RESEND_API_KEY=...
CONTACT_FROM=verde@yourdomain.com
CONTACT_TO=you@yourdomain.com
```

Without a provider the endpoint still validates and logs the message, and returns a receipt that says plainly that nothing was emailed.

---

## Accessibility

- Skip-to-content link, focus-visible rings, and full keyboard operability (palette, tabs, accordion, sliders, switches).
- `prefers-reduced-motion` honoured throughout; calm mode adds a user-controlled layer on top.
- Semantic landmarks, `aria-live` regions on streaming output, labelled form fields, `role="tab"`/`aria-selected` on segmented controls, `role="switch"` on toggles.
- Charts carry text summaries; decorative SVG is `aria-hidden`.

---

## Deploying

Push to a Git host and import the repo on Vercel. Framework detection, build command and output are all standard — no environment variables are required for the site to work.

---

## Team

| Name | Role |
| --- | --- |
| **Anuj Phulera** | Project lead · software architect — firmware, cloud, dashboard, vision pipeline |
| **Aarav Choudhary** | Hardware node · PCB design — power tree, relay isolation, sensor calibration |

---

## Credits

Built with Next.js, React, TypeScript, Tailwind CSS, Motion, Three.js / React Three Fiber, Lenis and lucide-react.
Type: Space Grotesk, Instrument Serif (Fontsource) and Geist — all self-hosted.

<p align="center">
  <strong>🌿 Project Verde — where biology meets engineering.</strong><br />
  <sub>Chlorophyll meets silicon.</sub>
</p>
