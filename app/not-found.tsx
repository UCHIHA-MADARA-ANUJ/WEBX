import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center px-6">
      <div className="mask-radial absolute inset-0 grid-lines opacity-60" aria-hidden />
      <div className="relative max-w-lg text-center">
        <span className="label">error 404 · no such node</span>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,6rem)] text-bone">
          Node
          <br />
          <span className="text-chloro">offline.</span>
        </h1>
        <p className="mt-5 text-[14.5px] leading-relaxed text-sage">
          The page you asked for is not on the bus. The pod kept watering while you were looking for it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            return to the compendium
          </Link>
          <a href="/api/health" className="btn btn-ghost">
            check system health
          </a>
        </div>
      </div>
    </main>
  );
}
