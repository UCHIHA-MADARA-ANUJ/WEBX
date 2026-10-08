/** Fixed, pointer-transparent CRT atmosphere: grid, scanlines, vignette, sweep. */
export default function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div className="absolute inset-0 crt-scan opacity-[0.35] mix-blend-overlay" />
      <div className="absolute inset-0 crt-flicker bg-phos/5" />
      <div className="absolute inset-x-0 h-[22vh] crt-sweep bg-gradient-to-b from-transparent via-phos/[0.045] to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 0%, transparent 35%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.9)]" />
    </div>
  )
}
