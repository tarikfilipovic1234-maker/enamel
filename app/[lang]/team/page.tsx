import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { cardGrid } from "@/lib/layout";
import type { Locale } from "@/lib/i18n";
import { getActiveStaff } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
      <SectionHeading title={dict.team.title} subtitle={dict.team.subtitle} as="h1" />

      {staff.length > 0 ? (
        <div className={`mt-12 grid gap-6 ${cardGrid(staff.length)}`}>
          {staff.map((m) => (
            <StaffCard key={m.id} staff={m} lang={lang as Locale} dict={dict} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-ink/50">{dict.team.empty}</p>
      )}
    </div>
  );
}
