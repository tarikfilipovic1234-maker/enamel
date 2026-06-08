import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { t, type Locale } from "@/lib/i18n";
import { getActiveServices, getActiveStaff } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { AppointmentForm } from "@/components/forms/AppointmentForm";

export async function generateMetadata({ params }: PageProps<"/[lang]/appointment">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.appointment.title, description: dict.appointment.subtitle };
}

export default async function AppointmentPage({
  params,
  searchParams,
}: PageProps<"/[lang]/appointment">) {
  const { lang } = await params;
  const { service } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const [services, staff] = await Promise.all([getActiveServices(), getActiveStaff()]);

  const serviceOpts = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: t(s.name, lang as Locale),
    durationMin: s.durationMin,
  }));
  const staffOpts = staff.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <SectionHeading eyebrow={dict.nav.book} title={dict.appointment.title} subtitle={dict.appointment.subtitle} />
      <Reveal delay={0.1}>
        <div className="mt-12">
          <AppointmentForm
            lang={lang as Locale}
            dict={dict}
            services={serviceOpts}
            staff={staffOpts}
            initialServiceSlug={typeof service === "string" ? service : undefined}
          />
        </div>
      </Reveal>
    </div>
  );
}
