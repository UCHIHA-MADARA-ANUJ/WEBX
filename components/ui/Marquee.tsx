import { cn } from "@/lib/utils";

/** CSS marquee — duplicated track, pauses on hover, disabled under calm mode. */
export function Marquee({
  children,
  reverse = false,
  duration = 46,
  className,
  trackClassName,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div className={cn("marquee mask-fade-x relative overflow-hidden", className)}>
      <div
        className={cn("marquee-track", reverse ? "animate-marquee-rev" : "animate-marquee", trackClassName)}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
