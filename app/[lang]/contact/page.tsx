import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.contact.title, description: dict.contact.subtitle };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const info = [
    { label: dict.contact.address, value: dict.contact.addressValue, icon: "M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11Z M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" },
    { label: dict.contact.phoneLabel, value: dict.contact.phoneValue, href: `tel:${dict.contact.phoneValue.replace(/\s/g, "")}`, icon: "M4 5c0 8.3 6.7 15 15 15v-3.5l-4-1.5-2 2a12 12 0 0 1-6-6l2-2L7 5H4Z" },
    { label: dict.contact.emailLabel, value: dict.contact.emailValue, href: `mailto:${dict.contact.emailValue}`, icon: "M3 6h18v12H3z M3 7l9 6 9-6" },
    { label: dict.contact.hours, value: dict.contact.hoursValue, icon: "M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading eyebrow={dict.nav.contact} title={dict.contact.title} subtitle={dict.contact.subtitle} />

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-ink">{dict.contact.infoTitle}</h2>
            {info.map((item) => (
              <div key={item.label} className="glass flex items-start gap-4 rounded-2xl p-5">
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
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm lang={lang as Locale} dict={dict} />
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="glass mt-12 overflow-hidden rounded-[var(--radius-card)] p-1.5">
          <iframe
            title={dict.contact.addressValue}
            src="https://www.google.com/maps?q=Ferhadija%201%2C%20Sarajevo%2C%20Bosnia%20and%20Herzegovina&z=16&output=embed"
            className="h-[420px] w-full rounded-[1.2rem] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </Reveal>
    </div>
  );
}
