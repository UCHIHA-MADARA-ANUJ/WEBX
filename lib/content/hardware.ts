/**
 * Hardware layer — bill of materials, power tree and PCB stack-up.
 * Costs are the real 2024 Delhi component-shop prices the build was costed at.
 */

export type BomItem = {
  id: string;
  name: string;
  part: string;
  category: "compute" | "sensing" | "actuation" | "power" | "comms" | "mechanical";
  role: string;
  iface: string;
  qty: number;
  costInr: number;
  accent: string;
};

export const BOM: BomItem[] = [
  {
    id: "mcu",
    name: "Edge controller",
    part: "ESP32-WROOM-32",
    category: "compute",
    role: "240 MHz dual core, 4 MB flash, Wi-Fi + BLE. Runs the entire control loop and the model runtime.",
    iface: "DevKitC · 38 pin",
    qty: 1,
    costInr: 420,
    accent: "#3fe08c",
  },
  {
    id: "mcu-alt",
    name: "Legacy controller",
    part: "ESP8266 NodeMCU",
    category: "compute",
    role: "The board the first prototype ran on. Firmware still compiles for it, which is why the two-target build exists.",
    iface: "DevKit v1.0",
    qty: 1,
    costInr: 260,
    accent: "#3fe08c",
  },
  {
    id: "pcb",
    name: "Custom carrier board",
    part: "KiCad v1 · 2 layer",
    category: "compute",
    role: "61 × 84 mm two-layer board carrying the buck front end, relay driver, and every labelled sensor header.",
    iface: "JLC 1.6 mm FR-4",
    qty: 1,
    costInr: 640,
    accent: "#5fe3d6",
  },
  {
    id: "moisture",
    name: "Soil moisture probe",
    part: "Capacitive v1.2",
    category: "sensing",
    role: "Dielectric reading, no exposed electrodes, so it does not corrode into a false negative after six weeks in wet soil.",
    iface: "Analog → GPIO34",
    qty: 4,
    costInr: 145,
    accent: "#3fe08c",
  },
  {
    id: "dht",
    name: "Temp + humidity",
    part: "DHT22 / AM2302",
    category: "sensing",
    role: "Ambient pair used to compute vapour-pressure deficit — the stress signal humidity alone cannot give you.",
    iface: "1-wire → GPIO4",
    qty: 2,
    costInr: 320,
    accent: "#5fe3d6",
  },
  {
    id: "ultrasonic",
    name: "Reservoir level",
    part: "HC-SR04",
    category: "sensing",
    role: "Time-of-flight down the tank. Median-of-five filtering rejects pump and fan noise.",
    iface: "Trig/Echo → GPIO5/18",
    qty: 1,
    costInr: 95,
    accent: "#b98cff",
  },
  {
    id: "npk",
    name: "NPK probe",
    part: "RS485 4-in-1",
    category: "sensing",
    role: "Nitrogen, phosphorus, potassium and soil temperature on a differential bus rated for 20 cm insertion.",
    iface: "RS485 → MAX485",
    qty: 1,
    costInr: 2450,
    accent: "#f0b45f",
  },
  {
    id: "rain",
    name: "Rain plate",
    part: "Tipping bucket + plate",
    category: "sensing",
    role: "Monsoon guard. One confirmed event suspends every irrigation schedule for the day.",
    iface: "Digital → GPIO27",
    qty: 1,
    costInr: 120,
    accent: "#5fe3d6",
  },
  {
    id: "ldr",
    name: "Ambient light",
    part: "LDR + 10 kΩ divider",
    category: "sensing",
    role: "Photoperiod gate at 200 lx, so the grow array follows daylight instead of a fixed clock.",
    iface: "ADC1_CH7 → GPIO35",
    qty: 1,
    costInr: 35,
    accent: "#f0b45f",
  },
  {
    id: "cam",
    name: "Leaf camera",
    part: "OV2640 module",
    category: "sensing",
    role: "Two megapixels of leaf, captured every six hours and handed to the quantised classifier.",
    iface: "SCCB + DVP",
    qty: 1,
    costInr: 380,
    accent: "#e8663f",
  },
  {
    id: "pump",
    name: "Diaphragm pump",
    part: "5 V DC · 2.4 L/min",
    category: "actuation",
    role: "Self-priming, dry-run tolerant, and quiet enough to live on a terrace. Pulls 1.5 A on inrush.",
    iface: "Relay K1 · NO",
    qty: 2,
    costInr: 460,
    accent: "#3fe08c",
  },
  {
    id: "relay",
    name: "Relay module",
    part: "Opto-isolated 2-channel",
    category: "actuation",
    role: "Galvanically separates the 5 V pump rail from logic. Zero-cross switching keeps the MCU out of reset.",
    iface: "GPIO26 / GPIO25",
    qty: 1,
    costInr: 180,
    accent: "#b98cff",
  },
  {
    id: "mosfet",
    name: "Light driver",
    part: "IRLZ44N logic MOSFET",
    category: "actuation",
    role: "PWM dimming for the grow array without the heat of a linear driver.",
    iface: "PWM → GPIO23",
    qty: 2,
    costInr: 60,
    accent: "#f0b45f",
  },
  {
    id: "leds",
    name: "Grow array",
    part: "12 × full spectrum LED",
    category: "actuation",
    role: "380–780 nm coverage over a 60 × 40 cm bed. Spectrum emphasis shifts with growth stage.",
    iface: "MOSFET PWM",
    qty: 12,
    costInr: 38,
    accent: "#f0b45f",
  },
  {
    id: "buck",
    name: "Power front end",
    part: "LM2596 buck module",
    category: "power",
    role: "Drops 12 V to a clean 5 V rail. The single change that made the whole system stop resetting itself.",
    iface: "12 V → 5 V / 3 A",
    qty: 1,
    costInr: 150,
    accent: "#3fe08c",
  },
  {
    id: "supply",
    name: "Mains supply",
    part: "12 V 3 A SMPS",
    category: "power",
    role: "Feeds the buck front end. Chosen so a stalled pump plus full lighting still fits inside the headroom.",
    iface: "90–265 V AC in",
    qty: 1,
    costInr: 390,
    accent: "#5fe3d6",
  },
  {
    id: "fuse",
    name: "Protection",
    part: "Fuse + TVS + bulk caps",
    category: "power",
    role: "2 A fuse, transient suppressor and 1000 µF of bulk capacitance holding the rail through pump inrush.",
    iface: "Inline",
    qty: 1,
    costInr: 110,
    accent: "#b98cff",
  },
  {
    id: "harness",
    name: "Harness & enclosure",
    part: "JST-XH + IP54 box",
    category: "mechanical",
    role: "Keyed connectors for every sensor, strain relief everywhere, and an enclosure that has survived a Delhi monsoon.",
    iface: "IP54",
    qty: 1,
    costInr: 520,
    accent: "#e8663f",
  },
];

export const HARDWARE_QUICKSTATS = [
  { label: "CPU clock", value: "240 MHz", sub: "dual core" },
  { label: "Flash", value: "4 MB", sub: "firmware + model" },
  { label: "ADC resolution", value: "12-bit", sub: "0–4095 counts" },
  { label: "Wi-Fi", value: "2.4 GHz", sub: "802.11 b/g/n" },
];

export type PowerItem = {
  id: string;
  label: string;
  currentMa: number;
  duty: number;
  note: string;
  accent: string;
};

/** Duty-cycled current budget — the numbers behind the interactive calculator. */
export const POWER_BUDGET: PowerItem[] = [
  {
    id: "logic",
    label: "Logic rail (always on)",
    currentMa: 68,
    duty: 1,
    note: "MCU awake, scheduler running, sensors polled",
    accent: "#3fe08c",
  },
  {
    id: "radio",
    label: "Wi-Fi radio",
    currentMa: 140,
    duty: 0.12,
    note: "Only during sync windows, not while idle",
    accent: "#3fe08c",
  },
  {
    id: "sensors",
    label: "Sensor bus",
    currentMa: 46,
    duty: 0.08,
    note: "Probes energised during the 1.2 s poll only",
    accent: "#5fe3d6",
  },
  {
    id: "npk",
    label: "NPK probe",
    currentMa: 210,
    duty: 0.01,
    note: "Every 15 minutes, 9 s warm-up per reading",
    accent: "#b98cff",
  },
  {
    id: "camera",
    label: "Camera capture",
    currentMa: 180,
    duty: 0.004,
    note: "Six-hourly frame, never concurrent with the pump",
    accent: "#e8663f",
  },
  {
    id: "inference",
    label: "Model inference",
    currentMa: 240,
    duty: 0.003,
    note: "340 ms int8 pass after each capture",
    accent: "#e8663f",
  },
  {
    id: "pump",
    label: "Pump (K1)",
    currentMa: 1500,
    duty: 0.06,
    note: "8 s bursts, ~14 bursts a day across two pods",
    accent: "#3fe08c",
  },
  {
    id: "lights",
    label: "Grow light array",
    currentMa: 900,
    duty: 0.42,
    note: "12 h photoperiod at 68% duty, LDR-gated",
    accent: "#f0b45f",
  },
];

export const PCB_LAYERS = [
  {
    id: "l1",
    name: "Component side",
    note: "ESP32 socket, relay driver, buck module footprint, labelled JST headers",
    accent: "#3fe08c",
  },
  {
    id: "l2",
    name: "Top copper",
    note: "Signal routing — 0.25 mm traces, star ground back to the buck output",
    accent: "#f0b45f",
  },
  {
    id: "l3",
    name: "Bottom copper",
    note: "Unbroken ground pour under the whole logic section",
    accent: "#5fe3d6",
  },
  {
    id: "l4",
    name: "Silkscreen",
    note: "Every pin named. The reason field repairs take minutes instead of hours",
    accent: "#b98cff",
  },
  {
    id: "l5",
    name: "Substrate",
    note: "1.6 mm FR-4, 61 × 84 mm, four M3 mounting holes",
    accent: "#6d7d73",
  },
] as const;
