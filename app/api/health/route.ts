import { NextResponse } from "next/server";
import { SITE } from "@/lib/content/site";

export const dynamic = "force-dynamic";

const startedAt = Date.now();

/** Liveness probe — the same endpoint the pod fleet pings from the dashboard. */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "verde-compendium",
      version: SITE.version,
      edition: SITE.edition,
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      telemetry: "simulated",
      checkedAt: new Date().toISOString(),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
