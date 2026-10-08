"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[verde] render failure:", error);
  }, [error]);

  return (
    <main className="relative grid min-h-dvh place-items-center px-6">
      <div className="mask-radial absolute inset-0 grid-lines opacity-60" aria-hidden />
      <div className="relative max-w-lg text-center">
        <span className="label flex items-center justify-center gap-2">
          <TriangleAlert size={12} className="text-rust" aria-hidden />
          fault latched · pod unaffected
        </span>
        <h1 className="display mt-4 text-[clamp(2.4rem,8vw,4.6rem)] text-bone">
          Interface
          <br />
          <span className="text-rust">fault.</span>
        </h1>
        <p className="mt-5 text-[14.5px] leading-relaxed text-sage">
          The dashboard threw an error. This is exactly the kind of failure the pods are built to survive — the
          controller on the shelf is still running its own loop, offline, unbothered.
        </p>
        {error.digest ? <p className="label mt-4">digest {error.digest}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-primary" onClick={reset}>
            <RefreshCw size={14} aria-hidden />
            re-initialise
          </button>
          <a href="/api/health" className="btn btn-ghost">
            check system health
          </a>
        </div>
      </div>
    </main>
  );
}
