import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://verde-compendium.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/#system`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/#telemetry`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/#hardware`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/#firmware`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/#specimens`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/#impact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/#team`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/#contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];
}
