"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageUp, RefreshCw, ScanLine, Sparkles } from "lucide-react";
import { Segmented } from "@/components/ui/Controls";
import { Panel } from "@/components/ui/Panel";
import { cn, clamp } from "@/lib/utils";
import { useSettings } from "@/components/providers/SettingsProvider";

const SIZE = 360;

type SampleKind = "healthy" | "deficiency" | "fungal" | "pest";

const SAMPLES: { id: SampleKind; label: string }[] = [
  { id: "healthy", label: "Healthy leaf" },
  { id: "deficiency", label: "Chlorosis" },
  { id: "fungal", label: "Fungal spot" },
  { id: "pest", label: "Pest damage" },
];

type ClassScore = { id: string; label: string; p: number; accent: string };
type Metric = { label: string; value: number; display: string; accent: string; hint: string };

type Analysis = {
  verdict: string;
  confidence: number;
  accent: string;
  classes: ClassScore[];
  metrics: Metric[];
  advice: string[];
};

/* ── drawing ──────────────────────────────────────────────────────────────── */

function leafPath(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.1);
  ctx.bezierCurveTo(w * 0.86, h * 0.24, w * 0.9, h * 0.72, cx, h * 0.94);
  ctx.bezierCurveTo(w * 0.1, h * 0.72, w * 0.14, h * 0.24, cx, h * 0.1);
  ctx.closePath();
}

function drawPlateBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#070c09";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(241,244,238,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // corner registration marks
  ctx.strokeStyle = "rgba(63,224,140,0.35)";
  const m = 12;
  const l = 14;
  [
    [m, m, 1, 1],
    [w - m, m, -1, 1],
    [m, h - m, 1, -1],
    [w - m, h - m, -1, -1],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * l);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * l, y);
    ctx.stroke();
  });
}

function drawLeaf(ctx: CanvasRenderingContext2D, w: number, h: number, kind: SampleKind) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;

  // base leaf
  const gradient = ctx.createLinearGradient(0, h * 0.1, 0, h * 0.94);
  gradient.addColorStop(0, "#4fbf72");
  gradient.addColorStop(0.5, "#3ea85f");
  gradient.addColorStop(1, "#2d8248");
  leafPath(ctx, w, h);
  ctx.fillStyle = gradient;
  ctx.fill();

  // stem
  ctx.strokeStyle = "#2b6f3f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.9);
  ctx.lineTo(cx, h * 0.99);
  ctx.stroke();

  ctx.save();
  leafPath(ctx, w, h);
  ctx.clip();

  // midrib + veins
  ctx.strokeStyle = "rgba(224,255,235,0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.12);
  ctx.lineTo(cx, h * 0.93);
  ctx.stroke();

  ctx.lineWidth = 1.1;
  ctx.strokeStyle = "rgba(224,255,235,0.24)";
  for (let i = 0; i < 7; i += 1) {
    const t = 0.18 + i * 0.1;
    const y = h * t;
    const spread = (0.34 - Math.abs(t - 0.5) * 0.24) * w;
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.quadraticCurveTo(cx + spread * 0.55, y + h * 0.02, cx + spread, y + h * 0.05);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, y);
    ctx.quadraticCurveTo(cx - spread * 0.55, y + h * 0.02, cx - spread, y + h * 0.05);
    ctx.stroke();
  }

  // treatment per condition
  if (kind === "deficiency") {
    const yellow = ctx.createRadialGradient(cx, h * 0.5, w * 0.08, cx, h * 0.5, w * 0.48);
    yellow.addColorStop(0, "rgba(214,214,120,0.05)");
    yellow.addColorStop(0.55, "rgba(216,206,108,0.5)");
    yellow.addColorStop(1, "rgba(226,208,92,0.85)");
    ctx.fillStyle = yellow;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(232,220,120,0.5)";
    for (let i = 0; i < 26; i += 1) {
      const x = cx + (Math.random() - 0.5) * w * 0.7;
      const y = h * (0.16 + Math.random() * 0.7);
      ctx.beginPath();
      ctx.ellipse(x, y, 5 + Math.random() * 8, 3 + Math.random() * 5, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (kind === "fungal") {
    for (let i = 0; i < 16; i += 1) {
      const x = cx + (Math.random() - 0.5) * w * 0.72;
      const y = h * (0.16 + Math.random() * 0.72);
      const r = 6 + Math.random() * 12;
      const spot = ctx.createRadialGradient(x, y, 0, x, y, r);
      spot.addColorStop(0, "rgba(48,30,14,0.95)");
      spot.addColorStop(0.6, "rgba(112,74,32,0.85)");
      spot.addColorStop(1, "rgba(196,168,88,0.35)");
      ctx.fillStyle = spot;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(70,64,40,0.25)";
    ctx.fillRect(0, 0, w, h);
  }

  if (kind === "pest") {
    ctx.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 12; i += 1) {
      const x = cx + (Math.random() - 0.5) * w * 0.66;
      const y = h * (0.18 + Math.random() * 0.66);
      ctx.beginPath();
      ctx.ellipse(x, y, 5 + Math.random() * 11, 4 + Math.random() * 9, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(58,44,26,0.4)";
    for (let i = 0; i < 20; i += 1) {
      const x = cx + (Math.random() - 0.5) * w * 0.7;
      const y = h * (0.18 + Math.random() * 0.7);
      ctx.beginPath();
      ctx.arc(x, y, 1.5 + Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/* ── analysis ─────────────────────────────────────────────────────────────── */

function analyse(imageData: ImageData, w: number, h: number): Analysis {
  const data = imageData.data;
  let leafPixels = 0;
  let greenSum = 0;
  let chlorosis = 0;
  let necrosis = 0;
  let brightnessSum = 0;
  let brightnessSq = 0;
  const luma: number[] = [];

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      const alpha = data[i + 3];
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const isLeaf = alpha > 40 && (g > 40 || r > 40 || b > 40);
      const value = (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;
      luma.push(value);

      if (!isLeaf) continue;

      leafPixels += 1;
      brightnessSum += value;
      brightnessSq += value * value;

      const greenIndex = (g - (r + b) / 2) / 255;
      greenSum += greenIndex;

      const yellow = (Math.min(r, g) - b) / 255;
      const bright = (r + g) / 2 / 255;
      if (yellow > 0.06 && bright > 0.42) chlorosis += 1;

      const brownHue = r > g && g > b && r / 255 > 0.2 && value < 0.72;
      const dead = value < 0.28;
      if (brownHue || dead) necrosis += 1;
    }
  }

  const total = Math.max(1, leafPixels);
  const greenness = clamp((greenSum / total + 0.14) * 2.6, 0, 1);
  const chlorosisRatio = clamp((chlorosis / total) * 2.4, 0, 1);
  const necrosisRatio = clamp((necrosis / total) * 2.1, 0, 1);
  const mean = brightnessSum / total;
  const variance = brightnessSq / total - mean * mean;
  const texture = clamp(variance * 26, 0, 1);

  // edge density — busy leaf surface suggests lesions rather than smooth tissue
  let edges = 0;
  for (let y = 1; y < h - 1; y += 2) {
    for (let x = 1; x < w - 1; x += 2) {
      const i = (y * w + x) * 4;
      const right = (y * w + x + 1) * 4;
      const down = ((y + 1) * w + x) * 4;
      if (data[i + 3] < 40) continue;
      const a = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const bR = (data[right] + data[right + 1] + data[right + 2]) / 3;
      const bD = (data[down] + data[down + 1] + data[down + 2]) / 3;
      if (Math.abs(a - bR) > 26 || Math.abs(a - bD) > 26) edges += 1;
    }
  }
  const edgeDensity = clamp((edges / ((w * h) / 4)) * 4.5, 0, 1);

  const health = clamp(
    0.42 + greenness * 0.72 - chlorosisRatio * 0.55 - necrosisRatio * 0.62 - texture * 0.25,
    0.03,
    0.985,
  );

  const raw = {
    healthy: health * 1.15,
    deficiency: chlorosisRatio * 1.5 + (1 - greenness) * 0.6,
    fungal: necrosisRatio * 1.25 + edgeDensity * 0.6 + texture * 0.4,
    pest: edgeDensity * 1.05 + (1 - texture) * 0.25 + (1 - necrosisRatio) * 0.3,
  };

  const sum = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
  const classes: ClassScore[] = [
    { id: "healthy", label: "Healthy tissue", p: raw.healthy / sum, accent: "#3fe08c" },
    { id: "deficiency", label: "Nutrient deficiency", p: raw.deficiency / sum, accent: "#f0b45f" },
    { id: "fungal", label: "Fungal infection", p: raw.fungal / sum, accent: "#e8663f" },
    { id: "pest", label: "Pest damage", p: raw.pest / sum, accent: "#b98cff" },
  ].sort((a, b) => b.p - a.p);

  const top = classes[0];
  const adviceMap: Record<string, string[]> = {
    healthy: [
      "No action. Keep the current photoperiod and moisture band.",
      "Re-scan in 6 hours — the pod does this on its own schedule.",
    ],
    deficiency: [
      "Nitrogen-led chlorosis: raise N in the feed, keep P and K steady.",
      "Check the NPK probe reading before dosing — the probe knows better than a photo.",
      "Move to a vegetative-stage profile if the plant is still growing.",
    ],
    fungal: [
      "Isolate the pod and drop humidity below 70% for 48 hours.",
      "Remove affected leaves with sterilised shears — spores travel on hands.",
      "Boost airflow and stop overhead watering; the soil line should stay dry.",
    ],
    pest: [
      "Inspect the underside of leaves where the colony lives.",
      "Introduce a predatory mite, or neem oil at dusk to spare pollinators.",
      "Re-scan in 24 hours to see whether the damage is still advancing.",
    ],
  };

  const metrics: Metric[] = [
    {
      label: "Chlorophyll index",
      value: greenness,
      display: `${(greenness * 100).toFixed(1)}%`,
      accent: "#3fe08c",
      hint: "Mean green dominance across the leaf",
    },
    {
      label: "Chlorosis load",
      value: chlorosisRatio,
      display: `${(chlorosisRatio * 100).toFixed(1)}%`,
      accent: "#f0b45f",
      hint: "Yellow-shifted pixels, edge weighted",
    },
    {
      label: "Necrotic area",
      value: necrosisRatio,
      display: `${(necrosisRatio * 100).toFixed(1)}%`,
      accent: "#e8663f",
      hint: "Dead or browning tissue",
    },
    {
      label: "Surface texture",
      value: texture,
      display: `${(texture * 100).toFixed(1)}%`,
      accent: "#b98cff",
      hint: "Luminance variance — lesions and bite marks",
    },
  ];

  return {
    verdict: top.label,
    confidence: top.p,
    accent: top.accent,
    classes,
    metrics,
    advice: adviceMap[top.id],
  };
}

/* ── component ────────────────────────────────────────────────────────────── */

export function LeafLab() {
  const { reducedMotion } = useSettings();
  const plateRef = useRef<HTMLCanvasElement>(null);
  const leafRef = useRef<HTMLCanvasElement>(null);
  const seedRef = useRef(7);
  const [sample, setSample] = useState<SampleKind>("healthy");
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [mask, setMask] = useState(false);

  const render = useCallback(
    (kind: SampleKind | null, uploadedUrl?: string | null) => {
      const plate = plateRef.current;
      const leaf = leafRef.current;
      if (!plate || !leaf) return;

      const pctx = plate.getContext("2d");
      const lctx = leaf.getContext("2d");
      if (!pctx || !lctx) return;

      drawPlateBackground(pctx, SIZE, SIZE);

      if (uploadedUrl) {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
          lctx.clearRect(0, 0, SIZE, SIZE);
          const scale = Math.max(SIZE / image.width, SIZE / image.height);
          const dw = image.width * scale;
          const dh = image.height * scale;
          lctx.drawImage(image, (SIZE - dw) / 2, (SIZE - dh) / 2, dw, dh);
          pctx.drawImage(leaf, 0, 0, SIZE, SIZE);
          finish(leaf);
        };
        image.onerror = () => setAnalysis(null);
        image.src = uploadedUrl;
        return;
      }

      if (!kind) return;
      drawLeaf(lctx, SIZE, SIZE, kind);
      pctx.drawImage(leaf, 0, 0, SIZE, SIZE);
      finish(leaf);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const finish = useCallback(
    (leaf: HTMLCanvasElement) => {
      const lctx = leaf.getContext("2d");
      if (!lctx) return;
      const data = lctx.getImageData(0, 0, SIZE, SIZE);

      const run = () => {
        const result = analyse(data, SIZE, SIZE);
        setAnalysis(result);
        setBusy(false);
      };

      setBusy(true);
      if (reducedMotion) {
        run();
        return;
      }
      window.setTimeout(run, 1150);
    },
    [reducedMotion],
  );

  useEffect(() => {
    seedRef.current += 1;
    render(uploaded ? null : sample, uploaded);
  }, [sample, uploaded, render]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploaded(String(reader.result));
    reader.readAsDataURL(file);
  };

  const suspiciousPixels = analysis && analysis.verdict !== "Healthy tissue";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <Panel
        label="specimen plate · 360 × 360"
        right={<span className="label">{uploaded ? "uploaded frame" : `plate ${SAMPLES.findIndex((s) => s.id === sample) + 1}/4`}</span>}
      >
        <div className="relative mx-auto w-full max-w-[360px]">
          <canvas ref={plateRef} width={SIZE} height={SIZE} className="w-full rounded-lg border border-line" />
          <canvas ref={leafRef} width={SIZE} height={SIZE} className="hidden" />

          {busy ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
              <div className="absolute inset-x-0 h-16 w-full animate-leaf-scan bg-gradient-to-b from-transparent via-chloro/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-2 text-center">
                <span className="label-signal">running inference · 340 ms target</span>
              </div>
            </div>
          ) : null}

          {mask && suspiciousPixels && !busy ? (
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-[repeating-linear-gradient(45deg,rgba(232,102,63,0.16)_0_6px,transparent_6px_12px)] ring-1 ring-rust/40" />
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label className="btn btn-ghost cursor-pointer px-3 py-2 text-[10px]">
            <ImageUp size={13} aria-hidden />
            upload leaf photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </label>
          {uploaded ? (
            <button
              type="button"
              className="btn btn-quiet px-3 py-2 text-[10px]"
              onClick={() => setUploaded(null)}
            >
              <RefreshCw size={12} aria-hidden />
              back to plates
            </button>
          ) : null}
        </div>

        <div className="mt-4">
          <Segmented
            ariaLabel="Sample specimen"
            size="sm"
            items={SAMPLES}
            value={sample}
            onChange={(id) => {
              setUploaded(null);
              setSample(id);
            }}
          />
        </div>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel
          label="diagnostic output"
          right={
            <span className={cn("chip", analysis && analysis.verdict === "Healthy tissue" ? "chip-signal" : "")}>
              {busy ? "scanning" : analysis ? `${(analysis.confidence * 100).toFixed(1)}% top class` : "idle"}
            </span>
          }
        >
          {analysis ? (
            <div className={cn("transition-opacity duration-500", busy && "opacity-40")}>
              <div className="flex items-center gap-2">
                <ScanLine size={14} style={{ color: analysis.accent }} aria-hidden />
                <span className="label">verdict</span>
              </div>
              <p className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-bone">{analysis.verdict}</p>

              <ul className="mt-5 space-y-2.5">
                {analysis.classes.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <span className="w-[132px] shrink-0 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-sage">
                      {item.label}
                    </span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-bone/10">
                      <span
                        className="block h-full rounded-full transition-[width] duration-700"
                        style={{ width: `${(item.p * 100).toFixed(1)}%`, background: item.accent }}
                      />
                    </span>
                    <span className="num w-12 shrink-0 text-right text-[11px] text-bone">
                      {(item.p * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-sage">Upload a leaf photo or pick a specimen plate to run the diagnostic.</p>
          )}
        </Panel>

        <div className="grid gap-3 sm:grid-cols-2">
          {analysis
            ? analysis.metrics.map((metric) => (
                <div key={metric.label} className="panel-flat p-4">
                  <span className="label">{metric.label}</span>
                  <p className="num mt-1.5 text-2xl text-bone" style={{ color: metric.accent }}>
                    {metric.display}
                  </p>
                  <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-bone/10">
                    <span
                      className="block h-full rounded-full transition-[width] duration-700"
                      style={{ width: `${metric.value * 100}%`, background: metric.accent }}
                    />
                  </span>
                  <p className="mt-2 text-[11px] leading-snug text-mute">{metric.hint}</p>
                </div>
              ))
            : null}
        </div>

        {analysis ? (
          <Panel label="recommended action" right={<Sparkles size={12} className="text-chloro" aria-hidden />}>
            <ul className="space-y-2">
              {analysis.advice.map((line) => (
                <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-sage">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chloro" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
              <p className="max-w-md text-[11px] leading-snug text-mute">
                Runs entirely in your browser on the pixels of this frame — a transparent approximation of the
                quantised int8 model the pod actually runs on-device. Nothing is uploaded anywhere.
              </p>
              <button
                type="button"
                className="btn btn-quiet px-3 py-2 text-[10px]"
                onClick={() => setMask((m) => !m)}
                aria-pressed={mask}
              >
                {mask ? "hide" : "highlight"} suspect regions
              </button>
            </div>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
