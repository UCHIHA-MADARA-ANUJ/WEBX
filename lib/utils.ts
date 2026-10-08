/**
 * Small, dependency-free helpers shared across the site.
 */

export function cn(...parts: Array<string | number | false | null | undefined>): string {
  return parts.filter((p): p is string => typeof p === "string" && p.length > 0).join(" ");
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const round = (v: number, decimals = 0) => {
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
};

export const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);


/** Deterministic PRNG — keeps every simulated readout stable between renders. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a — string to 32-bit seed. */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const seedOf = (input: string | number) => (typeof input === "number" ? input : hashString(input));

/** A smooth pseudo-random walk — used for every chart / telemetry line. */
export function randomSeries(
  seed: string | number,
  count: number,
  base: number,
  spread: number,
  drift = 0,
): number[] {
  const rand = mulberry32(seedOf(seed));
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < count; i += 1) {
    v += (rand() - 0.5) * spread + drift;
    out.push(v);
  }
  return out;
}

export function inr(value: number, decimals = 0): string {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export const pad2 = (n: number) => String(Math.floor(n)).padStart(2, "0");
