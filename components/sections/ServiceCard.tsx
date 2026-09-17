import Link from "next/link";
import { ViewTransition } from "@/components/ui/ViewTransition";
import { t, type Locale } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import type { Dictionary } from "@/lib/dictionaries";

type ServiceLike = {
  slug: string;
  name: unknown;
  description: unknown;
  category: string | null;
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
      className="surface group flex flex-col rounded-[var(--radius-card)] p-6 transition-shadow hover:shadow-[var(--shadow-raised)]"
    >
      {service.category && (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
          {service.category}
        </span>
      )}
      <ViewTransition name={`service-${service.slug}`}>
        <h3 className="mt-2 font-display text-xl font-semibold text-ink group-hover:underline">
          {t(service.name, lang)}
        </h3>
      </ViewTransition>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/60">
        {t(service.description, lang)}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-sm">
        <span className="text-ink/50">
          {service.durationMin} {dict.common.minutes}
        </span>
        <span className="font-medium text-ink">
          {price ? `${dict.common.from} ${price}` : dict.services.priceOnRequest}
        </span>
      </div>
    </Link>
  );
}
