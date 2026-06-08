import type { Locale } from "./i18n";

/** Format a BAM (KM) price, locale-aware. */
export function formatPrice(amount: number | null | undefined, locale: Locale) {
  if (amount == null) return null;
  return new Intl.NumberFormat(locale === "bs" ? "bs-BA" : "en-US", {
    style: "currency",
    currency: "BAM",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, locale: Locale) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "bs" ? "bs-BA" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string, locale: Locale) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "bs" ? "bs-BA" : "en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
