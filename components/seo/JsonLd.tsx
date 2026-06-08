import type { Dictionary } from "@/lib/dictionaries";

/** Dentist / LocalBusiness structured data for rich search results. */
export function JsonLd({ dict }: { dict: Dictionary }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Enamel",
    description: dict.footer.tagline,
    url: base,
    telephone: dict.contact.phoneValue,
    email: dict.contact.emailValue,
    address: {
      "@type": "PostalAddress",
      streetAddress: dict.contact.addressValue,
      addressLocality: "Sarajevo",
      addressCountry: "BA",
    },
    openingHours: "Mo-Fr 09:00-19:00, Sa 09:00-14:00",
    priceRange: "$$",
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
