
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  invert = false,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  invert?: boolean;
  /** Use "h1" when this heading is the page title. */
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.14em] ${
            invert ? "text-white/60" : "text-teal-700"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={`mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={`mt-3 text-lg leading-relaxed ${
            invert ? "text-white/70" : "text-ink/60"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
