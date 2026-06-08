import Link from "next/link";
import { ViewTransition } from "@/components/ui/ViewTransition";
import { t, type Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/dictionaries";

type ServiceLike = {
  slug: string;
  name: unknown;
  description: unknown;
  durationMin: number;
  priceFrom: number | null;
};

export function ServiceCard({
  service,
  lang,
  dict,
}: {
  service: ServiceLike;
  lang: Locale;
  dict: Dictionary;
}) {
  const price = formatPrice(service.priceFrom, lang);
  return (
    <Link
      href={`/${lang}/services/${service.slug}`}
      transitionTypes={["nav-forward"]}
      className="group glass relative flex flex-col overflow-hidden rounded-[var(--radius-card)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
    >
      <ViewTransition name={`service-${service.slug}`}>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[var(--shadow-glow)]">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c3.5 0 6 2.4 6 6 0 3.2-1.2 5-2 8-.5 1.9-1.2 4-4 4s-3.5-2.1-4-4c-.8-3-2-4.8-2-8 0-3.6 2.5-6 6-6Z" />
          </svg>
        </span>
      </ViewTransition>

      <h3 className="mt-5 font-display text-xl font-semibold text-ink">
        {t(service.name, lang)}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/60">
        {t(service.description, lang)}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-teal-900/10 pt-4 text-sm">
        <span className="text-ink/50">
          {service.durationMin} {dict.common.minutes}
        </span>
        <span className="font-semibold text-teal-700">
          {price ? `${dict.common.from} ${price}` : dict.services.priceOnRequest}
        </span>
      </div>

      <span className="pointer-events-none absolute right-6 top-6 text-teal-600/0 transition-all duration-300 group-hover:text-teal-600">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </span>
    </Link>
  );
}
