import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getActiveServices } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/sections/ServiceCard";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.services.title, description: dict.services.subtitle };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const services = await getActiveServices();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading eyebrow={dict.nav.services} title={dict.services.title} subtitle={dict.services.subtitle} />

      {services.length > 0 ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.06}>
              <ServiceCard service={s} lang={lang as Locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-ink/50">{dict.services.empty}</p>
      )}
    </div>
  );
}
