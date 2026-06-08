// Locale configuration + helpers shared across server and client.

export const locales = ["bs", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bs";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Localized text shape stored in JSON DB columns. */
export type Localized = Partial<Record<Locale, string>>;

/** Read a localized value with graceful fallback to the default locale. */
export function t(value: unknown, locale: Locale): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  const map = value as Localized;
  return map[locale] ?? map[defaultLocale] ?? Object.values(map)[0] ?? "";
}

export const localeNames: Record<Locale, string> = {
  bs: "Bosanski",
  en: "English",
};
