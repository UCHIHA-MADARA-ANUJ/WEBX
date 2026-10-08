/**
 * Specimen database — every profile the firmware can load.
 * Thresholds are what the pod actually enforces; `window` is the moisture band
 * in percent, [floor, target, ceiling].
 */

export type PlantCategory = "herb" | "vegetable" | "flower" | "succulent";

export type Plant = {
  id: string;
  name: string;
  botanical: string;
  category: PlantCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  window: [number, number, number];
  tempC: [number, number];
  lightHours: number;
  npk: string;
  cycleWeeks: number;
  burstMs: number;
  note: string;
  accent: string;
};

export const CATEGORY_META: Record<PlantCategory, { label: string; accent: string }> = {
  herb: { label: "Herb", accent: "#3fe08c" },
  vegetable: { label: "Vegetable", accent: "#5fe3d6" },
  flower: { label: "Flower", accent: "#b98cff" },
  succulent: { label: "Succulent", accent: "#f0b45f" },
};

export const PLANTS: Plant[] = [
  {
    id: "tulsi",
    name: "Tulsi",
    botanical: "Ocimum tenuiflorum",
    category: "herb",
    difficulty: 2,
    window: [65, 72, 80],
    tempC: [22, 32],
    lightHours: 10,
    npk: "5 : 10 : 5",
    cycleWeeks: 14,
    burstMs: 8000,
    note: "The reference plant for the whole build. Tolerates heat, sulks when waterlogged, and its profile is the one that loaded during every demo.",
    accent: "#3fe08c",
  },
  {
    id: "mint",
    name: "Mint",
    botanical: "Mentha spicata",
    category: "herb",
    difficulty: 2,
    window: [68, 75, 84],
    tempC: [20, 28],
    lightHours: 9,
    npk: "4 : 8 : 4",
    cycleWeeks: 10,
    burstMs: 9000,
    note: "Thirstiest profile in the database. Runs the pump more often than anything else and grows faster than the log can document it.",
    accent: "#3fe08c",
  },
  {
    id: "coriander",
    name: "Coriander",
    botanical: "Coriandrum sativum",
    category: "herb",
    difficulty: 3,
    window: [60, 68, 76],
    tempC: [15, 26],
    lightHours: 8,
    npk: "4 : 6 : 4",
    cycleWeeks: 8,
    burstMs: 6000,
    note: "Bolts above 30 °C. The pod answers by shading the photoperiod and holding the bed cooler with shorter, more frequent bursts.",
    accent: "#3fe08c",
  },
  {
    id: "tomato",
    name: "Tomato",
    botanical: "Solanum lycopersicum",
    category: "vegetable",
    difficulty: 3,
    window: [60, 67, 75],
    tempC: [20, 30],
    lightHours: 12,
    npk: "10 : 15 : 10",
    cycleWeeks: 14,
    burstMs: 11000,
    note: "Wants deep watering, not frequent watering. The burst length is nearly double a herb's so the roots get a real soak.",
    accent: "#5fe3d6",
  },
  {
    id: "cucumber",
    name: "Cucumber",
    botanical: "Cucumis sativus",
    category: "vegetable",
    difficulty: 2,
    window: [70, 77, 85],
    tempC: [22, 30],
    lightHours: 11,
    npk: "8 : 12 : 8",
    cycleWeeks: 12,
    burstMs: 10000,
    note: "Fastest water uptake on record. Dropped 9 points of moisture in a single hot afternoon and triggered two unplanned bursts.",
    accent: "#5fe3d6",
  },
  {
    id: "spinach",
    name: "Spinach",
    botanical: "Spinacia oleracea",
    category: "vegetable",
    difficulty: 3,
    window: [62, 70, 78],
    tempC: [12, 24],
    lightHours: 9,
    npk: "6 : 8 : 6",
    cycleWeeks: 7,
    burstMs: 6500,
    note: "The cold-weather test case, proving the pod holds a profile that is nothing like Delhi's outdoor conditions.",
    accent: "#5fe3d6",
  },
  {
    id: "chilli",
    name: "Chilli",
    botanical: "Capsicum annuum",
    category: "vegetable",
    difficulty: 3,
    window: [55, 63, 72],
    tempC: [21, 34],
    lightHours: 12,
    npk: "6 : 12 : 10",
    cycleWeeks: 18,
    burstMs: 8500,
    note: "Happiest when slightly under-watered. The ceiling is deliberately low so the pod lets the bed dry down between cycles.",
    accent: "#5fe3d6",
  },
  {
    id: "marigold",
    name: "Marigold",
    botanical: "Tagetes patula",
    category: "flower",
    difficulty: 2,
    window: [58, 66, 74],
    tempC: [18, 30],
    lightHours: 11,
    npk: "5 : 10 : 8",
    cycleWeeks: 12,
    burstMs: 7000,
    note: "Pest control that happens to flower. Runs the flowering-stage branch of the profile logic, which shortens bursts and lifts potassium.",
    accent: "#b98cff",
  },
  {
    id: "rose",
    name: "Rose",
    botanical: "Rosa indica",
    category: "flower",
    difficulty: 4,
    window: [55, 62, 70],
    tempC: [20, 28],
    lightHours: 10,
    npk: "6 : 10 : 6",
    cycleWeeks: 22,
    burstMs: 9500,
    note: "The hardest profile to keep happy, and the reason the disease scan exists at all — black spot shows up on a leaf two days before a person notices.",
    accent: "#b98cff",
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    botanical: "Hibiscus rosa-sinensis",
    category: "flower",
    difficulty: 3,
    window: [62, 68, 76],
    tempC: [22, 35],
    lightHours: 13,
    npk: "8 : 8 : 10",
    cycleWeeks: 24,
    burstMs: 10500,
    note: "Wants more light than the default photoperiod, so its profile stretches the schedule to 13 hours at full duty.",
    accent: "#b98cff",
  },
  {
    id: "aloe",
    name: "Aloe Vera",
    botanical: "Aloe barbadensis",
    category: "succulent",
    difficulty: 1,
    window: [30, 40, 52],
    tempC: [22, 35],
    lightHours: 12,
    npk: "2 : 4 : 2",
    cycleWeeks: 30,
    burstMs: 4000,
    note: "Proof that the floor matters as much as the ceiling. Over-watering is the only way to kill it, so the pod errs dry on purpose.",
    accent: "#f0b45f",
  },
  {
    id: "cactus",
    name: "Cactus",
    botanical: "Mammillaria elongata",
    category: "succulent",
    difficulty: 1,
    window: [18, 30, 42],
    tempC: [25, 35],
    lightHours: 14,
    npk: "2 : 5 : 2",
    cycleWeeks: 40,
    burstMs: 3000,
    note: "Lowest water demand in the database. Watered four times in the entire build cycle and grew anyway.",
    accent: "#f0b45f",
  },
];

export const PLANT_BY_ID = Object.fromEntries(PLANTS.map((p) => [p.id, p])) as Record<string, Plant>;

export const plantById = (id: string): Plant => PLANT_BY_ID[id] ?? PLANTS[0];
