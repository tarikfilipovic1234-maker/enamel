import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { clinic, telHref } from "@/lib/clinic";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.contact.title, description: dict.contact.subtitle };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Only details confirmed in lib/clinic.ts are shown; the rest of the page
  // (and the form, which routes through Resend) works without them.
  const info = [
    clinic.address && {
      label: dict.contact.address,
      value: clinic.address,
      icon: "M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    },
    clinic.phone && {
      label: dict.contact.phoneLabel,
      value: clinic.phone,
      href: telHref,
      icon: "M4 5c0 8.3 6.7 15 15 15v-3.5l-4-1.5-2 2a12 12 0 0 1-6-6l2-2L7 5H4Z",
    },
    clinic.email && {
      label: dict.contact.emailLabel,
      value: clinic.email,
      href: `mailto:${clinic.email}`,
      icon: "M3 6h18v12H3z M3 7l9 6 9-6",
    },
    clinic.hours.length > 0 && {
      label: dict.contact.hours,
      value: clinic.hours.map((h) => `${h.label[lang as Locale]}: ${h.time}`).join(" · "),
      icon: "M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
    },
  ].filter((item): item is { label: string; value: string; href?: string; icon: string } =>
    Boolean(item),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading eyebrow={dict.nav.contact} title={dict.contact.title} subtitle={dict.contact.subtitle} as="h1" />

      <div
        className={`mt-14 grid gap-10 ${
          info.length > 0 ? "lg:grid-cols-[0.9fr_1.1fr]" : "mx-auto max-w-2xl"
        }`}
      >
        {info.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink">{dict.contact.infoTitle}</h2>
          {info.map((item) => (
            <div key={item.label} className="surface flex items-start gap-4 rounded-2xl p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-500/10 text-teal-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </span>
              <div>
                <div className="text-sm text-ink/50">{item.label}</div>
                {item.href ? (
                  <a href={item.href} className="font-medium text-ink hover:text-teal-700">
                    {item.value}
                  </a>
                ) : (
                  <div className="font-medium text-ink">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        <ContactForm lang={lang as Locale} dict={dict} />
      </div>

      {clinic.address && (
        <div className="mt-12 overflow-hidden rounded-xl border border-ink/10">
          <iframe
            title={clinic.address}
            src={`https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&z=16&output=embed`}
            className="block h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
