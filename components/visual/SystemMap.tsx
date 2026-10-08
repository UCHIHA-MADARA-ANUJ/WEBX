"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, Cpu } from "lucide-react";
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

const KIND_META: Record<NodeKind, { label: string }> = {
  sense: { label: "Sensing" },
  edge: { label: "Edge core" },
  actuate: { label: "Actuation" },
  cloud: { label: "Cloud" },
  human: { label: "Human" },
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

function centre(node: ArchNode) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
}

/** Cable dressing — straight bezier for neighbours, corridor routes for the long hauls. */
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

  if (route === "top") {
    const y = edge.offset ?? 110;
    const dir = b.x >= a.x ? 1 : -1;
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
    const dir = b.x >= a.x ? 1 : -1;
    return [
      `M${a.x},${from.y + from.h}`,
      `L${a.x},${y - round}`,
      `Q${a.x},${y} ${a.x + dir * round},${y}`,
      `L${b.x - dir * round},${y}`,
      `Q${b.x},${y} ${b.x},${y - round}`,
      `L${b.x},${to.y + to.h}`,
    ].join(" ");
  }

  // right-hand vertical bus
  const x = edge.offset ?? 1200;
  const dir = b.y >= a.y ? 1 : -1;
  return [
    `M${from.x + from.w},${a.y}`,
    `L${x - round},${a.y}`,
    `Q${x},${a.y} ${x},${a.y + dir * round}`,
    `L${x},${b.y - dir * round}`,
    `Q${x},${b.y} ${x - round},${b.y}`,
    `L${to.x + to.w},${b.y}`,
  ].join(" ");
}

export function SystemMap() {
  const { ambient } = useSettings();
  const [selected, setSelected] = useState<string | null>("edge");
  const [focus, setFocus] = useState<string | null>(null);
  const [kinds, setKinds] = useState<Set<ArchEdge["kind"]>>(
    () => new Set(["sense", "control", "uplink", "command"]),
  );

  const paths = useMemo(() => ARCH_EDGES.map((edge) => ({ edge, d: routePath(edge) })), []);
  const activeNode = selected ? NODE_BY_ID[selected] : null;

  const isDimmed = (edge: ArchEdge) => {
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="panel relative overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <Cpu size={13} className="text-chloro" aria-hidden />
            <span className="label">signal path · sensing → edge → action</span>
          </div>
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

        <div className="hide-scrollbar overflow-x-auto">
          <div
            className="relative"
            style={{ minWidth: 1080, aspectRatio: `${ARCH_VIEWBOX.w} / ${ARCH_VIEWBOX.h}` }}
          >
            <svg
              viewBox={`0 0 ${ARCH_VIEWBOX.w} ${ARCH_VIEWBOX.h}`}
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="System architecture diagram"
            >
              <defs>
                {(["sense", "control", "uplink", "command"] as const).map((kind) => (
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
                const dim = isDimmed(edge);
                const color = EDGE_COLOR[edge.kind];
                return (
                  <g key={`${edge.from}-${edge.to}`} opacity={dim ? 0.16 : 1} style={{ transition: "opacity 400ms" }}>
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

            {ARCH_NODES.map((node) => {
              const isSelected = selected === node.id;
              const isFocused = focus === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setFocus(node.id)}
                  onMouseLeave={() => setFocus(null)}
                  onFocus={() => setFocus(node.id)}
                  onBlur={() => setFocus(null)}
                  onClick={() => setSelected(node.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group absolute rounded-lg border px-2.5 py-2 text-left transition-all duration-400",
                    isSelected
                      ? "border-chloro/70 bg-chloro/[0.09]"
                      : "border-line bg-[#080d09]/85 hover:border-chloro/40 hover:bg-[#0b120d]",
                  )}
                  style={{
                    left: `${(node.x / ARCH_VIEWBOX.w) * 100}%`,
                    top: `${(node.y / ARCH_VIEWBOX.h) * 100}%`,
                    width: `${(node.w / ARCH_VIEWBOX.w) * 100}%`,
                    height: `${(node.h / ARCH_VIEWBOX.h) * 100}%`,
                    boxShadow: isSelected || isFocused ? `0 0 26px -10px ${node.accent}` : undefined,
                  }}
                >
                  <span className="flex h-full flex-col justify-between gap-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: node.accent, boxShadow: `0 0 8px ${node.accent}` }}
                        aria-hidden
                      />
                      <span className="truncate font-mono text-[8.5px] uppercase tracking-[0.12em] text-mute">
                        {KIND_META[node.kind].label}
                      </span>
                    </span>
                    <span className="line-clamp-2 block font-display text-[11.5px] font-medium leading-[1.15] tracking-[-0.01em] text-bone">
                      {node.title}
                    </span>
                    <span className="truncate font-mono text-[8.5px] tracking-[0.08em] text-sage/70">{node.code}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
          <span className="label">
            {ARCH_NODES.length} blocks · {ARCH_EDGES.length} links · tap any block
          </span>
          <span className="label hidden sm:block">viewbox {ARCH_VIEWBOX.w}×{ARCH_VIEWBOX.h}</span>
        </div>
      </div>

      {/* detail */}
      <aside className="panel h-fit p-5 lg:sticky lg:top-24">
        {activeNode ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="dot" style={{ background: activeNode.accent }} aria-hidden />
              <span className="label">{KIND_META[activeNode.kind].label}</span>
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-bone">
              {activeNode.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-chloro">{activeNode.code}</p>

            <p className="mt-4 text-[13.5px] leading-relaxed text-sage">{activeNode.summary}</p>

            <div className="mt-5 inset-well p-3">
              <span className="label">{activeNode.metric.label}</span>
              <p className="num mt-1 text-xl text-bone">{activeNode.metric.value}</p>
            </div>

            <ul className="mt-5 space-y-2">
              {activeNode.specs.map((spec) => (
                <li key={spec} className="flex items-start gap-2 text-[12.5px] text-sage">
                  <ArrowRight size={11} className="mt-1 shrink-0 text-chloro/60" aria-hidden />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-sage">Select a block to read its spec.</p>
        )}

        <div className="mt-6 flex items-center gap-2 border-t border-line pt-4">
          <Activity size={12} className="text-chloro" aria-hidden />
          <span className="label">animations mark packet flow</span>
        </div>
      </aside>
    </div>
  );
}
