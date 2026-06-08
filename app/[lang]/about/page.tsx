import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.about.title, description: dict.about.subtitle };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const values = [dict.about.value1, dict.about.value2, dict.about.value3, dict.about.value4];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading eyebrow={dict.nav.about} title={dict.about.title} subtitle={dict.about.subtitle} />

      <Reveal delay={0.1}>
        <p className="mx-auto mt-12 max-w-3xl text-center text-xl leading-relaxed text-ink/70">
          {dict.about.intro}
        </p>
      </Reveal>

      <div className="mt-20 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-[var(--radius-card)] p-8">
            <h2 className="font-display text-2xl font-semibold text-ink">{dict.about.missionTitle}</h2>
            <p className="mt-4 leading-relaxed text-ink/65">{dict.about.missionText}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-[var(--radius-card)] bg-sardinia-900 p-8 text-white">
            <h2 className="font-display text-2xl font-semibold">{dict.about.valuesTitle}</h2>
            <ul className="mt-6 space-y-4">
              {values.map((v) => (
                <li key={v} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </span>
                  <span className="text-white/85">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 text-center">
          <LinkButton href={`/${lang}/appointment`} size="lg" transitionTypes={["nav-forward"]}>
            {dict.common.bookNow}
          </LinkButton>
        </div>
      </Reveal>
    </div>
  );
}
