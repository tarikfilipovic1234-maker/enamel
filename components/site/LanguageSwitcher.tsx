"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

/** Swaps the locale segment of the current path, preserving the rest. */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;

  function swap(locale: Locale) {
    const segments = pathname.split("/");
    // segments[0] === "" ; segments[1] === locale
    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = locale;
    } else {
      segments.splice(1, 0, locale);
    }
    return segments.join("/") || `/${locale}`;
  }

  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-ink/15 text-xs font-semibold">
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={swap(locale)}
            aria-current={active ? "true" : undefined}
            className={`px-2.5 py-1.5 uppercase transition-colors ${
              active ? "bg-teal-700 text-white" : "bg-white text-ink/60 hover:bg-mist hover:text-ink"
            }`}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
