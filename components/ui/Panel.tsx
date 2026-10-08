import { cn } from "@/lib/utils";

export function CornerTicks({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 z-10", className)}>
      <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-line-strong" />
      <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-line-strong" />
      <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-line-strong" />
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-line-strong" />
    </div>
  );
}

export function Panel({
  children,
  className,
  label,
  right,
  ticks = true,
  interactive = false,
  padded = true,
  bodyClassName,
}: {
  children: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  right?: React.ReactNode;
  ticks?: boolean;
  interactive?: boolean;
  padded?: boolean;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("panel relative", interactive && "panel-interactive", className)}>
      {ticks ? <CornerTicks /> : null}

      {label ? (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 sm:px-5">
          <span className="label truncate">{label}</span>
          {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
        </header>
      ) : null}

      <div className={cn(padded && "p-4 sm:p-5 md:p-6", bodyClassName)}>{children}</div>
    </div>
  );
}

export function Chip({
  children,
  signal = false,
  className,
  live = false,
}: {
  children: React.ReactNode;
  signal?: boolean;
  className?: string;
  live?: boolean;
}) {
  return (
    <span className={cn("chip", signal && "chip-signal", className)}>
      {live ? <span className="dot dot-live" aria-hidden /> : null}
      {children}
    </span>
  );
}
