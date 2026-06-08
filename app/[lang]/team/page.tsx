import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getActiveStaff } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { StaffCard } from "@/components/sections/StaffCard";

export async function generateMetadata({ params }: PageProps<"/[lang]/team">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.team.title, description: dict.team.subtitle };
}

export default async function TeamPage({ params }: PageProps<"/[lang]/team">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const staff = await getActiveStaff();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading eyebrow={dict.nav.team} title={dict.team.title} subtitle={dict.team.subtitle} />

      {staff.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((m, i) => (
            <Reveal key={m.id} delay={(i % 3) * 0.07}>
              <StaffCard staff={m} lang={lang as Locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-ink/50">{dict.team.empty}</p>
      )}
    </div>
  );
}
