"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, Cpu, MoveHorizontal } from "lucide-react";
import {
  ARCH_EDGES,
  ARCH_NODES,
  ARCH_VIEWBOX,
  EDGE_LEGEND,
  type ArchEdge,
  type ArchNode,
  type EdgeRoute,
  type NodeKind,
} from "@/lib/content/system";
import { cn } from "@/lib/utils";
import { useSettings } from "@/components/providers/SettingsProvider";

const KIND_META: Record<NodeKind, string> = {
  sense: "sensing",
  edge: "edge core",
  actuate: "actuation",
  cloud: "cloud",
  human: "human",
};

const EDGE_COLOR: Record<ArchEdge["kind"], string> = {
  sense: "#3fe08c",
  control: "#3fe08c",
  uplink: "#5fe3d6",
  command: "#b98cff",
};

const EDGE_DASH: Record<ArchEdge["kind"], string | undefined> = {
  sense: undefined,
  control: undefined,
  uplink: "7 7",
  command: "2 7",
};

const NODE_BY_ID = Object.fromEntries(ARCH_NODES.map((node) => [node.id, node])) as Record<string, ArchNode>;

/**
 * The diagram is authored in a fixed 1420 × 760 coordinate space. Nodes are
 * absolutely positioned as a percentage of that space, so node geometry scales
 * with the container while their type stays at a legible fixed size — which is
 * why the container keeps the same aspect ratio as the viewBox.
 */
const MIN_WIDTH = 1080;

const centre = (node: ArchNode) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 });

/** Cable dressing: straight bezier for neighbours, corridor routes for long hauls. */
function routePath(edge: ArchEdge): string {
  const from = NODE_BY_ID[edge.from];
  const to = NODE_BY_ID[edge.to];
  if (!from || !to) return "";

  const a = centre(from);
  const b = centre(to);
  const route: EdgeRoute = edge.route ?? "auto";
  const round = 16;

  if (route === "auto") {
    const forward = b.x >= a.x;
    const sx = a.x + (forward ? from.w / 2 : -from.w / 2);
    const ex = b.x + (forward ? -to.w / 2 : to.w / 2);
    const mid = (sx + ex) / 2;
    return `M${sx},${a.y} C${mid},${a.y} ${mid},${b.y} ${ex},${b.y}`;
  }

  const dir = b.x >= a.x ? 1 : -1;

  if (route === "top") {
    const y = edge.offset ?? 110;
    return [
      `M${a.x},${from.y}`,
      `L${a.x},${y + round}`,
      `Q${a.x},${y} ${a.x + dir * round},${y}`,
      `L${b.x - dir * round},${y}`,
      `Q${b.x},${y} ${b.x},${y + round}`,
      `L${b.x},${to.y}`,
    ].join(" ");
  }

  if (route === "bottom") {
    const y = edge.offset ?? 700;
    return [
      `M${a.x},${from.y + from.h}`,
      `L${a.x},${y - round}`,
      `Q${a.x},${y} ${a.x + dir * round},${y}`,
      `L${b.x - dir * round},${y}`,
      `Q${b.x},${y} ${b.x},${y - round}`,
      `L${b.x},${to.y + to.h}`,
    ].join(" ");
  }

  const x = edge.offset ?? 1200;
  const vertical = b.y >= a.y ? 1 : -1;
  return [
    `M${from.x + from.w},${a.y}`,
    `L${x - round},${a.y}`,
    `Q${x},${a.y} ${x},${a.y + vertical * round}`,
    `L${x},${b.y - vertical * round}`,
    `Q${x},${b.y} ${x - round},${b.y}`,
    `L${to.x + to.w},${b.y}`,
  ].join(" ");
}

const ALL_KINDS = ["sense", "control", "uplink", "command"] as const;

export function SystemMap() {
  const { ambient } = useSettings();
  const [selected, setSelected] = useState<string>("edge");
  const [focus, setFocus] = useState<string | null>(null);
  const [kinds, setKinds] = useState<Set<ArchEdge["kind"]>>(() => new Set(ALL_KINDS));

  const paths = useMemo(() => ARCH_EDGES.map((edge) => ({ edge, d: routePath(edge) })), []);
  const node = NODE_BY_ID[selected] ?? NODE_BY_ID.edge;

  const dimmed = (edge: ArchEdge) => {
    if (!kinds.has(edge.kind)) return true;
    if (focus && edge.from !== focus && edge.to !== focus) return true;
    return false;
  };

  const toggleKind = (kind: ArchEdge["kind"]) => {
    setKinds((current) => {
      const next = new Set(current);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next.size ? next : new Set([kind]);
    });
  };

  return (
    <div className="space-y-4">
      {/* ── diagram ────────────────────────────────────────────────────────── */}
      <div className="panel relative overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <span className="flex items-center gap-2">
            <Cpu size={13} className="text-chloro" aria-hidden />
            <span className="label">signal path · sensing → edge → action</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {EDGE_LEGEND.map((item) => {
              const on = kinds.has(item.kind);
              return (
                <button
                  key={item.kind}
                  type="button"
                  onClick={() => toggleKind(item.kind)}
                  aria-pressed={on}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors",
                    on ? "border-line text-sage" : "border-line/60 text-mute/60",
                  )}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: on ? item.color : "rgba(241,244,238,0.2)" }}
                    aria-hidden
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="hide-scrollbar overflow-x-auto overscroll-x-contain">
          <div
            className="relative"
            style={{ minWidth: MIN_WIDTH, aspectRatio: `${ARCH_VIEWBOX.w} / ${ARCH_VIEWBOX.h}` }}
          >
            <svg
              viewBox={`0 0 ${ARCH_VIEWBOX.w} ${ARCH_VIEWBOX.h}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="System architecture: sensors feed the edge controller, which drives local actuators and reports to the cloud"
            >
              <defs>
                {ALL_KINDS.map((kind) => (
                  <marker
                    key={kind}
                    id={`arrow-${kind}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill={EDGE_COLOR[kind]} fillOpacity="0.75" />
                  </marker>
                ))}
              </defs>

              {paths.map(({ edge, d }) => {
                const dim = dimmed(edge);
                const color = EDGE_COLOR[edge.kind];
                return (
                  <g key={`${edge.from}-${edge.to}`} opacity={dim ? 0.15 : 1} style={{ transition: "opacity 400ms" }}>
                    <path
                      d={d}
                      fill="none"
                      stroke={color}
                      strokeOpacity={0.42}
                      strokeWidth={1}
                      strokeDasharray={EDGE_DASH[edge.kind]}
                      markerEnd={`url(#arrow-${edge.kind})`}
                      vectorEffect="non-scaling-stroke"
                    />
                    {ambient && !dim ? (
                      <>
                        <circle r={2.6} fill={color}>
                          <animateMotion dur={`${4 + (edge.label?.length ?? 3) * 0.4}s`} repeatCount="indefinite" path={d} />
                        </circle>
                        <circle r={1.6} fill={color} opacity={0.6}>
                          <animateMotion
                            dur={`${4 + (edge.label?.length ?? 3) * 0.4}s`}
                            begin="1.6s"
                            repeatCount="indefinite"
                            path={d}
                          />
                        </circle>
                      </>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            {ARCH_NODES.map((item) => {
              const isSelected = selected === item.id;
              const isFocused = focus === item.id;
              const isDim = focus != null && !isFocused && !ARCH_EDGES.some(
                (edge) => (edge.from === focus && edge.to === item.id) || (edge.to === focus && edge.from === item.id),
              );
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setFocus(item.id)}
                  onMouseLeave={() => setFocus(null)}
                  onFocus={() => setFocus(item.id)}
                  onBlur={() => setFocus(null)}
                  onClick={() => setSelected(item.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group absolute flex flex-col justify-between gap-1 overflow-hidden rounded-lg border px-2.5 py-2 text-left transition-all duration-300",
                    isSelected
                      ? "border-chloro/70 bg-chloro/[0.1]"
                      : "border-line bg-[#080d09]/90 hover:border-chloro/40 hover:bg-[#0b120d]",
                    isDim && "opacity-45",
                  )}
                  style={{
                    left: `${(item.x / ARCH_VIEWBOX.w) * 100}%`,
                    top: `${(item.y / ARCH_VIEWBOX.h) * 100}%`,
                    width: `${(item.w / ARCH_VIEWBOX.w) * 100}%`,
                    height: `${(item.h / ARCH_VIEWBOX.h) * 100}%`,
                    boxShadow: isSelected || isFocused ? `0 0 26px -10px ${item.accent}` : undefined,
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}` }}
                      aria-hidden
                    />
                    <span className="truncate font-mono text-[8.5px] uppercase tracking-[0.14em] text-mute">
                      {KIND_META[item.kind]}
                    </span>
                  </span>
                  <span className="block font-display text-[12px] font-medium leading-[1.15] tracking-[-0.015em] text-bone">
                    {item.title}
                  </span>
                  <span className="truncate font-mono text-[8.5px] tracking-[0.06em] text-sage/70">{item.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2.5">
          <span className="label">
            {ARCH_NODES.length} blocks · {ARCH_EDGES.length} links · select any block
          </span>
          <span className="label flex items-center gap-2 xl:hidden">
            <MoveHorizontal size={11} aria-hidden />
            drag to pan the diagram
          </span>
          <span className="label hidden xl:block">animated dots mark packet flow</span>
        </footer>
      </div>

      {/* ── detail strip ───────────────────────────────────────────────────── */}
      <div className="panel grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="dot" style={{ background: node.accent }} aria-hidden />
            <span className="label">{KIND_META[node.kind]}</span>
            <span className="label text-mute">· selected block</span>
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-bone sm:text-3xl">
            {node.title}
          </h3>
          <p className="mt-1 font-mono text-[11.5px] text-chloro">{node.code}</p>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-sage">{node.summary}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <span className="label">specification</span>
            <ul className="mt-3 space-y-2">
              {node.specs.map((spec) => (
                <li key={spec} className="flex items-start gap-2 text-[12.5px] leading-snug text-sage">
                  <ArrowRight size={11} className="mt-1 shrink-0 text-chloro/60" aria-hidden />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="inset-well p-3.5">
              <span className="label">{node.metric.label}</span>
              <p className="num mt-1 text-2xl text-bone">{node.metric.value}</p>
            </div>
            <div className="flex items-center gap-2 text-mute">
              <Activity size={12} className="text-chloro" aria-hidden />
              <span className="label">click another block to compare</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
