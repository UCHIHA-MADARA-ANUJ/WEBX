import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content/site";

export const runtime = "nodejs";
export const alt = `${SITE.name} — ${SITE.edition}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPECS = [
  "ESP32 · 240 MHz · 4 MB flash",
  "Firebase RTDB · 25 ms round trip",
  "TFLite int8 · 340 ms · 91.3%",
  "KiCad carrier board · LM2596 buck",
];

/** Social card — generated at build time, no external fonts. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#030604",
          padding: 64,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* grid */}
        <div style={{ position: "absolute", inset: 0, display: "flex", opacity: 0.5 }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div key={i} style={{ width: 80, height: 630, borderRight: "1px solid rgba(63,224,140,0.07)" }} />
          ))}
        </div>

        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(63,224,140,0.22) 0%, rgba(63,224,140,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: "1px solid rgba(63,224,140,0.5)",
                background: "rgba(63,224,140,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 12, border: "2px solid #3fe08c" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ color: "#f1f4ee", fontSize: 20, letterSpacing: 3, fontWeight: 700 }}>VERDE</div>
              <div style={{ color: "#6d7d73", fontSize: 12, letterSpacing: 3 }}>
                {`${SITE.version} · ${SITE.edition.toUpperCase()}`}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(63,224,140,0.3)",
              background: "rgba(63,224,140,0.08)",
              borderRadius: 999,
              padding: "8px 18px",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 8, background: "#3fe08c" }} />
            <div style={{ color: "#3fe08c", fontSize: 14, letterSpacing: 2 }}>8 NODES LIVE</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f1f4ee", fontSize: 104, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>
            PROJECT
          </div>
          <div style={{ color: "#3fe08c", fontSize: 104, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>
            VERDE
          </div>
          <div style={{ color: "#a3b4a8", fontSize: 26, marginTop: 22, maxWidth: 880 }}>
            An autonomous, cloud-integrated regenerative ecosystem for high-density vertical farming.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", height: 1, background: "rgba(241,244,238,0.12)" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {SPECS.map((spec) => (
              <div key={spec} style={{ color: "#6d7d73", fontSize: 13, letterSpacing: 1, display: "flex" }}>
                {spec.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
