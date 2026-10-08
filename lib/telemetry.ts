/**
 * Telemetry model — shared by the API route and the browser.
 *
 * This is a physically plausible SIMULATION of the pod schema, and every
 * component that renders it says so. The real pods write to Firebase; drop in
 * credentials and the same shapes carry live hardware data unchanged.
 */

import { clamp, lerp, mulberry32, randomSeries, round, seedOf } from "@/lib/utils";
import { plantById } from "@/lib/content/plants";

export type VitalKey =
  | "moisture"
  | "airTemp"
  | "humidity"
  | "vpd"
  | "tank"
  | "lux"
  | "npk"
  | "rssi";

export type Vital = {
  key: VitalKey;
  label: string;
  value: number;
  unit: string;
  band: [number, number];
  min: number;
  max: number;
  precision: number;
  trend: number[];
  accent: string;
  bandLabel: string;
};

export type PodStatus = "nominal" | "attention" | "deficit";

export type PodSnapshot = {
  id: string;
  code: string;
  plantId: string;
  name: string;
  botanical: string;
  status: PodStatus;
  health: number;
  vitals: Vital[];
  lastIrrigation: string;
  nextCheck: string;
  accent: string;
};

export type FleetEvent = {
  at: string;
  level: "ok" | "info" | "warn";
  text: string;
};

export type Snapshot = {
  source: "simulated";
  generatedAt: string;
  pods: PodSnapshot[];
  events: FleetEvent[];
  fleet: {
    uptime: number;
    firmwareUptime: number;
    waterTodayL: number;
    currentMa: number;
    tankPct: number;
    nodes: number;
    rssi: number;
  };
};

export const POD_CODES = ["POD_A", "POD_B", "POD_C", "POD_D"];

const hourInIST = (date: Date) => {
  try {
    return Number(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }).format(date),
    );
  } catch {
    return date.getHours();
  }
};

const clockInIST = (date: Date) => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
};

/** 0 → dark, 1 → full daylight, over a Delhi day. */
function daylight(hour: number): number {
  if (hour < 6 || hour >= 19) return 0;
  const t = (hour - 6) / 13;
  return Math.sin(Math.PI * t);
}

function statusFor(moisture: number, floor: number, ceiling: number, tank: number): PodStatus {
  if (tank < 15) return "attention";
  if (moisture < floor - 4 || moisture > ceiling + 4) return "deficit";
  if (moisture < floor || moisture > ceiling) return "attention";
  return "nominal";
}

const ACCENTS: Record<string, string> = {
  moisture: "#3fe08c",
  airTemp: "#5fe3d6",
  humidity: "#5fe3d6",
  vpd: "#b98cff",
  tank: "#3fe08c",
  lux: "#f0b45f",
  npk: "#b98cff",
  rssi: "#a3b4a8",
};

export function buildPodSnapshot(podId: string, plantId: string, now: Date, podIndex = 0): PodSnapshot {
  const plant = plantById(plantId);
  const minutes = Math.floor(now.getTime() / 60000);
  const seed = seedOf(`${podId}:${plant.id}`);
  const rand = mulberry32(seed + minutes);
  const hour = hourInIST(now);

  const [floor, target, ceiling] = plant.window;
  const daySwing = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 3.5;
  const noise = (rand() - 0.5) * 5.5;
  const moisture = clamp(target + daySwing + noise, floor - 12, ceiling + 8);

  const airTemp = lerp(plant.tempC[0], plant.tempC[1], 0.5) + Math.sin(((hour - 9) / 24) * Math.PI * 2) * 4 + (rand() - 0.5) * 1.6;
  const humidity = clamp(62 - (airTemp - 24) * 1.8 + (rand() - 0.5) * 6, 34, 88);
  const svp = 0.6108 * Math.exp((17.27 * airTemp) / (airTemp + 237.3));
  const vpd = clamp(svp * (1 - humidity / 100), 0.1, 3.4);

  const drainPerHour = 0.42 + podIndex * 0.06;
  const tank = clamp(88 - ((hour + now.getMinutes() / 60) % 24) * drainPerHour * 0.35 - podIndex * 11, 8, 96);

  const lux = Math.round(daylight(hour) * 620 + (daylight(hour) > 0 ? 0 : hour >= 19 || hour < 1 ? 780 : 0) + rand() * 40);

  const nBase = 45 + seed % 12;
  const npk = clamp((nBase + (rand() - 0.5) * 10) / 1.05, 12, 78);
  const rssi = -42 - Math.round(rand() * 6);

  const vitals: Vital[] = [
    {
      key: "moisture",
      label: "Soil moisture",
      value: round(moisture, 1),
      unit: "%",
      band: [floor, ceiling],
      min: 0,
      max: 100,
      precision: 1,
      trend: randomSeries(`${podId}-m`, 28, moisture, 1.6).map((v) => clamp(v, 8, 96)),
      accent: ACCENTS.moisture,
      bandLabel: `band ${floor}–${ceiling}%`,
    },
    {
      key: "airTemp",
      label: "Air temperature",
      value: round(airTemp, 1),
      unit: "°C",
      band: plant.tempC,
      min: 5,
      max: 45,
      precision: 1,
      trend: randomSeries(`${podId}-t`, 28, airTemp, 0.7),
      accent: ACCENTS.airTemp,
      bandLabel: `band ${plant.tempC[0]}–${plant.tempC[1]}°C`,
    },
    {
      key: "humidity",
      label: "Relative humidity",
      value: round(humidity, 1),
      unit: "%",
      band: [40, 78],
      min: 20,
      max: 95,
      precision: 1,
      trend: randomSeries(`${podId}-h`, 28, humidity, 1.4),
      accent: ACCENTS.humidity,
      bandLabel: "target 40–78%",
    },
    {
      key: "vpd",
      label: "Vapour pressure deficit",
      value: round(vpd, 2),
      unit: "kPa",
      band: [0.4, 1.6],
      min: 0,
      max: 3.5,
      precision: 2,
      trend: randomSeries(`${podId}-v`, 28, vpd, 0.08),
      accent: ACCENTS.vpd,
      bandLabel: "comfort 0.4–1.6 kPa",
    },
    {
      key: "tank",
      label: "Reservoir level",
      value: round(tank, 1),
      unit: "%",
      band: [15, 100],
      min: 0,
      max: 100,
      precision: 1,
      trend: randomSeries(`${podId}-k`, 28, tank, 0.5, -0.25).map((v) => clamp(v, 4, 100)),
      accent: ACCENTS.tank,
      bandLabel: "floor 15%",
    },
    {
      key: "lux",
      label: "Light intensity",
      value: lux,
      unit: "lx",
      band: [200, 1400],
      min: 0,
      max: 1600,
      precision: 0,
      trend: randomSeries(`${podId}-l`, 28, lux, 60).map((v) => clamp(v, 0, 1600)),
      accent: ACCENTS.lux,
      bandLabel: "gate 200 lx",
    },
    {
      key: "npk",
      label: "NPK index",
      value: round(npk, 1),
      unit: "%",
      band: [40, 80],
      min: 0,
      max: 100,
      precision: 1,
      trend: randomSeries(`${podId}-n`, 28, npk, 1.2),
      accent: ACCENTS.npk,
      bandLabel: plant.npk,
    },
    {
      key: "rssi",
      label: "Link quality",
      value: rssi,
      unit: "dBm",
      band: [-70, -30],
      min: -95,
      max: -25,
      precision: 0,
      trend: randomSeries(`${podId}-r`, 28, rssi, 1.1),
      accent: ACCENTS.rssi,
      bandLabel: "min −70 dBm",
    },
  ];

  const status = statusFor(moisture, floor, ceiling, tank);
  const health = clamp(
    100 -
      Math.abs(moisture - target) * 2.4 -
      (Math.abs(vpd - 1) > 0.8 ? 6 : 0) -
      (tank < 20 ? 12 : 0) -
      (status === "deficit" ? 4 : 0),
    52,
    99.4,
  );

  const lastBurstMinutesAgo = Math.round(11 + rand() * 300);
  const lastIrrigation = clockInIST(new Date(now.getTime() - lastBurstMinutesAgo * 60000));

  return {
    id: podId,
    code: POD_CODES[podIndex % POD_CODES.length],
    plantId: plant.id,
    name: plant.name,
    botanical: plant.botanical,
    status,
    health: round(health, 1),
    vitals,
    lastIrrigation,
    nextCheck: `${String(90 - (Math.round(now.getTime() / 1000) % 90)).padStart(2, "0")} s`,
    accent: plant.accent,
  };
}

const EVENT_TEMPLATES: { level: FleetEvent["level"]; text: (pod?: PodSnapshot) => string }[] = [
  { level: "ok", text: (p) => `${p?.code ?? "POD_A"} irrigation complete · target reached in 8.0 s` },
  { level: "info", text: () => "Firebase subtree patched · 25 ms round trip" },
  { level: "info", text: (p) => `Fuzzy decision · ${p?.name ?? "tulsi"} deficit confirmed, cooldown ok` },
  { level: "ok", text: () => "Vapour pressure deficit back inside comfort band" },
  { level: "warn", text: () => "Rain plate wet · all irrigation schedules suspended" },
  { level: "info", text: () => "Forecast 43 °C tomorrow · pre-irrigation booked 22:00" },
  { level: "ok", text: () => "Leaf frame classified healthy · 96.4% confidence" },
  { level: "info", text: () => "NPK poll N=45 P=23 K=67 · inside profile" },
  { level: "warn", text: () => "NPK probe timeout · retry in 60 s (bus kept alive)" },
  { level: "ok", text: () => "Offline queue flushed · 0 pending writes" },
  { level: "info", text: () => "WhatsApp inbound: “status” · replied in 1.2 s" },
  { level: "ok", text: () => "Watchdog kick · loop jitter 3 ms" },
];

export function buildEvents(now: Date, pods: PodSnapshot[]): FleetEvent[] {
  const minutes = Math.floor(now.getTime() / 60000);
  const rand = mulberry32(minutes);
  const events: FleetEvent[] = [];
  for (let i = 0; i < 8; i += 1) {
    const tpl = EVENT_TEMPLATES[Math.floor(rand() * EVENT_TEMPLATES.length)];
    const pod = pods[Math.floor(rand() * Math.max(1, pods.length))];
    const at = clockInIST(new Date(now.getTime() - (i * 3 + Math.round(rand() * 4)) * 60000));
    events.push({ at, level: tpl.level, text: tpl.text(pod) });
  }
  return events;
}

export function snapshotForPods(plantIds: string[], now: Date = new Date()): Snapshot {
  const pods = plantIds.slice(0, POD_CODES.length).map((plantId, i) => buildPodSnapshot(`pod-${plantId}`, plantId, now, i));
  const minutes = Math.floor(now.getTime() / 60000);
  const rand = mulberry32(minutes + 7);

  return {
    source: "simulated",
    generatedAt: now.toISOString(),
    pods,
    events: buildEvents(now, pods),
    fleet: {
      uptime: 99.9,
      firmwareUptime: 99.97,
      waterTodayL: round(2.6 + rand() * 2.8 + pods.length * 0.4, 2),
      currentMa: Math.round(268 + rand() * 40),
      tankPct: round(pods[0]?.vitals.find((v) => v.key === "tank")?.value ?? 78, 1),
      nodes: 8,
      rssi: -42 - Math.round(rand() * 5),
    },
  };
}

/* ── history ──────────────────────────────────────────────────────────────── */

export type Range = "1H" | "24H" | "7D";

export const RANGE_META: Record<Range, { points: number; stepMs: number; label: string }> = {
  "1H": { points: 60, stepMs: 60000, label: "last hour · 1 min" },
  "24H": { points: 96, stepMs: 900000, label: "last 24 hours · 15 min" },
  "7D": { points: 168, stepMs: 3600000, label: "last 7 days · 1 hour" },
};

export type HistoryPoint = { t: number; label: string; moisture: number; temp: number; tank: number };

export function buildHistory(plantId: string, range: Range, now: Date = new Date()): HistoryPoint[] {
  const plant = plantById(plantId);
  const { points, stepMs } = RANGE_META[range];
  const [floor, target, ceiling] = plant.window;
  const moisture = randomSeries(`${plantId}-${range}-m`, points, target, 1.5, range === "7D" ? 0.001 : 0);
  const temp = randomSeries(`${plantId}-${range}-t`, points, (plant.tempC[0] + plant.tempC[1]) / 2, 0.6);
  const tank = randomSeries(`${plantId}-${range}-k`, points, 82, 0.35, range === "7D" ? -0.06 : -0.05);

  return Array.from({ length: points }, (_, i) => {
    const date = new Date(now.getTime() - (points - 1 - i) * stepMs);
    const hour = hourInIST(date);
    const swing = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 3.2;
    const m = clamp(moisture[i] + swing, floor - 14, ceiling + 10);
    return {
      t: date.getTime(),
      label: range === "7D" ? `${date.getDate()}/${date.getMonth() + 1}` : clockInIST(date),
      moisture: round(m, 1),
      temp: round(clamp(temp[i], 8, 44), 1),
      tank: round(clamp(tank[i], 10, 98), 1),
    };
  });
}

/** 24 h water-usage bars used by the impact panel. */
export function buildUsage(plantIds: string[], now: Date = new Date()): { label: string; litres: number }[] {
  const rand = mulberry32(Math.floor(now.getTime() / 3600000));
  const perPlant = 0.19 + plantIds.length * 0.02;
  return Array.from({ length: 24 }, (_, h) => {
    const peak = h === 6 || h === 7 || h === 22 ? 1.8 : h >= 18 && h <= 20 ? 1.4 : 1;
    return { label: `${String(h).padStart(2, "0")}`, litres: round(perPlant * peak * (0.7 + rand() * 0.6), 2) };
  });
}
