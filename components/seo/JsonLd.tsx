import { clinic } from "@/lib/clinic";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

/**
 * Dentist / LocalBusiness structured data.
 *
 * Search engines surface these fields directly, so only details confirmed in
 * lib/clinic.ts are emitted — an unverified address or phone number here is
 * worse than none at all.
 */
export function JsonLd({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.name,
    description: dict.footer.tagline,
    url: `${base}/${lang}`,
    address: {
      "@type": "PostalAddress",
      ...(clinic.address ? { streetAddress: clinic.address } : {}),
      addressLocality: clinic.city,
      addressCountry: "BA",
    },
  };

  if (clinic.phone) data.telephone = clinic.phone;
  if (clinic.email) data.email = clinic.email;
  if (clinic.hours.length > 0) {
    data.openingHours = clinic.hours.map((h) => `${h.schema} ${h.time.replace(/\s*–\s*/, "-")}`);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
