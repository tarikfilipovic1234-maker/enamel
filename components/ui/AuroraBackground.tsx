/**
 * Fixed, decorative atmosphere layer: layered radial "aurora" blobs in the
 * brand palette + a faint grain overlay. Pure CSS, render-once, pointer-none.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-mist" />
      <div className="absolute -left-32 -top-40 h-[42rem] w-[42rem] rounded-full bg-teal-400/30 blur-3xl [animation:var(--animate-aurora)]" />
      <div className="absolute -right-40 top-10 h-[38rem] w-[38rem] rounded-full bg-turquoise-400/25 blur-3xl [animation:var(--animate-aurora)] [animation-delay:-6s]" />
      <div className="absolute bottom-[-18rem] left-1/3 h-[40rem] w-[40rem] rounded-full bg-sardinia-400/20 blur-3xl [animation:var(--animate-aurora)] [animation-delay:-11s]" />
      <div className="absolute right-1/4 top-1/2 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl [animation:var(--animate-float)]" />
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
