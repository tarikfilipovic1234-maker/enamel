import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/** Enamel wordmark with an enamel-drop mark. */
export function Logo({
  lang,
  className = "",
  invert = false,
}: {
  lang: Locale;
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      href={`/${lang}`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Enamel"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-[var(--shadow-glow)] transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* stylized tooth / drop */}
          <path d="M12 3c3.5 0 6 2.4 6 6 0 3.2-1.2 5-2 8-.5 1.9-1.2 4-4 4s-3.5-2.1-4-4c-.8-3-2-4.8-2-8 0-3.6 2.5-6 6-6Z" />
          <path d="M9.5 9.5c.8-.9 4.2-.9 5 0" className="opacity-70" />
        </svg>
      </span>
      <span
        className={`font-display text-2xl font-semibold tracking-tight ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        Enamel
      </span>
    </Link>
  );
}
