import { getDictionary } from "@/lib/dictionaries";
import { cardGrid } from "@/lib/layout";
import type { Locale } from "@/lib/i18n";
import { getActiveServices, getActiveStaff, getApprovedTestimonials } from "@/lib/data";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { StaffCard } from "@/components/sections/StaffCard";
import { TestimonialCard } from "@/components/sections/TestimonialCard";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const [services, staff, testimonials] = await Promise.all([
    getActiveServices(),
    getActiveStaff(),
    getApprovedTestimonials(),
  ]);

  const why = [
    { t: dict.home.why1Title, d: dict.home.why1Text, icon: "M12 2 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-5Z" },
    { t: dict.home.why2Title, d: dict.home.why2Text, icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" },
    { t: dict.home.why3Title, d: dict.home.why3Text, icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" },
    { t: dict.home.why4Title, d: dict.home.why4Text, icon: "M3 12h4l2 7 4-14 2 7h4" },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-20">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href={`/${lang}/appointment`} size="lg" transitionTypes={["nav-forward"]}>
              {dict.home.heroCtaPrimary}
            </LinkButton>
            <LinkButton href={`/${lang}/services`} variant="outline" size="lg" transitionTypes={["nav-forward"]}>
              {dict.home.heroCtaSecondary}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Services */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          eyebrow={dict.nav.services}
          title={dict.home.servicesTitle}
          subtitle={dict.home.servicesSubtitle}
        />
        {services.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} lang={lang as Locale} dict={dict} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-ink/50">{dict.services.empty}</p>
        )}
        <div className="mt-10 text-center">
          <LinkButton href={`/${lang}/services`} variant="ghost" transitionTypes={["nav-forward"]}>
            {dict.common.viewAll}
          </LinkButton>
        </div>
      </section>

      {/* --------------------------------------------------------------- Why us */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading title={dict.home.whyTitle} subtitle={dict.home.whySubtitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <div key={w.t} className="surface h-full rounded-[var(--radius-card)] p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-500/10 text-teal-700">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d={w.icon} />
                </svg>
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{w.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- Team */}
      {staff.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow={dict.nav.team} title={dict.home.teamTitle} subtitle={dict.home.teamSubtitle} />
          <div className={`mt-12 grid gap-6 ${cardGrid(Math.min(staff.length, 3))}`}>
            {staff.slice(0, 3).map((m) => (
              <StaffCard key={m.id} staff={m} lang={lang as Locale} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------- Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeading eyebrow={dict.nav.testimonials} title={dict.testimonials.title} subtitle={dict.testimonials.subtitle} />
          <div className={`mt-12 grid gap-6 ${cardGrid(Math.min(testimonials.length, 3))}`}>
            {testimonials.slice(0, 3).map((tm) => (
              <TestimonialCard key={tm.id} testimonial={tm} lang={lang as Locale} />
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-8">
        <div className="rounded-[var(--radius-card)] bg-sardinia-900 px-8 py-14 text-center sm:px-16">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {dict.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">{dict.home.ctaText}</p>
          <div className="mt-8">
            <LinkButton
              href={`/${lang}/appointment`}
              size="lg"
              variant="ghost"
              className="bg-white text-teal-800 hover:bg-white/90"
              transitionTypes={["nav-forward"]}
            >
              {dict.common.bookNow}
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
