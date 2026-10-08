import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Section({
  id,
  children,
  className,
  top = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  top?: boolean;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 md:py-28", top && "border-t border-line", className)}>
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-7 lg:px-12">{children}</div>
    </section>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  blurb,
  aside,
  className,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  blurb?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-12 md:mb-16", className)}>
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-3">
            <span className="label-signal">{index}</span>
            <span className="h-px w-8 bg-chloro/40" aria-hidden />
            <span className="label">{eyebrow}</span>
          </div>
          {aside ? <div className="flex items-center gap-3">{aside}</div> : null}
        </div>
      </Reveal>

      <div className="rule" aria-hidden />

      <div className="grid gap-6 pt-7 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7" delay={0.05}>
          <h2 className="display text-[clamp(2.1rem,5.6vw,4.4rem)] text-bone">{title}</h2>
        </Reveal>
        {blurb ? (
          <Reveal className="lg:col-span-5 lg:pt-2" delay={0.12}>
            <div className="max-w-xl text-[15px] leading-relaxed text-sage">{blurb}</div>
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
