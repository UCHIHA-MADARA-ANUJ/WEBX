export const SITE = {
  codename: 'PROJECT VERDE',
  version: 'V3.0.0',
  tagline: 'Autonomous Plant OS',
  blurb:
    'A closed-loop firmware platform that keeps a living plant alive without a human in the loop. Sensor fusion, irrigation control, OTA telemetry and an on-device shell — all on a 4 MB ESP32-WROOM-32.',
  event: 'DAV ACON 5 — IoT Showcase',
  build: 'STABLE',
  hash: '0xDEAD_BEEF',
  email: 'team.verde.os@gmail.com',
  github: 'https://github.com/UCHIHA-MADARA-ANUJ/WEBX',
}

export const TEAM = [
  {
    name: 'Anuj',
    role: 'Firmware & Systems',
    handle: '@uchiha-madara-anuj',
    bio: 'Writes the RTOS tasks, the sensor drivers and the irrigation state machine. Owns the boot path, the watchdog and everything that must not crash at 3 AM.',
    skills: ['C / C++', 'ESP-IDF', 'FreeRTOS', 'MQTT', 'PCB Bring-up'],
    glyph: 'A',
  },
  {
    name: 'Aarav',
    role: 'Interface & Data',
    handle: '@aarav',
    bio: 'Builds the dashboard, the telemetry pipeline and the shell. Turns raw ADC counts into something a judge can read from three metres away.',
    skills: ['React', 'TypeScript', 'WebSockets', 'Data Viz', 'Design Systems'],
    glyph: 'R',
  },
]

export const SENSORS = [
  {
    id: 'soil',
    label: 'Moisture Index',
    unit: '%',
    pin: 'GPIO 34',
    detail: 'ADC1_CH6 · capacitive probe',
    base: 52,
    range: 6,
    min: 0,
    max: 100,
    accent: 'phos',
    status: 'OPTIMAL',
  },
  {
    id: 'temp',
    label: 'Atmosphere',
    unit: '°C',
    pin: 'GPIO 4',
    detail: 'DHT11 · 1-wire core sensor',
    base: 24.5,
    range: 1.2,
    min: -10,
    max: 60,
    accent: 'amber',
    status: 'DHT11 OK',
  },
  {
    id: 'hum',
    label: 'Humidity',
    unit: '%',
    pin: 'GPIO 4',
    detail: 'DHT11 · relative humidity',
    base: 65,
    range: 5,
    min: 0,
    max: 100,
    accent: 'cyan',
    status: 'NOMINAL',
  },
  {
    id: 'lux',
    label: 'Lux Intensity',
    unit: 'Lx',
    pin: 'GPIO 35',
    detail: 'ADC1_CH7 · analog LDR divider',
    base: 720,
    range: 160,
    min: 0,
    max: 1200,
    accent: 'amber',
    status: 'DAYLIGHT',
  },
] as const

export const SUBSYSTEMS = [
  {
    code: 'SYS.01',
    title: 'Sensor Fusion Core',
    body: 'Four asynchronous sampling tasks feed a shared ring buffer. A median-of-five filter rejects ADC spikes before anything reaches the control loop.',
    tags: ['FreeRTOS', 'ADC', 'Kalman-lite'],
  },
  {
    code: 'SYS.02',
    title: 'Closed-Loop Irrigation',
    body: 'A hysteresis controller drives the pump relay between 38% and 58% soil moisture, with a hard 12-second duty ceiling so a stuck sensor can never flood the pot.',
    tags: ['PID', 'Relay', 'Fail-safe'],
  },
  {
    code: 'SYS.03',
    title: 'Telemetry Uplink',
    body: 'Readings are batched and pushed over MQTT every 5 seconds. Offline? The last 2,048 samples persist to flash and replay on reconnect.',
    tags: ['MQTT', 'NVS', 'Wi-Fi'],
  },
  {
    code: 'SYS.04',
    title: 'Verde Shell',
    body: 'A real command interpreter over UART and WebSocket. Read any pin, force the pump, dump the config, trigger a reboot — no reflash required.',
    tags: ['UART', 'WebSocket', 'REPL'],
  },
  {
    code: 'SYS.05',
    title: 'Watchdog & Recovery',
    body: 'Task-level watchdog plus a brownout handler. On panic the device reboots into the last known-good config and logs the crash reason to flash.',
    tags: ['WDT', 'Brownout', 'Crash log'],
  },
  {
    code: 'SYS.06',
    title: 'OTA Pipeline',
    body: 'Dual-partition OTA with rollback. A bad image never bricks the unit — the bootloader falls back after three failed health checks.',
    tags: ['OTA', 'A/B slots', 'Rollback'],
  },
]

export const SPECS = [
  { k: 'MCU', v: 'ESP32-WROOM-32' },
  { k: 'Clock', v: '160 MHz dual-core' },
  { k: 'Flash', v: '4 MB / SPI' },
  { k: 'SRAM', v: '520 KB' },
  { k: 'Radio', v: 'Wi-Fi b/g/n + BLE 4.2' },
  { k: 'Sensors', v: 'DHT11 · LDR · Capacitive soil' },
  { k: 'Actuator', v: '5V relay → 3W pump' },
  { k: 'Power', v: '5V 2A USB-C · 180 mA idle' },
  { k: 'Firmware', v: 'ESP-IDF 5.2 / FreeRTOS' },
  { k: 'Uptime', v: '41 d 06 h · 0 panics' },
]

export const TIMELINE = [
  {
    stamp: 'v0.1',
    title: 'Breadboard & blink',
    body: 'First DHT11 read on a breadboard. Half the jumper wires were wrong, the other half were loose.',
  },
  {
    stamp: 'v1.0',
    title: 'It waters itself',
    body: 'Relay + pump wired in. The first fully autonomous watering cycle ran unattended for 72 hours.',
  },
  {
    stamp: 'v2.0',
    title: 'Telemetry online',
    body: 'MQTT uplink, flash-backed history, and the first web dashboard. Data finally left the device.',
  },
  {
    stamp: 'v2.6',
    title: 'Hardened',
    body: 'Watchdog, brownout recovery and duty ceilings. Survived a deliberate sensor-unplug stress test.',
  },
  {
    stamp: 'v3.0',
    title: 'Verde OS',
    body: 'Shell, OTA with rollback, and the compendium you are reading now. Shipped for DAV ACON 5.',
  },
]

export const METRICS = [
  { value: '41d', label: 'Continuous uptime' },
  { value: '0', label: 'Kernel panics' },
  { value: '1.2M', label: 'Samples logged' },
  { value: '5s', label: 'Telemetry interval' },
]

export const BOOT_LINES = [
  'rst:0x1 (POWERON_RESET), boot:0x13 (SPI_FAST_FLASH_BOOT)',
  'ets Jul 29 2019 12:21:46 — clk_drv:0x00 q_drv:0x00',
  '[BIOS] checking memory integrity .............. OK',
  '[BIOS] 4MB FLASH mapped @ 0x3F400000 ......... OK',
  '[SYS ] FreeRTOS 10.4.3 scheduler started',
  '[NVS ] preferences partition mounted',
  '[I2C ] bus scan: 1 device found',
  '[DHT ] GPIO4  handshake ....................... OK',
  '[ADC ] GPIO34 soil probe calibrated',
  '[ADC ] GPIO35 LDR divider calibrated',
  '[WIFI] joining VERDE_MESH .................... OK',
  '[MQTT] broker handshake · QoS 1 .............. OK',
  '[CTRL] irrigation state machine → IDLE',
  '[SHELL] secure thread active',
  'VERDE OS V3.0.0 ONLINE',
]
