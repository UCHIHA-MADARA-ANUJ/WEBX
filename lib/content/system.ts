/**
 * System architecture, autonomous capabilities and operating modes.
 *
 * Architectural claim worth knowing while reading the map: the cloud is
 * deliberately OUT of the control path. Actuation is local, observability is
 * remote — a dropped Wi-Fi link degrades reporting, never watering.
 */

export type NodeKind = "sense" | "edge" | "actuate" | "cloud" | "human";

export type ArchNode = {
  id: string;
  title: string;
  code: string;
  kind: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  summary: string;
  specs: string[];
  metric: { label: string; value: string };
  accent: string;
};

export const ARCH_VIEWBOX = { w: 1420, h: 760 };

export const ARCH_NODES: ArchNode[] = [
  // ── sensing column ───────────────────────────────────────────────────────
  {
    id: "soil",
    title: "Soil moisture probe",
    code: "ADC · GPIO34",
    kind: "sense",
    x: 40,
    y: 62,
    w: 196,
    h: 74,
    summary:
      "Capacitive probe read on the ADC. Calibrated against gravimetric samples at install so the percentage means something real.",
    specs: ["Capacitive, corrosion-free", "Per-plant dry/field capacity", "Filtered over 8 samples", "Read every 90 s"],
    metric: { label: "accuracy", value: "±2.4%" },
    accent: "#3fe08c",
  },
  {
    id: "climate",
    title: "Air temp + humidity",
    code: "DHT22 · GPIO4",
    kind: "sense",
    x: 40,
    y: 156,
    w: 196,
    h: 74,
    summary: "Ambient pair used for vapour-pressure deficit, a far better stress signal than humidity alone.",
    specs: ["−40 to 80 °C", "±0.5 °C / ±2% RH", "1 Hz sampling", "1-wire protocol"],
    metric: { label: "interval", value: "1 s" },
    accent: "#5fe3d6",
  },
  {
    id: "tank",
    title: "Water tank level",
    code: "HC-SR04 · 40 kHz",
    kind: "sense",
    x: 40,
    y: 250,
    w: 196,
    h: 74,
    summary: "Ultrasonic time-of-flight down the reservoir. Median-of-five keeps the fan and pump noise out of the reading.",
    specs: ["2–400 cm range", "±3 mm precision", "Median of 5 pings", "Alert below 15%"],
    metric: { label: "range", value: "400 cm" },
    accent: "#b98cff",
  },
  {
    id: "light",
    title: "Ambient light",
    code: "LDR · ADC1_CH7",
    kind: "sense",
    x: 40,
    y: 344,
    w: 196,
    h: 74,
    summary: "Decides when the photoperiod starts and ends, so the grow array follows real daylight instead of a fixed clock.",
    specs: ["380–780 nm response", "Logarithmic lux estimate", "Threshold 200 lx", "Drives photoperiod"],
    metric: { label: "lux gate", value: "200 lx" },
    accent: "#f0b45f",
  },
  {
    id: "rain",
    title: "Rain detector",
    code: "Digital · GPIO27",
    kind: "sense",
    x: 40,
    y: 438,
    w: 196,
    h: 74,
    summary: "Monsoon guard. A confirmed event suspends every irrigation schedule and auto-resumes when the plate dries.",
    specs: ["0.5 mm trigger", "Debounced 30 s", "Suspends all schedules", "Auto-resume on dry"],
    metric: { label: "impact", value: "−31% runoff" },
    accent: "#5fe3d6",
  },
  {
    id: "npk",
    title: "NPK soil probe",
    code: "RS485 Modbus",
    kind: "sense",
    x: 40,
    y: 532,
    w: 196,
    h: 74,
    summary: "Three macronutrients over a differential bus. Cross-referenced against the active plant profile before any advice is shown.",
    specs: ["9600 baud, half duplex", "±2% accuracy", "20 cm probe depth", "Polled every 15 min"],
    metric: { label: "accuracy", value: "±2%" },
    accent: "#b98cff",
  },
  {
    id: "vision",
    title: "Leaf camera",
    code: "OV2640 · SCCB",
    kind: "sense",
    x: 40,
    y: 626,
    w: 196,
    h: 74,
    summary: "Two megapixels pointed at one leaf. Frames are normalised and handed to an int8 model — never live video, always a still.",
    specs: ["UXGA 2 MP", "Frame every 6 h", "Captured with pump off", "Feeds TFLite pipeline"],
    metric: { label: "classes", value: "14" },
    accent: "#e8663f",
  },

  // ── edge node ────────────────────────────────────────────────────────────
  {
    id: "edge",
    title: "Verde Edge Core",
    code: "ESP32-WROOM-32 · 240 MHz",
    kind: "edge",
    x: 320,
    y: 296,
    w: 236,
    h: 168,
    summary:
      "The whole brain, and it acts alone. Non-blocking scheduler, fuzzy threshold logic, plant profiles, watchdog, and the model runtime — all inside 4 MB of flash.",
    specs: [
      "Fuzzy moisture decision per profile",
      "Control loop never blocks on the network",
      "Buffers readings when offline",
      "Hardware watchdog on the relay rail",
    ],
    metric: { label: "loop", value: "90 s" },
    accent: "#3fe08c",
  },

  // ── actuation column ─────────────────────────────────────────────────────
  {
    id: "pump",
    title: "Diaphragm pump",
    code: "Relay K1 · opto-isolated",
    kind: "actuate",
    x: 640,
    y: 176,
    w: 210,
    h: 82,
    summary: "5 V diaphragm pump behind an opto-isolated relay, with zero-cross switching so the 1.5 A inrush never touches the logic rail.",
    specs: ["5 V DC / 1.5 A", "2.4 L/min", "Max burst 20 s", "Cooldown enforced in firmware"],
    metric: { label: "burst", value: "8.0 s" },
    accent: "#3fe08c",
  },
  {
    id: "lights",
    title: "Grow light array",
    code: "MOSFET PWM · 12× LED",
    kind: "actuate",
    x: 640,
    y: 340,
    w: 210,
    h: 82,
    summary: "Full-spectrum array switched by a logic-level MOSFET. Duties are set by growth stage, not by a wall timer.",
    specs: ["380–780 nm", "12 LED modules", "PWM dimming", "Photoperiod from LDR"],
    metric: { label: "photoperiod", value: "12 h" },
    accent: "#f0b45f",
  },
  {
    id: "alert",
    title: "Local annunciator",
    code: "Buzzer + status LED",
    kind: "actuate",
    x: 640,
    y: 504,
    w: 210,
    h: 82,
    summary: "The only output that assumes a human is standing in front of the pod. Distinct tones for low tank, dry soil and sensor fault.",
    specs: ["3 distinct tones", "Fault latching", "Silenced from the dashboard", "Works fully offline"],
    metric: { label: "patterns", value: "3" },
    accent: "#e8663f",
  },

  // ── cloud column ─────────────────────────────────────────────────────────
  {
    id: "firebase",
    title: "Firebase RTDB",
    code: "pods/{id}/telemetry",
    kind: "cloud",
    x: 950,
    y: 176,
    w: 220,
    h: 82,
    summary: "Single source of truth for last-known state. Writes are timestamped so the browser can always tell fresh data from a stale mirror.",
    specs: ["REST + streaming", "25 ms round trip", "Offline write queue", "Per-pod subtrees"],
    metric: { label: "latency", value: "25 ms" },
    accent: "#3fe08c",
  },
  {
    id: "weather",
    title: "Weather forecast",
    code: "OpenWeatherMap · 48 h",
    kind: "cloud",
    x: 950,
    y: 340,
    w: 220,
    h: 82,
    summary: "Tomorrow's maximum temperature is pulled every morning. Above 38 °C the pod pre-irrigates at 22:00 — before the plant is stressed, not after.",
    specs: ["48-hour horizon", "Threshold 38 °C", "Pre-irrigation at 22:00", "Skipped if rain forecast"],
    metric: { label: "lookahead", value: "48 h" },
    accent: "#5fe3d6",
  },
  {
    id: "twilio",
    title: "Twilio channel",
    code: "WhatsApp Business API",
    kind: "cloud",
    x: 950,
    y: 504,
    w: 220,
    h: 82,
    summary: "The human interface for people who will never install an app. Commands in Hindi or English, answers in both.",
    specs: ["Inbound webhook", "Hindi + English intents", "1.2 s median reply", "Status on demand"],
    metric: { label: "reply", value: "1.2 s" },
    accent: "#b98cff",
  },

  // ── human column ─────────────────────────────────────────────────────────
  {
    id: "dashboard",
    title: "This dashboard",
    code: "Next.js · Vercel edge",
    kind: "human",
    x: 1220,
    y: 176,
    w: 168,
    h: 82,
    summary: "Reads the same subtree the pods write to. Charts, history and manual override — one tap to take the wheel, one tap to hand it back.",
    specs: ["Live charts", "Manual override", "History scrubbing", "Works on a phone"],
    metric: { label: "views", value: "4" },
    accent: "#5fe3d6",
  },
  {
    id: "operator",
    title: "Remote operator",
    code: "Anyone with a phone",
    kind: "human",
    x: 1220,
    y: 504,
    w: 168,
    h: 82,
    summary: "Texts the pod from another city and gets a status report back. Not a demo gimmick — it is how the system was actually used during the exhibition.",
    specs: ["Zero install", "Works on 2G", "Hindi + English", "Audit trail of commands"],
    metric: { label: "command", value: "1.2 s" },
    accent: "#f0b45f",
  },
];

export type EdgeRoute = "auto" | "top" | "bottom" | "right";

export type ArchEdge = {
  from: string;
  to: string;
  kind: "sense" | "control" | "uplink" | "command";
  label?: string;
  /** How the cable is dressed on the diagram. */
  route?: EdgeRoute;
  /** Corridor coordinate for routed cables. */
  offset?: number;
};

export const ARCH_EDGES: ArchEdge[] = [
  { from: "soil", to: "edge", kind: "sense" },
  { from: "climate", to: "edge", kind: "sense" },
  { from: "tank", to: "edge", kind: "sense" },
  { from: "light", to: "edge", kind: "sense" },
  { from: "rain", to: "edge", kind: "sense" },
  { from: "npk", to: "edge", kind: "sense" },
  { from: "vision", to: "edge", kind: "sense" },
  { from: "edge", to: "pump", kind: "control", label: "RELAY_K1" },
  { from: "edge", to: "lights", kind: "control", label: "PWM" },
  { from: "edge", to: "alert", kind: "control", label: "GPIO" },
  { from: "edge", to: "firebase", kind: "uplink", label: "telemetry" },
  { from: "weather", to: "edge", kind: "command", label: "forecast", route: "top", offset: 116 },
  { from: "firebase", to: "dashboard", kind: "uplink", label: "stream" },
  { from: "dashboard", to: "edge", kind: "command", label: "override", route: "bottom", offset: 696 },
  { from: "twilio", to: "edge", kind: "command", label: "command", route: "bottom", offset: 728 },
  { from: "operator", to: "twilio", kind: "command", label: "inbound" },
  { from: "firebase", to: "twilio", kind: "uplink", label: "notify", route: "right", offset: 1200 },
];

export const EDGE_LEGEND = [
  { kind: "sense" as const, label: "Sensor input", color: "#3fe08c", dash: "0" },
  { kind: "control" as const, label: "Local control", color: "#3fe08c", dash: "0" },
  { kind: "uplink" as const, label: "Cloud uplink", color: "#5fe3d6", dash: "6 6" },
  { kind: "command" as const, label: "Inbound command", color: "#b98cff", dash: "2 6" },
];

export type Capability = {
  id: string;
  icon: string;
  title: string;
  body: string;
  detail: string;
  metric: string;
  unit: string;
  accent: string;
  trend: number[];
};

export const CAPABILITIES: Capability[] = [
  {
    id: "disease",
    icon: "eye",
    title: "Disease detection",
    body: "A frame every six hours goes through a quantised model that flags 14 disease classes before the symptoms are visible to a person walking past.",
    detail: "OV2640 → normalise → int8 TFLite",
    metric: "91.3",
    unit: "% accuracy",
    accent: "#3fe08c",
    trend: [82, 85, 88, 90, 91, 91, 92, 91],
  },
  {
    id: "irrigation",
    icon: "cloud-sun",
    title: "Predictive irrigation",
    body: "Tomorrow's forecast decides tonight's watering. Above 38 °C the pod pre-irrigates at 22:00 — proactive instead of reactive.",
    detail: "OpenWeatherMap · 48 h horizon",
    metric: "38",
    unit: "°C trigger",
    accent: "#5fe3d6",
    trend: [30, 35, 42, 38, 45, 40, 38, 43],
  },
  {
    id: "whatsapp",
    icon: "message",
    title: "WhatsApp control",
    body: "Text “पानी दो” and a pump in Delhi starts. Natural commands in Hindi and English, with a status report if the intent is unclear.",
    detail: "Twilio API · median 1.2 s reply",
    metric: "1.2",
    unit: "s reply",
    accent: "#b98cff",
    trend: [10, 15, 20, 25, 30, 28, 32, 35],
  },
  {
    id: "npk",
    icon: "flask",
    title: "Soil chemistry",
    body: "Nitrogen, phosphorus and potassium over RS485, cross-referenced against the active plant profile before any advice is shown.",
    detail: "RS485 Modbus · ±2%",
    metric: "3",
    unit: "macronutrients",
    accent: "#f0b45f",
    trend: [40, 42, 45, 43, 47, 48, 46, 50],
  },
  {
    id: "tank",
    icon: "droplet",
    title: "Reservoir watch",
    body: "Ultrasonic level sensing with a hard alert below 15%. Irrigation is refused rather than run dry, because a dry pump burns out silently.",
    detail: "HC-SR04 · ±3 mm",
    metric: "15",
    unit: "% floor",
    accent: "#3fe08c",
    trend: [85, 82, 78, 75, 72, 68, 65, 60],
  },
  {
    id: "rain",
    icon: "cloud-rain",
    title: "Monsoon guard",
    body: "A confirmed rain event suspends every schedule. On a Delhi terrace this single behaviour removed about a third of the runoff.",
    detail: "0.5 mm trigger · debounced 30 s",
    metric: "31",
    unit: "% less runoff",
    accent: "#5fe3d6",
    trend: [0, 0, 2, 5, 12, 8, 3, 0],
  },
  {
    id: "stages",
    icon: "sprout",
    title: "Growth-stage logic",
    body: "Seedling, vegetative, flowering and fruiting each get their own thresholds. The same pot is watered differently in week 1 and week 9.",
    detail: "Seedling → Vegetative → Flowering → Fruiting",
    metric: "4",
    unit: "stages",
    accent: "#b98cff",
    trend: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: "photoperiod",
    icon: "sun",
    title: "Photoperiod control",
    body: "The grow array follows real daylight instead of a fixed timer, and shifts spectrum emphasis as the plant moves toward flowering.",
    detail: "380–780 nm · LDR-gated",
    metric: "12",
    unit: "h photoperiod",
    accent: "#f0b45f",
    trend: [0, 0, 150, 400, 800, 400, 150, 0],
  },
  {
    id: "cost",
    icon: "chart",
    title: "Water & cost analytics",
    body: "Every litre dispensed is logged and costed in rupees. The savings number on this page comes from those logs, not from an estimate.",
    detail: "Litres + ₹ · rolling 30 days",
    metric: "42",
    unit: "% saved",
    accent: "#3fe08c",
    trend: [100, 95, 88, 82, 75, 68, 62, 58],
  },
];

export type Mode = {
  id: "auto" | "manual";
  label: string;
  icon: string;
  headline: string;
  body: string;
  features: string[];
  metrics: { label: string; value: string }[];
};

export const MODES: Mode[] = [
  {
    id: "auto",
    label: "Autonomous",
    icon: "brain",
    headline: "The pod decides.",
    body: "Default state. Thresholds come from the plant profile, the forecast comes from the cloud, and the loop closes locally in under a second. Nothing waits for a human.",
    features: [
      "Per-plant moisture thresholds",
      "Weather-driven pre-irrigation",
      "Six-hourly disease scan",
      "Growth-stage-aware adjustments",
      "Automatic photoperiod scheduling",
      "NPK-informed fertiliser advice",
      "Refuses to run the pump dry",
    ],
    metrics: [
      { label: "Human interventions / week", value: "0" },
      { label: "Decision latency", value: "0.9 s" },
      { label: "Water vs manual", value: "−42%" },
    ],
  },
  {
    id: "manual",
    label: "Manual",
    icon: "hand",
    headline: "You decide.",
    body: "One tap takes the wheel and hands it back. Useful for repotting, for showing a judge what the pump actually does, and for the day a sensor lies.",
    features: [
      "One-tap remote pump control",
      "Live sensor readout while you act",
      "WhatsApp command interface",
      "Manual light override",
      "Editable thresholds per pod",
      "Push alerts on every fault",
      "Automatic return to autonomous",
    ],
    metrics: [
      { label: "Time to override", value: "0.4 s" },
      { label: "Auto-return after", value: "30 min" },
      { label: "Audit trail", value: "Every command" },
    ],
  },
];

export type CycleStep = {
  id: string;
  time: string;
  title: string;
  body: string;
  log: string[];
  accent: string;
};

export const CYCLE: CycleStep[] = [
  {
    id: "boot",
    time: "06:00:00",
    title: "Cold boot",
    body: "The controller powers up, mounts flash preferences, rejoins Wi-Fi and loads the Tulsi profile. If the network is missing it carries on regardless — this is the point of the design.",
    log: [
      "> BOOT: kernel v4.0 initialized, 240 MHz",
      "> FLASH: preferences mounted, 4 profiles loaded",
      "> NET: Wi-Fi join OK, RSSI −42 dBm",
      "> PROFILE: tulsi — moistureMin 65%, burst 8000 ms",
      "> STATE: READY",
    ],
    accent: "#3fe08c",
  },
  {
    id: "poll",
    time: "06:05:00",
    title: "Sensor sweep",
    body: "The scheduler walks every sensor without blocking on any of them. Moisture reads 31%, which is 34 points below the profile floor.",
    log: [
      "> SENS: moisture=31% threshold=65% → DEFICIT",
      "> SENS: temp=24.2C rh=61% vpd=1.02kPa",
      "> TANK: 78% — sufficient",
      "> CAM: capture 640x480, pump rail idle",
    ],
    accent: "#5fe3d6",
  },
  {
    id: "decide",
    time: "06:05:03",
    title: "Decision",
    body: "Fuzzy logic confirms the deficit, checks the cooldown window, checks the tank, and commits. The relay closes on the next zero crossing.",
    log: [
      "> AI: deficit confirmed, cooldown 4h 12m > min",
      "> LOG: TRIGGER_PUMP",
      "> RELAY: K1 → LOW (energised)",
      "> PUMP: target burst 8000 ms",
    ],
    accent: "#b98cff",
  },
  {
    id: "verify",
    time: "06:05:11",
    title: "Verify and stop",
    body: "Moisture is re-read after the burst. It comes back at 71% — inside the band — so the relay opens and the event is stamped.",
    log: [
      "> SENS: moisture=71% → NOMINAL",
      "> RELAY: K1 → HIGH (de-energised)",
      "> LOG: TARGET_REACHED in 8.0 s",
      "> AI: next check scheduled +90 s",
    ],
    accent: "#3fe08c",
  },
  {
    id: "sync",
    time: "06:05:12",
    title: "Telemeter",
    body: "One small JSON patch leaves the pod. The dashboard paints the new value before the next sensor reading is taken.",
    log: [
      "> CLOUD: PATCH /pods/tulsi/telemetry",
      "> JSON: {moisture:71,temp:24.2,tank:78,uv:off}",
      "> RTT: 25 ms",
      "> SYNC: OK, offline queue empty",
    ],
    accent: "#5fe3d6",
  },
  {
    id: "forecast",
    time: "08:00:00",
    title: "Read tomorrow",
    body: "The morning forecast says 43 °C. That exceeds the pre-irrigation threshold, so the pod books itself a watering at 22:00 tonight.",
    log: [
      "> WEATHER: Delhi tomorrow max 43.0C",
      "> AI: threshold 38.0C exceeded",
      "> SCHEDULE: pre-irrigation 22:00, +18% volume",
      "> NOTE: skipped automatically if rain detected",
    ],
    accent: "#b98cff",
  },
  {
    id: "photoperiod",
    time: "18:30:00",
    title: "Photoperiod",
    body: "Ambient light falls under the gate. The grow array ramps up and the spectrum emphasis shifts toward flowering.",
    log: [
      "> LDR: 187 lux < 200 gate",
      "> UV: array ON, 12 modules, 68% duty",
      "> SPECTRUM: 380–780 nm balanced",
      "> TIMER: 4 h remaining in photoperiod",
    ],
    accent: "#f0b45f",
  },
  {
    id: "human",
    time: "REMOTE",
    title: "A human asks",
    body: "Someone in another city texts the pod. The bot answers with the state of everything and confirms whether anything needs attention.",
    log: [
      "> WHATSAPP: inbound — “status”",
      "> REPLY: moisture 71% · 24.2 °C · tank 78%",
      "> REPLY: UV on since 18:30 · last water 06:05",
      "> LATENCY: 1.2 s end to end",
    ],
    accent: "#e8663f",
  },
];
