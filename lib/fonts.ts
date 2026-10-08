import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

/**
 * All four families are self-hosted from node_modules — the build never needs
 * to reach Google Fonts, so it works offline and in restricted CI sandboxes.
 *
 *   display  Space Grotesk   → monumental instrument headlines
 *   sans     Geist Sans      → body copy
 *   mono     Geist Mono      → readouts, labels, tables, code
 *   serif    Instrument Serif→ italic editorial accents (the botanical voice)
 */

export const spaceGrotesk = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const instrumentSerif = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
  fallback: ["ui-serif", "Georgia", "serif"],
});

export const fontVariables = [GeistSans.variable, GeistMono.variable, spaceGrotesk.variable, instrumentSerif.variable].join(
  " ",
);
