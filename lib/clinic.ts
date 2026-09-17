import type { Locale } from "./i18n";

/**
 * The clinic's real-world details, in one place.
 *
 * Everything here is published: contact page, footer, and the Dentist
 * structured data read from this file. Values must be verified with the clinic
 * before they go in. An empty value is not a bug — every surface below checks
 * for content first and omits the row entirely, so the site never shows a
 * guessed address or an unreachable phone number.
 */

export type OpeningHours = {
  /** schema.org day token, e.g. "Mo-Fr" or "Sa". */
  schema: string;
  label: Record<Locale, string>;
  /** Local time range, e.g. "09:00 – 17:00". */
  time: string;
};

export type Clinic = {
  name: string;
  city: string;
  country: Record<Locale, string>;
  /** Street address including postal code, e.g. "Ferhadija 1, 71000 Sarajevo". */
  address: string;
  /** Display format, e.g. "+387 33 000 000". The tel: link is derived from it. */
  phone: string;
  email: string;
  /** Consulting hours. Leave empty until confirmed; the footer/contact rows hide. */
  hours: OpeningHours[];
  /**
   * Registered business name and ID, shown in the Privacy Policy and Terms as
   * the data controller / contracting party. Required before launch.
   */
  legalName: string;
  legalId: string;
};

export const clinic: Clinic = {
  name: "Enamel",
  city: "Sarajevo",
  country: { bs: "Bosna i Hercegovina", en: "Bosnia and Herzegovina" },

  address: "",
  phone: "",
  email: "",

  hours: [],

  legalName: "",
  legalId: "",
};

/** Digits-only phone for `tel:` hrefs. Empty when no number is configured. */
export const telHref = clinic.phone ? `tel:${clinic.phone.replace(/[^\d+]/g, "")}` : "";
