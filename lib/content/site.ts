/**
 * Global site content — identity, navigation, people, milestones, recognition.
 * Facts are carried over from the original Project Verde build and expanded.
 */

export const SITE = {
  name: "Project Verde",
  short: "Verde",
  version: "v4.0",
  edition: "Technical Compendium",
  tagline: "Chlorophyll meets silicon.",
  summary:
    "An autonomous, cloud-integrated regenerative ecosystem for high-density vertical farming — senses, decides, waters, diagnoses and reports without a human in the loop.",
  location: "Delhi, India",
  coordinates: { lat: "28.6139° N", lon: "77.2090° E", alt: "216 m", zone: "IST +05:30" },
  founded: "2024",
  status: "Operational — 8 nodes live",
  repo: "https://github.com/UCHIHA-MADARA-ANUJ/verde-main-portfolio",
  live: "https://verde-main-portfolio.vercel.app",
  contactEmail: "hello@projectverde.dev",
} as const;

export type NavItem = { id: string; index: string; label: string; blurb: string };

export const NAV: NavItem[] = [
  { id: "manifesto", index: "01", label: "Manifesto", blurb: "Why the system exists" },
  { id: "system", index: "02", label: "Architecture", blurb: "Every node and every edge" },
  { id: "telemetry", index: "03", label: "Telemetry", blurb: "Live pod readouts" },
  { id: "hardware", index: "04", label: "Hardware", blurb: "Bill of materials & power budget" },
  { id: "intelligence", index: "05", label: "Intelligence", blurb: "Nine autonomous behaviours" },
  { id: "firmware", index: "06", label: "Firmware", blurb: "The 1,200-line control loop" },
  { id: "specimens", index: "07", label: "Specimen DB", blurb: "Calibrated plant profiles" },
  { id: "journey", index: "08", label: "Journey", blurb: "Idea to exhibition" },
  { id: "impact", index: "09", label: "Impact", blurb: "Water, cost and uptime" },
  { id: "buildlog", index: "10", label: "Build Log", blurb: "How it was assembled" },
  { id: "recognition", index: "11", label: "Recognition", blurb: "Awards & press" },
  { id: "team", index: "12", label: "Team", blurb: "Two builders" },
  { id: "faq", index: "13", label: "Engineering FAQ", blurb: "Hard questions, answered" },
  { id: "contact", index: "14", label: "Contact", blurb: "Open the channel" },
];

export const SPEC_TICKER: string[] = [
  "ESP32-WROOM-32 / ESP8266 dual-target firmware",
  "Firebase Realtime Database sync · 25 ms round trip",
  "TensorFlow Lite on-device inference · 340 ms · 91.3% accuracy",
  "Custom KiCad PCB · LM2596 buck · opto-isolated relay",
  "NPK probe over RS485 Modbus · ±2% accuracy",
  "Twilio WhatsApp control · Hindi + English",
  "OpenWeatherMap 48-hour predictive irrigation",
  "HC-SR04 tank telemetry · alert below 15%",
  "Photoperiod control · 380–780 nm full spectrum",
  "1,200+ lines of hand-written C++",
];

export const SOCIALS = [
  { label: "GitHub", href: "https://github.com/UCHIHA-MADARA-ANUJ" },
  { label: "Live build", href: "https://verde-main-portfolio.vercel.app" },
  { label: "Email", href: "mailto:hello@projectverde.dev" },
] as const;

export type Member = {
  id: string;
  name: string;
  initials: string;
  role: string;
  node: string;
  location: string;
  status: string;
  lead: boolean;
  focus: string;
  contributions: string[];
  stack: { label: string; value: number }[];
  quote: string;
  accent: string;
};

export const TEAM: Member[] = [
  {
    id: "anuj",
    name: "Anuj Phulera",
    initials: "AP",
    role: "Project Lead · Software Architect",
    node: "NODE_01 // SOFTWARE",
    location: "Delhi, India",
    status: "Online",
    lead: true,
    focus:
      "Owns the whole software spine: the C++ control loop on the microcontroller, the Firebase contract, the browser dashboard, and the machine-vision pipeline that runs on a 4 MB flash budget.",
    contributions: [
      "1,200+ lines of C++ firmware — async Wi-Fi stack, sensor scheduler, fuzzy irrigation logic",
      "Firebase Realtime Database schema and the 25 ms telemetry round trip",
      "TensorFlow Lite disease-detection pipeline, quantised to fit the ESP32 budget",
      "Twilio WhatsApp command bot with Hindi + English intents",
      "This dashboard — Next.js, TypeScript, and every chart you are looking at",
    ],
    stack: [
      { label: "C++ / Embedded", value: 0.94 },
      { label: "TypeScript / Next.js", value: 0.9 },
      { label: "Firebase", value: 0.86 },
      { label: "TensorFlow Lite", value: 0.78 },
      { label: "Python", value: 0.74 },
    ],
    quote: "The hard part was never the code. It was making a 4 MB chip behave like a lab instrument.",
    accent: "#3fe08c",
  },
  {
    id: "aarav",
    name: "Aarav Choudhary",
    initials: "AC",
    role: "Hardware Node · PCB Design",
    node: "NODE_02 // HARDWARE",
    location: "Delhi, India",
    status: "Online",
    lead: false,
    focus:
      "Turns breadcrumbs into a board. Designed the custom PCB, the power tree that keeps the pump from resetting the microcontroller, and the sensor harness that survives a Delhi summer.",
    contributions: [
      "Custom two-layer PCB drawn in KiCad — LM2596 buck front end, opto-isolated relay driver",
      "Zero-cross detection so the 5 V pump never browns out the logic rail",
      "Sensor harness and 20 cm NPK probe assembly, waterproofed for outdoor pods",
      "Field calibration of every moisture probe against gravimetric samples",
      "Thermal management: heatsinking, fan curve, and enclosure airflow",
    ],
    stack: [
      { label: "KiCad / PCB", value: 0.92 },
      { label: "Power electronics", value: 0.88 },
      { label: "Hands-on fabrication", value: 0.95 },
      { label: "Sensor calibration", value: 0.85 },
      { label: "C++", value: 0.66 },
    ],
    quote: "A pump pulling 1.5 A will reset your MCU on the first hot day if you don't respect the ground path.",
    accent: "#5fe3d6",
  },
];

export type Award = {
  id: string;
  title: string;
  body: string;
  date: string;
  note: string;
  accent: string;
};

export const AWARDS: Award[] = [
  {
    id: "best-science",
    title: "Best Science Project",
    body: "Annual Science Exhibition 2024",
    date: "DEC 2024",
    note: "First place for the most complete IoT-integrated agricultural system. Judges singled out end-to-end autonomy and the fact that it kept working after unplugging the laptop.",
    accent: "#3fe08c",
  },
  {
    id: "innovation-engineering",
    title: "Innovation in Engineering",
    body: "Delhi STEM Fair",
    date: "NOV 2024",
    note: "Awarded for engineering design quality — a custom PCB, a firmware architecture with real fault handling, and cloud integration behaving as one machine.",
    accent: "#5fe3d6",
  },
  {
    id: "excellence-iot",
    title: "Excellence in IoT",
    body: "National Youth Tech Summit",
    date: "OCT 2024",
    note: "Recognised for combining a microcontroller, a realtime cloud database and an on-device model into a loop that closes in under a second.",
    accent: "#b98cff",
  },
  {
    id: "peoples-choice",
    title: "People's Choice Award",
    body: "Open Hardware Expo",
    date: "SEP 2024",
    note: "Visitor-voted favourite. The live WhatsApp demo — texting “पानी दो” and watching a real pump answer — did most of the campaigning.",
    accent: "#f0b45f",
  },
];

export type Milestone = {
  id: string;
  date: string;
  title: string;
  body: string;
  status: "done" | "active" | "planned";
  detail: string;
};

export const TIMELINE: Milestone[] = [
  {
    id: "conception",
    date: "JAN 2024",
    title: "Problem statement",
    body: "Manual irrigation wastes roughly 40% of the water it moves, and it fails silently — nobody notices a dry pot until the plant is already stressed.",
    status: "done",
    detail: "Field survey of 30 households + 2 terrace gardens",
  },
  {
    id: "prototype",
    date: "FEB 2024",
    title: "Breadboard proof",
    body: "ESP8266, one capacitive moisture probe, one relay, one pump. A web page you could click to water a plant. Crude, but the loop closed.",
    status: "done",
    detail: "First autonomous watering: 8 s burst at 31% moisture",
  },
  {
    id: "pcb",
    date: "MAR 2024",
    title: "PCB v1 in KiCad",
    body: "Moved off jumper wires onto a real board — LM2596 buck front end, opto-isolated relay, labelled sensor headers, mounting holes that actually line up.",
    status: "done",
    detail: "Two layers, 61 × 84 mm, hand-assembled",
  },
  {
    id: "firmware",
    date: "APR 2024",
    title: "Firmware v2.1",
    body: "The controller grew up: non-blocking sensor scheduler, fuzzy threshold logic, plant profiles, watchdog, and failure paths for every sensor that can die.",
    status: "done",
    detail: "1,200+ lines of C++, 99.97% uptime in soak test",
  },
  {
    id: "cloud",
    date: "MAY 2024",
    title: "Cloud + intelligence",
    body: "Firebase RTDB for state, OpenWeatherMap for tomorrow, Twilio for the human channel, and a quantised TFLite model looking at leaves every six hours.",
    status: "done",
    detail: "25 ms round trip · 340 ms inference",
  },
  {
    id: "exhibition",
    date: "JUN 2024",
    title: "Exhibition ready",
    body: "Kiosk mode, a printed spec sheet, a QR code to the live dashboard, and a demo that survives being poked at by three hundred schoolchildren.",
    status: "done",
    detail: "Two pods running unattended for 14 days",
  },
  {
    id: "next",
    date: "NEXT",
    title: "What comes after",
    body: "Solar front end, NB-IoT for farms without Wi-Fi, multi-pod mesh with a shared grow model, and a larger on-device classifier trained on local leaf disease.",
    status: "planned",
    detail: "Roadmap — not yet built",
  },
];

export type Faq = { id: string; q: string; a: string; tag: string };

export const FAQ: Faq[] = [
  {
    id: "wifi-drop",
    tag: "reliability",
    q: "What happens when the Wi-Fi drops?",
    a: "Nothing stops. Every decision that matters — threshold checks, relay control, light scheduling — runs locally on the microcontroller. Readings are buffered with timestamps in RAM and flushed to Firebase when the socket returns, with the last-known-good value flagged so stale data is never mistaken for a live reading.",
  },
  {
    id: "flood-guard",
    tag: "safety",
    q: "How do you stop the pump flooding a pod?",
    a: "Four independent guards: a maximum burst duration per plant profile, a minimum cooldown between bursts (the one in the firmware snippet), a soil reading re-checked after every burst, and a hardware watchdog that de-energises the relay if the control loop ever stops kicking it.",
  },
  {
    id: "capacitive-probe",
    tag: "sensing",
    q: "Why capacitive moisture and not the cheap resistive probe?",
    a: "Resistive probes pass current through the soil and corrode within weeks — the reading drifts upward exactly when the probe is failing, which is the worst possible failure mode. Capacitive probes read a dielectric field, draw almost nothing, and stay calibrated for months. We calibrate each one against gravimetric samples (dry weight vs wet weight) at install.",
  },
  {
    id: "edge-vision",
    tag: "ml",
    q: "How does a 4 MB chip run machine vision?",
    a: "It doesn't do it live. The OV2640 captures a 640×480 frame, the frame is resized and normalised, and a quantised int8 TFLite model runs inference in about 340 ms — well inside the six-hour scan interval. The camera and the model are never active at the same time as the pump, which keeps the peak current inside the buck converter's budget.",
  },
  {
    id: "power-draw",
    tag: "power",
    q: "What is the actual power draw?",
    a: "The always-on logic rail sits around 150 mA. Everything else is duty-cycled: the pump draws ~1.5 A but only during bursts, the light array runs on a photoperiod, the camera and radio wake on schedule. The Hardware panel has a live calculator — switch subsystems on and off and watch the current, runtime and running cost change.",
  },
  {
    id: "whatsapp-choice",
    tag: "humans",
    q: "Why a WhatsApp bot instead of a nicer app?",
    a: "Because the people who own plants already have WhatsApp open. Zero install, zero onboarding, works on a ₹6,000 phone, and it survives being the only app your grandmother will actually use. The bot accepts natural commands in Hindi and English and falls back to a status report if it doesn't understand the intent.",
  },
  {
    id: "scaling",
    tag: "scale",
    q: "Does this actually scale past a hobby shelf?",
    a: "The single-pod design is deliberately the smallest unit that proves the loop. Everything above it is a repeat: each pod carries its own controller and acts alone, Firebase carries the fleet state, and the dashboard aggregates. The honest limit is water plumbing and the cost of one controller per pod — which is why the roadmap puts mesh networking and NB-IoT before anything gets called a product.",
  },
  {
    id: "is-data-real",
    tag: "honesty",
    q: "Is the live data on this page real?",
    a: "It is a simulation, and it says so everywhere it appears. The real system streams to Firebase, but this site ships without your credentials — so the telemetry API generates deterministic, physically plausible readings from the same schema the pods use. Swap in your Firebase config and the same components render live hardware data unchanged.",
  },
];

export type ImpactStat = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  color: string;
  caption: string;
  trend: number[];
};

export const IMPACT: ImpactStat[] = [
  {
    label: "Plants monitored",
    value: 20,
    suffix: "+",
    color: "#3fe08c",
    caption: "Across two pods and a terrace shelf",
    trend: [5, 8, 12, 15, 18, 20, 20],
  },
  {
    label: "Water saved",
    value: 42,
    suffix: "%",
    color: "#5fe3d6",
    caption: "Versus manual watering of the same beds",
    trend: [10, 18, 25, 32, 38, 40, 42],
  },
  {
    label: "System uptime",
    value: 99.9,
    decimals: 1,
    suffix: "%",
    color: "#b98cff",
    caption: "Excluding two planned firmware flashes",
    trend: [99, 99.2, 99.5, 99.7, 99.8, 99.9, 99.9],
  },
  {
    label: "Firmware uptime",
    value: 99.97,
    decimals: 2,
    suffix: "%",
    color: "#f0b45f",
    caption: "14-day unattended soak test",
    trend: [99, 99.5, 99.8, 99.9, 99.95, 99.97, 99.97],
  },
  {
    label: "Cloud round trip",
    value: 25,
    suffix: "ms",
    color: "#3fe08c",
    caption: "Sensor write to dashboard paint",
    trend: [80, 60, 45, 35, 30, 25, 25],
  },
  {
    label: "ML inference",
    value: 340,
    suffix: "ms",
    color: "#5fe3d6",
    caption: "Quantised int8 model, on-device",
    trend: [500, 450, 400, 380, 360, 350, 340],
  },
  {
    label: "Active nodes",
    value: 8,
    suffix: "",
    color: "#b98cff",
    caption: "Sensors and actuators on the bus",
    trend: [1, 2, 4, 5, 6, 7, 8],
  },
  {
    label: "Firmware written",
    value: 1200,
    suffix: "+",
    color: "#f0b45f",
    caption: "Lines of hand-written C++",
    trend: [200, 450, 700, 900, 1050, 1150, 1200],
  },
];
