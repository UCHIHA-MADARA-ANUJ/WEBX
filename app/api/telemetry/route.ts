import { NextResponse } from "next/server";
import { snapshotForPods } from "@/lib/telemetry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Telemetry read path.
 *
 * Shape-compatible with the pods' Firebase subtree (`/pods/{id}/telemetry`).
 * Today it generates a deterministic simulation; point VERDE_FIREBASE_URL at a
 * real database and this handler becomes a normalising proxy without any
 * change to the components that consume it.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = (url.searchParams.get("pods") ?? "tulsi,tomato,mint")
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 4);

  const snapshot = snapshotForPods(requested.length ? requested : ["tulsi"], new Date());

  return NextResponse.json(snapshot, {
    headers: {
      "cache-control": "no-store, max-age=0",
      "x-verde-source": snapshot.source,
      "x-verde-schema": "4.0",
    },
  });
}
