export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="blob-1 absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="blob-2 absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="blob-3 absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-blue-700/30 blur-3xl" />
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-app-bg" />
    </div>
  )
}
