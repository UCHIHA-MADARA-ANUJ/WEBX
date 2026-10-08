"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

/** Segmented control with proper tab semantics and arrow-key support. */
export function Segmented<T extends string>({
  items,
  value,
  onChange,
  className,
  ariaLabel,
  size = "md",
}: {
  items: { id: T; label: string; hint?: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const index = items.findIndex((item) => item.id === value);
      const nextIndex = event.key === "ArrowRight" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
      onChange(items[nextIndex].id);
      const buttons = ref.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
      buttons?.[nextIndex]?.focus();
    },
    [items, onChange, value],
  );

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn("inline-flex rounded-full border border-line bg-panel/70 p-1 backdrop-blur", className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            title={item.hint}
            className={cn(
              "relative rounded-full font-mono uppercase tracking-[0.14em] transition-all duration-400",
              size === "sm" ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-[10.5px]",
              selected ? "bg-chloro text-[#04120a]" : "text-sage hover:text-bone",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  hint,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn("group flex w-full items-center gap-3 text-left", className)}
    >
      <span
        className={cn(
          "relative h-[18px] w-[34px] shrink-0 rounded-full border transition-colors duration-300",
          checked ? "border-chloro/60 bg-chloro/25" : "border-line bg-raise",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] h-[12px] w-[12px] rounded-full transition-all duration-300",
            checked ? "left-[18px] bg-chloro shadow-[0_0_10px_rgba(63,224,140,0.7)]" : "left-[2px] bg-mute",
          )}
        />
      </span>
      <span className="min-w-0">
        <span className={cn("block text-[13px] transition-colors", checked ? "text-bone" : "text-sage group-hover:text-bone")}>
          {label}
        </span>
        {hint ? <span className="label mt-0.5 block normal-case tracking-[0.08em] text-mute">{hint}</span> : null}
      </span>
    </button>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  accent = "#3fe08c",
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  display?: string;
  accent?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="label">{label}</span>
        <span className="num text-sm text-bone" style={{ color: accent }}>
          {display ?? value}
        </span>
      </span>
      <input
        type="range"
        className="range mt-1"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
