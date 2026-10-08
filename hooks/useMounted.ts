"use client";

import { useEffect, useState } from "react";

/**
 * False on the server and during the first client render, true afterwards.
 *
 * Used to gate anything derived from `new Date()`: the HTML is prerendered at
 * build time, so a clock-dependent value would hydrate differently in the
 * browser and throw a mismatch. Gate it, then fill it in.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
