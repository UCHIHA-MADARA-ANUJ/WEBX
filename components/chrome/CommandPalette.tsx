"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CornerDownLeft, Download, ExternalLink, Search, Sliders } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/content/site";
import { useScrollTo } from "@/components/providers/ScrollProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { cn } from "@/lib/utils";

type Action = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon?: React.ReactNode;
  run: () => void;
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { scrollTo } = useScrollTo();
  const { calm, toggleCalm } = useSettings();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const downloadSpec = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/api/spec";
    link.download = "verde-system-spec.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, []);

  const actions = useMemo<Action[]>(() => {
    const navActions: Action[] = NAV.map((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      hint: item.blurb,
      group: "sections",
      run: () => {
        onOpenChange(false);
        scrollTo(item.id);
      },
    }));

    const utilities: Action[] = [
      {
        id: "spec",
        label: "Download system spec",
        hint: "markdown · full technical sheet",
        group: "actions",
        icon: <Download size={13} aria-hidden />,
        run: () => {
          downloadSpec();
          onOpenChange(false);
        },
      },
      {
        id: "calm",
        label: calm ? "Calm mode: turn off" : "Calm mode: turn on",
        hint: "reduces ambient motion",
        group: "actions",
        icon: <Sliders size={13} aria-hidden />,
        run: () => {
          toggleCalm();
          onOpenChange(false);
        },
      },
      {
        id: "email",
        label: "Copy contact address",
        hint: SITE.contactEmail,
        group: "actions",
        run: () => {
          void navigator.clipboard.writeText(SITE.contactEmail);
          onOpenChange(false);
        },
      },
      {
        id: "repo",
        label: "Open repository",
        hint: "github · project verde",
        group: "actions",
        icon: <ExternalLink size={13} aria-hidden />,
        run: () => {
          window.open(SITE.repo, "_blank", "noreferrer");
          onOpenChange(false);
        },
      },
      {
        id: "top",
        label: "Back to top",
        group: "actions",
        run: () => {
          onOpenChange(false);
          scrollTo(0);
        },
      },
    ];

    return [...navActions, ...utilities];
  }, [calm, downloadSpec, onOpenChange, scrollTo, toggleCalm]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter((action) => `${action.label} ${action.hint ?? ""} ${action.group}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setCursor((c) => Math.min(filtered.length - 1, c + 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
      }
      if (event.key === "Enter") {
        event.preventDefault();
        filtered[cursor]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, filtered, onOpenChange, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-void/80 px-4 pt-[12vh] backdrop-blur-md"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="panel w-full max-w-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={14} className="text-chloro" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                }}
                placeholder="Jump to a section, download the spec…"
                className="w-full bg-transparent font-mono text-[13px] text-bone outline-none placeholder:text-mute"
                aria-label="Search commands"
              />
              <span className="chip hidden sm:inline-flex">esc</span>
            </div>

            <div className="hide-scrollbar max-h-[52vh] overflow-y-auto p-2">
              {filtered.length ? (
                filtered.map((action, index) => (
                  <button
                    key={action.id}
                    type="button"
                    onMouseEnter={() => setCursor(index)}
                    onClick={action.run}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      index === cursor ? "bg-chloro/[0.09]" : "hover:bg-bone/[0.03]",
                    )}
                  >
                    <span className={cn("shrink-0", index === cursor ? "text-chloro" : "text-mute")}>
                      {action.icon ?? <ArrowRight size={13} aria-hidden />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-[13.5px]", index === cursor ? "text-bone" : "text-sage")}>
                        {action.label}
                      </span>
                      {action.hint ? <span className="block truncate text-[11px] text-mute">{action.hint}</span> : null}
                    </span>
                    <span className="label shrink-0">{action.group}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-6 text-center text-sm text-mute">No match for “{query}”.</p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              <span className="label flex items-center gap-2">
                <CornerDownLeft size={11} aria-hidden /> enter to run
              </span>
              <span className="label">↑ ↓ to move</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
