import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { t, type Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { getServiceBySlug } from "@/lib/data";
import { LinkButton } from "@/components/ui/Button";
import { ViewTransition } from "@/components/ui/ViewTransition";

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: t(service.name, lang as Locale),
    description: t(service.description, lang as Locale).slice(0, 160),
  };
}

export default async function ServiceDetailPage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const price = formatPrice(service.priceFrom, lang as Locale);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href={`/${lang}/services`}
        transitionTypes={["nav-back"]}
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18 9 12l6-6" />
        </svg>
        {dict.nav.services}
      </Link>

      <div className="mt-8">
        {service.category && (
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
            {service.category}
          </span>
        )}
        <ViewTransition name={`service-${service.slug}`}>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t(service.name, lang as Locale)}
          </h1>
        </ViewTransition>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-ink/70">
        {t(service.description, lang as Locale)}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="surface rounded-[var(--radius-card)] p-5">
          <div className="text-sm text-ink/50">{dict.services.detailDuration}</div>
          <div className="mt-1 font-display text-2xl font-semibold text-ink">
            {service.durationMin} {dict.common.minutes}
          </div>
        </div>
        <div className="surface rounded-[var(--radius-card)] p-5">
          <div className="text-sm text-ink/50">{dict.services.detailPrice}</div>
          <div className="mt-1 font-display text-2xl font-semibold text-ink">
            {price ? `${dict.common.from} ${price}` : dict.services.priceOnRequest}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <LinkButton
          href={`/${lang}/appointment?service=${service.slug}`}
          size="lg"
          transitionTypes={["nav-forward"]}
        >
          {dict.services.bookThis}
        </LinkButton>
      </div>
    </div>
  );
}
