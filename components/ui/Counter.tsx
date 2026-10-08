"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, display } = useCountUp(to, decimals);

  return (
    <span ref={ref} className={cn("num", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
