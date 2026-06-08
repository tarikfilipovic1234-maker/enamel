import { getDictionary } from "@/lib/dictionaries";
import { type Locale, t } from "@/lib/i18n";
import { getActiveServices, getActiveStaff, getApprovedTestimonials } from "@/lib/data";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
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

  const stats = [
    { value: "12k+", label: dict.home.statsPatients },
    { value: "15+", label: dict.home.statsExperience },
    { value: "20+", label: dict.home.statsServices },
  ];

  const why = [
    { t: dict.home.why1Title, d: dict.home.why1Text, icon: "M12 2 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-5Z" },
    { t: dict.home.why2Title, d: dict.home.why2Text, icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" },
    { t: dict.home.why3Title, d: dict.home.why3Text, icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" },
    { t: dict.home.why4Title, d: dict.home.why4Text, icon: "M3 12h4l2 7 4-14 2 7h4" },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-12 pt-10 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-500" />
                {dict.home.heroBadge}
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {dict.home.heroTitle.split(" ").slice(0, -2).join(" ")}{" "}
                <span className="text-gradient">
                  {dict.home.heroTitle.split(" ").slice(-2).join(" ")}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
                {dict.home.heroSubtitle}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <LinkButton href={`/${lang}/appointment`} size="lg" transitionTypes={["nav-forward"]}>
                  {dict.home.heroCtaPrimary}
                </LinkButton>
                <LinkButton href={`/${lang}/services`} variant="outline" size="lg" transitionTypes={["nav-forward"]}>
                  {dict.home.heroCtaSecondary}
                </LinkButton>
              </div>
            </Reveal>
          </div>

          {/* Hero visual: floating glass panel */}
          <Reveal delay={0.2} y={40}>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-brand-gradient opacity-20 blur-3xl" />
              <div className="glass relative aspect-[4/5] overflow-hidden rounded-[2.5rem] p-1">
                <div className="flex h-full flex-col justify-between rounded-[2.2rem] bg-gradient-to-br from-sardinia-800 via-teal-700 to-turquoise-500 p-8 text-white">
                  <div className="flex justify-between">
                    <span className="font-display text-2xl font-semibold">Enamel</span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                      Sarajevo
                    </span>
                  </div>
                  <svg viewBox="0 0 24 24" className="mx-auto h-28 w-28 opacity-90 [animation:var(--animate-float)]" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3c3.5 0 6 2.4 6 6 0 3.2-1.2 5-2 8-.5 1.9-1.2 4-4 4s-3.5-2.1-4-4c-.8-3-2-4.8-2-8 0-3.6 2.5-6 6-6Z" />
                    <path d="M9.5 9.5c.8-.9 4.2-.9 5 0" />
                  </svg>
                  <p className="text-center text-sm uppercase tracking-[0.3em] text-white/70">
                    {dict.splash.tagline}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <Reveal delay={0.1}>
          <div className="glass mt-16 grid grid-cols-3 divide-x divide-teal-900/10 rounded-[var(--radius-card)] py-8">
            {stats.map((s) => (
              <div key={s.label} className="px-4 text-center">
                <div className="font-display text-3xl font-semibold text-gradient sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-ink/50 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Services */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          eyebrow={dict.nav.services}
          title={dict.home.servicesTitle}
          subtitle={dict.home.servicesSubtitle}
        />
        {services.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <ServiceCard service={s} lang={lang as Locale} dict={dict} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-ink/50">{dict.services.empty}</p>
        )}
        <div className="mt-10 text-center">
          <LinkButton href={`/${lang}/services`} variant="ghost" transitionTypes={["nav-forward"]}>
            {dict.common.viewAll} →
          </LinkButton>
        </div>
      </section>

      {/* --------------------------------------------------------------- Why us */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading eyebrow={dict.home.whyTitle} title={dict.home.whyTitle} subtitle={dict.home.whySubtitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w, i) => (
            <Reveal key={w.t} delay={i * 0.07}>
              <div className="glass h-full rounded-[var(--radius-card)] p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-500/10 text-teal-700">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={w.icon} />
                  </svg>
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{w.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- Team */}
      {staff.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.team} title={dict.home.teamTitle} subtitle={dict.home.teamSubtitle} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.slice(0, 3).map((m, i) => (
              <Reveal key={m.id} delay={i * 0.07}>
                <StaffCard staff={m} lang={lang as Locale} dict={dict} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------------------------------------- Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow={dict.nav.testimonials} title={dict.testimonials.title} subtitle={dict.testimonials.subtitle} />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((tm, i) => (
              <Reveal key={tm.id} delay={i * 0.07}>
                <TestimonialCard testimonial={tm} lang={lang as Locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-gradient px-8 py-16 text-center text-white shadow-[var(--shadow-glow)] sm:px-16">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-8 h-56 w-56 rounded-full bg-accent-500/30 blur-3xl" />
            <h2 className="relative font-display text-4xl font-semibold sm:text-5xl">
              {dict.home.ctaTitle}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/80">{dict.home.ctaText}</p>
            <div className="relative mt-8">
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
        </Reveal>
      </section>
    </>
  );
}
