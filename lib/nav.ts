import type { Dictionary } from "./dictionaries";
import type { Locale } from "./i18n";

export type NavItem = { href: string; label: string };

/** Public navigation, localized + locale-prefixed. */
export function mainNav(lang: Locale, dict: Dictionary): NavItem[] {
  return [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/team`, label: dict.nav.team },
    { href: `/${lang}/testimonials`, label: dict.nav.testimonials },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];
}

export const localePath = (lang: Locale, path = "") =>
  `/${lang}${path ? (path.startsWith("/") ? path : `/${path}`) : ""}`;
